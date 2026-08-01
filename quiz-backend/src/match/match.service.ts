import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MatchStateStore } from './match-state.store';
import { ScoringService } from '../scoring/scoring.service';
import { LeaderboardService } from '../leaderboard/leaderboard.service';
import { QuestionsService } from '../questions/questions.service';
import { Match } from './entities/match.entity';
import { MatchParticipant } from './entities/match-participant.entity';
import { MatchQuestion } from './entities/match-question.entity';
import { MatchAnswer } from './entities/match-answer.entity';
import { Room } from '../rooms/entities/room.entity';
import { Question } from '../questions/entities/question.entity';
import { MatchState, MatchParticipantState } from './interfaces/match-state.interface';

const DEFAULT_TIME_LIMIT_MS = 15000;
const QUESTIONS_PER_MATCH = 10;

@Injectable()
export class MatchService {
  private readonly logger = new Logger(MatchService.name);

  constructor(
    private stateStore: MatchStateStore,
    private scoringService: ScoringService,
    private leaderboardService: LeaderboardService,
    private questionsService: QuestionsService,
    @InjectRepository(Match) private matchRepo: Repository<Match>,
    @InjectRepository(MatchParticipant) private participantRepo: Repository<MatchParticipant>,
    @InjectRepository(MatchQuestion) private matchQuestionRepo: Repository<MatchQuestion>,
    @InjectRepository(MatchAnswer) private matchAnswerRepo: Repository<MatchAnswer>,
    @InjectRepository(Room) private roomRepo: Repository<Room>,
    @InjectRepository(Question) private questionRepo: Repository<Question>,
  ) {}

  // ---- LOBBY PHASE ----

  async joinRoom(
    data: { roomCode: string; playerName: string; userId?: string },
    socketId: string,
  ) {
    const room = await this.roomRepo.findOne({ where: { code: data.roomCode.toUpperCase() } });
    if (!room) throw new NotFoundException('Room not found');

    // lobby participants are tracked directly as match_participants rows with matchId
    // pointing at a placeholder — simplest approach: create the participant row
    // once startMatch() actually creates the Match. For now, stash joiners in
    // Redis keyed by roomCode until match starts.
    const lobbyKey = `room:${data.roomCode}:lobby`;
    const existing = (await this.stateStore['redis'].getJson<any[]>(lobbyKey)) ?? [];

    let player = existing.find(
      (p) =>
        (data.userId && p.userId === data.userId) || (!data.userId && p.playerName === data.playerName),
    );

    if (player) {
      player.socketId = socketId;
    } else {
      player = {
        socketId,
        playerName: data.playerName,
        userId: data.userId ?? null,
        team: null as 'A' | 'B' | null,
        isHost: existing.length === 0,
      };
      existing.push(player);
    }

    await this.stateStore['redis'].setJson(lobbyKey, existing, 60 * 60 * 2);

    return { players: existing };
  }

  async assignTeam(data: { roomCode: string; playerId: string; team: 'A' | 'B' }) {
    const lobbyKey = `room:${data.roomCode}:lobby`;
    const existing = (await this.stateStore['redis'].getJson<any[]>(lobbyKey)) ?? [];

    const player = existing.find((p) => p.socketId === data.playerId);
    if (player) {
      player.team = data.team;
      await this.stateStore['redis'].setJson(lobbyKey, existing, 60 * 60 * 2);
    }

    return existing;
  }

  // ---- MATCH START ----

