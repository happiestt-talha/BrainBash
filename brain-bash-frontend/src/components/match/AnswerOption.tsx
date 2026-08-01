'use client';

interface AnswerOptionProps {
  text: string;
  index: number;
  isSelected: boolean;
  isDisabled: boolean;
  isRevealed: boolean;
  isCorrectAnswer: boolean;
  onSelect: (index: number) => void;
}

const OPTION_COLORS = ['bg-red-500', 'bg-blue-500', 'bg-yellow-500', 'bg-green-500'];

export function AnswerOption({
  text,
  index,
  isSelected,
  isDisabled,
  isRevealed,
  isCorrectAnswer,
  onSelect,
}: AnswerOptionProps) {
  let bgClass = OPTION_COLORS[index % OPTION_COLORS.length];

  if (isRevealed) {
    if (isCorrectAnswer) bgClass = 'bg-green-600 ring-4 ring-green-300';
    else if (isSelected && !isCorrectAnswer) bgClass = 'bg-red-700 opacity-70';
    else bgClass = 'bg-gray-400 opacity-50';
  } else if (isSelected) {
    bgClass += ' ring-4 ring-white';
  }

  return (
    <button
      onClick={() => !isDisabled && onSelect(index)}
      disabled={isDisabled}
      className={`${bgClass} rounded-xl p-6 text-lg font-semibold text-white transition-all disabled:cursor-not-allowed`}
    >
      {text}
    </button>
  );
}