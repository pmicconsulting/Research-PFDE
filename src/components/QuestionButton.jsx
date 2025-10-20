import React from 'react';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';

const QuestionButton = ({ questionId, questionText, onClick }) => {
  return (
    <button
      type="button"
      onClick={() => onClick(questionId, questionText)}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full text-xs font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
      aria-label="トラガールに質問する"
    >
      <SparklesIcon className="h-3.5 w-3.5" />
      <span>トラガールに質問！</span>
      <QuestionMarkCircleIcon className="h-3.5 w-3.5" />
    </button>
  );
};

export default QuestionButton;