  async startMatch(roomCode: string) {
    const room = await this.roomRepo.findOne({ where: { code: roomCode.toUpperCase() } });
    if (!room) throw new NotFoundException('Room not found');

    const lobbyKey = `room:${roomCode}:lobby`;
    const lobbyPlayers = (await this.stateStore['redis'].getJson<any[]>(lobbyKey)) ?? [];

    const match = await this.matchRepo.save(
      this.matchRepo.create({
        roomId: room.id,
        totalQuestions: QUESTIONS_PER_MATCH,
        status: 'active',
      }),
    );

    // pull questions for the room's category, randomize order
    let questionPool = await this.questionRepo.find({
      where: { categoryId: room.categoryId, validated: true },
      take: 50,
    });

    // If the DB doesn't have enough questions for a full match,
    // auto-generate them via Groq AI on the fly.
    if (questionPool.length < QUESTIONS_PER_MATCH) {
      const needed = QUESTIONS_PER_MATCH - questionPool.length;
      this.logger.log(
        `Only ${questionPool.length} questions in pool for category ${room.categoryId}. Generating ${needed + 5} more via Groq...`,
      );
      const difficulty = room.difficulty === 'mixed' ? 'medium' : room.difficulty;
      try {
        const generated = await this.questionsService.generateAndStore({
          categoryId: room.categoryId,
          count: needed + 5, // generate extras to build up the pool
          difficulty,
        });
        questionPool = [...questionPool, ...generated];
      } catch (err) {
        this.logger.error('Groq question generation failed', err);
        // proceed with whatever we have — better than crashing
      }
    }

    const shuffled = questionPool.sort(() => Math.random() - 0.5).slice(0, QUESTIONS_PER_MATCH);

    const matchQuestions: MatchQuestion[] = [];
    for (let i = 0; i < shuffled.length; i++) {
      const mq = await this.matchQuestionRepo.save(
        this.matchQuestionRepo.create({
          matchId: match.id,
          questionId: shuffled[i].id,
          questionIndex: i,
          pushedAt: null,
          timeLimitMs: DEFAULT_TIME_LIMIT_MS,
        }),
      );
      matchQuestions.push(mq);
    }

    // convert lobby players into real match_participants rows
    const participants: MatchParticipantState[] = [];
    for (const p of lobbyPlayers) {
      const participant = await this.participantRepo.save(
        this.participantRepo.create({
          matchId: match.id,
          userId: p.userId,
          displayName: p.playerName,
          team: p.team,
          socketId: p.socketId,
        }),
      );
      participants.push({
        playerId: participant.id,
        displayName: participant.displayName,
        team: participant.team,
        totalScore: 0,
        currentStreak: 0,
        connectionStatus: 'connected',
      });
    }

    const state: MatchState = {
      matchId: match.id,
      roomId: room.id,
      status: 'active',
      totalQuestions: matchQuestions.length,
      currentQuestion: null,
      participants,
    };
    await this.stateStore.set(match.id, state);

    // stash the ordered question list separately so pushNextQuestion can walk it
    await this.stateStore['redis'].setJson(
      `match:${match.id}:questions`,
      matchQuestions,
      60 * 60 * 6,
    );

    return { matchId: match.id, totalQuestions: matchQuestions.length, category: room.categoryId };
  }

  // ---- QUESTION PUSH ----

  async pushNextQuestion(matchId: string) {
    const state = await this.stateStore.get(matchId);
    if (!state) throw new NotFoundException('Match state not found');

    const matchQuestions = await this.stateStore['redis'].getJson<MatchQuestion[]>(
      `match:${matchId}:questions`,
    );
    if (!matchQuestions) throw new NotFoundException('Match questions not found');

    const nextIndex = state.currentQuestion ? state.currentQuestion.index + 1 : 0;

    if (nextIndex >= matchQuestions.length) {
      return { matchEnded: true, finalResults: await this.buildFinalResults(matchId) };
    }

    const mq = matchQuestions[nextIndex];
    const question = await this.questionRepo.findOne({ where: { id: mq.questionId } });
    if (!question) throw new NotFoundException('Question not found');

    const pushedAt = Date.now();

    // persist pushedAt on the match_question row for scoring's elapsedMs calc
    await this.matchQuestionRepo.update(mq.id, { pushedAt });

    state.currentQuestion = {
      questionId: question.id,
      index: nextIndex,
      text: question.text,
      options: question.options,
      timeLimitMs: mq.timeLimitMs,
      pushedAt,
      answeredPlayerIds: [],
    };
    await this.stateStore.set(matchId, state);

    return {
      matchEnded: false,
      questionId: question.id,
      index: nextIndex,
      text: question.text,
      options: question.options,
      timeLimitMs: mq.timeLimitMs,
      serverTimestamp: pushedAt,
    };
  }

