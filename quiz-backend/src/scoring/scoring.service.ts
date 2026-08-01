import { Injectable } from '@nestjs/common';

export interface ScoreResult {
  pointsEarned: number;
  newStreak: number;
  streakBonus: number;
}

@Injectable()
export class ScoringService {
  private readonly BASE_POINTS = 1000;
  private readonly TIMEOUT_PENALTY = -200;

  calculateScore(params: {
    isCorrect: boolean;
    elapsedMs: number;
    timeLimitMs: number;
    currentStreakBefore: number;
  }): ScoreResult {
    if (!params.isCorrect) {
      return { pointsEarned: 0, newStreak: 0, streakBonus: 0 };
    }

    const clampedElapsed = Math.min(params.elapsedMs, params.timeLimitMs);
    const speedFactor = 1 - clampedElapsed / params.timeLimitMs / 2;
    const speedPoints = Math.round(this.BASE_POINTS * speedFactor);

    const newStreak = params.currentStreakBefore + 1;
    let streakBonus = 0;
    if (newStreak >= 5) streakBonus = 200;
    else if (newStreak >= 3) streakBonus = 100;
    else if (newStreak >= 2) streakBonus = 50;

    return { pointsEarned: speedPoints + streakBonus, newStreak, streakBonus };
  }

  /**
   * Penalty applied when a player fails to answer within the time limit.
   * Breaks the streak and deducts points.
   */
  calculateTimeoutPenalty(): ScoreResult {
    return {
      pointsEarned: this.TIMEOUT_PENALTY,
      newStreak: 0,
      streakBonus: 0,
    };
  }
}