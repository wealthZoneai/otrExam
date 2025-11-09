// src/components/exam/QuestionCard.tsx
import React from "react";
import type { Question } from "../types/exam";

interface Props {
  question: Question;
  selected: string | null;
  onSelect: (opt: string) => void;
  isDisabled: boolean;
}

const QuestionCard: React.FC<Props> = ({
  question,
  selected,
  onSelect,
  isDisabled,
}) => (
  <div className="bg-white shadow p-4 mb-4 rounded-lg border border-gray-200">
    <h3 className="font-bold mb-3 text-gray-900">{question.questionText}</h3>

    {question.options.map((opt, idx) => (
      <button
        key={idx}
        onClick={() => onSelect(opt)}
        disabled={isDisabled}
        className={`w-full text-left p-2 border-2 rounded-lg mb-2 text-sm ${
          selected === opt
            ? "border-indigo-500 bg-indigo-50"
            : "border-gray-200 hover:bg-gray-50"
        } ${isDisabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
      >
        {opt}
      </button>
    ))}
  </div>
);

export default QuestionCard;