  // ---- ANSWER SUBMISSION ----

  async recordAnswer(
    data: { matchId: string; questionId: string; selectedOption: number },
    socketId: string,
  ): Promise<{ roomCode: string; playerId: string }> {
    const state = await this.stateStore.get(data.matchId);
    if (!state || !state.currentQuestion) throw new NotFoundException('No active question');

    const participant = await this.participantRepo.findOne({ where: { socketId } });
    if (!participant) throw new NotFoundException('Participant not found');

    // guard against double-submission for the same question
    if (state.currentQuestion.answeredPlayerIds.includes(participant.id)) {
      const room = await this.matchRepo.findOne({ where: { id: data.matchId } });
      return { roomCode: (await this.roomRepo.findOne({ where: { id: room?.roomId } }))?.code ?? '', playerId: participant.id };
    }

    const question = await this.questionRepo.findOne({ where: { id: data.questionId } });
    const isCorrect = question?.correctOptionIndex === data.selectedOption;

    const now = Date.now();
    const elapsedMs = Math.min(now - state.currentQuestion.pushedAt, state.currentQuestion.timeLimitMs);

    const scoreResult = this.scoringService.calculateScore({
      isCorrect,
      elapsedMs,
      timeLimitMs: state.currentQuestion.timeLimitMs,
      currentStreakBefore: participant.currentStreak,
    });

    const matchQuestions = await this.stateStore['redis'].getJson<MatchQuestion[]>(
      `match:${data.matchId}:questions`,
    );
    const currentMq = matchQuestions?.find((mq) => mq.questionId === data.questionId);

    await this.matchAnswerRepo.save(
      this.matchAnswerRepo.create({
        matchParticipantId: participant.id,
        matchQuestionId: currentMq?.id ?? '',
        selectedOptionIndex: data.selectedOption,
        isCorrect,
        elapsedMs,
        pointsEarned: scoreResult.pointsEarned,
        streakAtTime: scoreResult.newStreak,
      }),
    );

    // update persistent participant row
    participant.totalScore += scoreResult.pointsEarned;
    participant.currentStreak = scoreResult.newStreak;
    participant.bestStreak = Math.max(participant.bestStreak, scoreResult.newStreak);
    await this.participantRepo.save(participant);

    // update live Redis state
    state.currentQuestion.answeredPlayerIds.push(participant.id);
    const stateParticipant = state.participants.find((p) => p.playerId === participant.id);
    if (stateParticipant) {
      stateParticipant.totalScore = participant.totalScore;
      stateParticipant.currentStreak = participant.currentStreak;
    }
    await this.stateStore.set(data.matchId, state);

    const room = await this.roomRepo.findOne({ where: { id: state.roomId } });

    return { roomCode: room?.code ?? '', playerId: participant.id };
  }

  async haveAllPlayersAnswered(matchId: string, questionId: string): Promise<boolean> {
    const state = await this.stateStore.get(matchId);
    if (!state || !state.currentQuestion) return false;
    return state.currentQuestion.answeredPlayerIds.length >= state.participants.length;
  }

  // ---- TIMEOUT PENALTY ----

