'use client';

import { useState, useEffect } from 'react';
import { Timer } from '../ui/Timer';
import { AnswerOption } from './AnswerOption';
import { useMatchStore } from '@/store/matchStore';
import { useSocket } from '@/hooks/useSocket';
import { MatchEvents } from '@/lib/constants';

export function QuestionCard() {
  const { currentQuestion, myAnswer, hasAnswered, lastReveal, matchId, roomCode, submitMyAnswer } = useMatchStore();
  const socket = useSocket();
  const [timeExpired, setTimeExpired] = useState(false);

  // Reset timeExpired when a new question arrives
  useEffect(() => {
    setTimeExpired(false);
  }, [currentQuestion?.questionId]);

  if (!currentQuestion) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-600 border-t-purple-500" />
        <p className="text-lg text-gray-400">Waiting for next question...</p>
      </div>
    );
  }

  const isRevealed = !!lastReveal && lastReveal.questionId === currentQuestion.questionId;
  const isDisabled = hasAnswered || timeExpired;
  const showSkipButton = (timeExpired || hasAnswered) && !isRevealed;

  function handleSelect(index: number) {
    if (isDisabled || !matchId || !currentQuestion) return;
    submitMyAnswer(index);
    socket.emit(MatchEvents.ANSWER_SUBMIT, { matchId, questionId: currentQuestion.questionId, selectedOption: index });
  }

  function handleTimeUp() {
    setTimeExpired(true);
  }

  function handleSkip() {
    if (!matchId || !currentQuestion) return;
    socket.emit(MatchEvents.QUESTION_SKIP, {
      matchId,
      roomCode: roomCode ?? '',
      questionId: currentQuestion.questionId,
    });
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <Timer
        pushedAt={currentQuestion.serverTimestamp}
        timeLimitMs={currentQuestion.timeLimitMs}
        onTimeUp={handleTimeUp}
      />

      <div className="text-center">
        <span className="mb-2 inline-block rounded-full bg-purple-500/20 px-3 py-1 text-sm font-medium text-purple-300">
          Question {currentQuestion.index + 1}
        </span>
        <h2 className="text-2xl font-bold leading-snug">{currentQuestion.text}</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {currentQuestion.options.map((option, index) => (
          <AnswerOption
            key={index}
            text={option}
            index={index}
            isSelected={myAnswer === index}
            isDisabled={isDisabled}
            isRevealed={isRevealed}
            isCorrectAnswer={isRevealed && lastReveal!.correctOption === index}
            onSelect={handleSelect}
          />
        ))}
      </div>

      {hasAnswered && !isRevealed && (
        <p className="animate-pulse text-center text-gray-400">
          ✅ Answer locked in — waiting for others...
        </p>
      )}
      {timeExpired && !hasAnswered && !isRevealed && (
        <p className="text-center text-red-400">
          ⏰ Time&apos;s up! You didn&apos;t answer this one. (-200 pts)
        </p>
      )}

      {showSkipButton && (
        <button
          onClick={handleSkip}
          className="mx-auto flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white shadow-lg shadow-purple-500/25 transition-all hover:scale-105 hover:bg-purple-500 active:scale-95"
        >
          Skip → Next Question
        </button>
      )}
    </div>
  );
}