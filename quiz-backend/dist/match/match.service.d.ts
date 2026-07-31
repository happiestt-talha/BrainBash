import { Repository } from 'typeorm';
import { MatchStateStore } from './match-state.store';
import { ScoringService } from '../scoring/scoring.service';
import { Match } from './entities/match.entity';
import { MatchParticipant } from './entities/match-participant.entity';
import { MatchQuestion } from './entities/match-question.entity';
import { MatchAnswer } from './entities/match-answer.entity';
import { Room } from '../rooms/entities/room.entity';
import { Question } from '../questions/entities/question.entity';
import { MatchParticipantState } from './interfaces/match-state.interface';
export declare class MatchService {
    private stateStore;
    private scoringService;
    private matchRepo;
    private participantRepo;
    private matchQuestionRepo;
    private matchAnswerRepo;
    private roomRepo;
    private questionRepo;
    constructor(stateStore: MatchStateStore, scoringService: ScoringService, matchRepo: Repository<Match>, participantRepo: Repository<MatchParticipant>, matchQuestionRepo: Repository<MatchQuestion>, matchAnswerRepo: Repository<MatchAnswer>, roomRepo: Repository<Room>, questionRepo: Repository<Question>);
    joinRoom(data: {
        roomCode: string;
        playerName: string;
        userId?: string;
    }, socketId: string): Promise<{
        players: any[];
    }>;
    startMatch(roomCode: string): Promise<{
        matchId: string;
        totalQuestions: number;
        category: string;
    }>;
    pushNextQuestion(matchId: string): Promise<{
        matchEnded: boolean;
        finalResults: {
            finalScores: MatchParticipantState[];
            winnerId: string;
        } | null;
        questionId?: undefined;
        index?: undefined;
        text?: undefined;
        options?: undefined;
        timeLimitMs?: undefined;
        serverTimestamp?: undefined;
    } | {
        matchEnded: boolean;
        questionId: string;
        index: number;
        text: string;
        options: string[];
        timeLimitMs: number;
        serverTimestamp: number;
        finalResults?: undefined;
    }>;
    recordAnswer(data: {
        matchId: string;
        questionId: string;
        selectedOption: number;
    }, socketId: string): Promise<{
        roomCode: string;
        playerId: string;
    }>;
    haveAllPlayersAnswered(matchId: string, questionId: string): Promise<boolean>;
    revealAnswers(matchId: string): Promise<{
        questionId: string | undefined;
        correctOption: number | undefined;
        results: {
            playerId: string;
            selectedOption: number | null;
            correct: boolean;
            pointsEarned: number;
            streakCount: number;
        }[];
        scores: {
            playerId: string;
            totalScore: number;
            team: "A" | "B" | null;
        }[];
    }>;
    private buildFinalResults;
    handleDisconnect(socketId: string): Promise<void>;
}