  /**
   * Called when the question timer expires. Any participant who hasn't
   * answered gets a -200 penalty and their streak is reset.
   */
  async penalizeUnanswered(matchId: string) {
    const state = await this.stateStore.get(matchId);
    if (!state || !state.currentQuestion) return;

    const matchQuestions = await this.stateStore['redis'].getJson<MatchQuestion[]>(
      `match:${matchId}:questions`,
    );
    const currentMq = matchQuestions?.find(
      (mq) => mq.questionId === state.currentQuestion!.questionId,
    );

    const penalty = this.scoringService.calculateTimeoutPenalty();

    for (const p of state.participants) {
      if (state.currentQuestion.answeredPlayerIds.includes(p.playerId)) continue;

      const participant = await this.participantRepo.findOne({ where: { id: p.playerId } });
      if (!participant) continue;

      // Record a "no answer" row so the history is complete
      await this.matchAnswerRepo.save(
        this.matchAnswerRepo.create({
          matchParticipantId: participant.id,
          matchQuestionId: currentMq?.id ?? '',
          selectedOptionIndex: -1, // sentinel: no answer given
          isCorrect: false,
          elapsedMs: state.currentQuestion.timeLimitMs,
          pointsEarned: penalty.pointsEarned,
          streakAtTime: 0,
        }),
      );

      // Update persistent participant row
      participant.totalScore = Math.max(0, participant.totalScore + penalty.pointsEarned);
      participant.currentStreak = 0;
      await this.participantRepo.save(participant);

      // Update live Redis state
      p.totalScore = participant.totalScore;
      p.currentStreak = 0;
    }

    await this.stateStore.set(matchId, state);
  }

  // ---- REVEAL ----

  async revealAnswers(matchId: string) {
    const state = await this.stateStore.get(matchId);
    if (!state || !state.currentQuestion) throw new NotFoundException('No active question');

    const question = await this.questionRepo.findOne({ where: { id: state.currentQuestion.questionId } });

    const matchQuestions = await this.stateStore['redis'].getJson<MatchQuestion[]>(
      `match:${matchId}:questions`,
    );
    const currentMq = matchQuestions?.find((mq) => mq.questionId === state.currentQuestion!.questionId);

    const answers = await this.matchAnswerRepo.find({
      where: { matchQuestionId: currentMq?.id },
    });

    const results = answers.map((a) => ({
      playerId: a.matchParticipantId,
      selectedOption: a.selectedOptionIndex,
      correct: a.isCorrect,
      pointsEarned: a.pointsEarned,
      streakCount: a.streakAtTime,
    }));

    const scores = state.participants.map((p) => ({
      playerId: p.playerId,
      displayName: p.displayName,
      totalScore: p.totalScore,
      team: p.team,
    }));

    return {
      questionId: question?.id,
      correctOption: question?.correctOptionIndex,
      results,
      scores,
    };
  }

  private async buildFinalResults(matchId: string) {
    const state = await this.stateStore.get(matchId);
    if (!state) return null;

    const sorted = [...state.participants]
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((p) => ({
        playerId: p.playerId,
        displayName: p.displayName,
        totalScore: p.totalScore,
        team: p.team,
      }));
    await this.matchRepo.update(matchId, { status: 'completed', endedAt: new Date() });
    await this.leaderboardService.recordMatchResults(matchId);

    return {
      finalScores: sorted,
      winnerId: sorted[0]?.playerId ?? null,
    };
  }

  // ---- DISCONNECT ----

  async handleDisconnect(socketId: string) {
    const participant = await this.participantRepo.findOne({ where: { socketId } });
    if (!participant) return;

    participant.connectionStatus = 'disconnected';
    await this.participantRepo.save(participant);

    const state = await this.stateStore.get(participant.matchId);
    if (state) {
      const stateParticipant = state.participants.find((p) => p.playerId === participant.id);
      if (stateParticipant) stateParticipant.connectionStatus = 'disconnected';
      await this.stateStore.set(participant.matchId, state);
    }
    // per your earlier decision: timer keeps running, match does not pause
  }

  async getMatchState(matchId: string): Promise<MatchState | null> {
    return this.stateStore.get(matchId);
  }
}