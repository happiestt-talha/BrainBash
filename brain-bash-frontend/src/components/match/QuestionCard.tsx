'use client';

import { Timer } from '../ui/Timer';
import { AnswerOption } from './AnswerOption';
import { useMatchStore } from '@/store/matchStore';
import { useSocket } from '@/hooks/useSocket';
import { MatchEvents } from '@/lib/constants';

export function QuestionCard() {
  const { currentQuestion, myAnswer, hasAnswered, lastReveal, matchId, submitMyAnswer } = useMatchStore();
  const socket = useSocket();

  if (!currentQuestion) {
    return <div className="text-center text-gray-400">Waiting for next question...</div>;
  }

  const isRevealed = !!lastReveal && lastReveal.questionId === currentQuestion.questionId;

  function handleSelect(index: number) {
    if (hasAnswered || !matchId || !currentQuestion) return;
    submitMyAnswer(index);
    socket.emit(MatchEvents.ANSWER_SUBMIT, { matchId, questionId: currentQuestion.questionId, selectedOption: index });
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <Timer pushedAt={currentQuestion.serverTimestamp} timeLimitMs={currentQuestion.timeLimitMs} />

      <h2 className="text-center text-2xl font-bold">{currentQuestion.text}</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {currentQuestion.options.map((option, index) => (
          <AnswerOption
            key={index}
            text={option}
            index={index}
            isSelected={myAnswer === index}
            isDisabled={hasAnswered}
            isRevealed={isRevealed}
            isCorrectAnswer={isRevealed && lastReveal!.correctOption === index}
            onSelect={handleSelect}
          />
        ))}
      </div>

      {hasAnswered && !isRevealed && (
        <p className="text-center text-gray-400">Answer locked in — waiting for others...</p>
      )}
    </div>
  );
}