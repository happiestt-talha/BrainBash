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

const OPTION_STYLES = [
  { bg: 'bg-red-500', hover: 'hover:bg-red-400', ring: 'ring-red-300', shadow: 'shadow-red-500/30' },
  { bg: 'bg-blue-500', hover: 'hover:bg-blue-400', ring: 'ring-blue-300', shadow: 'shadow-blue-500/30' },
  { bg: 'bg-amber-500', hover: 'hover:bg-amber-400', ring: 'ring-amber-300', shadow: 'shadow-amber-500/30' },
  { bg: 'bg-emerald-500', hover: 'hover:bg-emerald-400', ring: 'ring-emerald-300', shadow: 'shadow-emerald-500/30' },
];

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export function AnswerOption({
  text,
  index,
  isSelected,
  isDisabled,
  isRevealed,
  isCorrectAnswer,
  onSelect,
}: AnswerOptionProps) {
  const style = OPTION_STYLES[index % OPTION_STYLES.length];

  let classes = '';

  if (isRevealed) {
    if (isCorrectAnswer) {
      classes = 'bg-emerald-600 ring-4 ring-emerald-300 scale-105 shadow-lg shadow-emerald-400/40';
    } else if (isSelected && !isCorrectAnswer) {
      classes = 'bg-red-700 ring-4 ring-red-400 opacity-80 scale-95';
    } else {
      classes = 'bg-gray-600 opacity-40 scale-95';
    }
  } else if (isSelected) {
    classes = `${style.bg} ring-4 ring-white scale-105 shadow-xl ${style.shadow}`;
  } else if (isDisabled) {
    classes = `${style.bg} opacity-50 cursor-not-allowed`;
  } else {
    classes = `${style.bg} ${style.hover} hover:scale-[1.03] hover:shadow-lg ${style.shadow} cursor-pointer active:scale-95`;
  }

  return (
    <button
      onClick={() => onSelect(index)}
      disabled={isDisabled}
      className={`
        ${classes}
        relative flex items-center gap-4 rounded-2xl px-6 py-5
        text-lg font-bold text-white
        transition-all duration-200 ease-out
        focus:outline-none focus:ring-4 focus:ring-white/50
      `}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-base font-black">
        {OPTION_LABELS[index]}
      </span>
      <span className="text-left">{text}</span>

      {isRevealed && isCorrectAnswer && (
        <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-lg shadow-md">
          ✓
        </span>
      )}
      {isRevealed && isSelected && !isCorrectAnswer && (
        <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-lg shadow-md">
          ✗
        </span>
      )}
    </button>
  );
}