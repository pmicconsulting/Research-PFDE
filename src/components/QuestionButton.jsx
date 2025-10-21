import React from 'react';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';

const QuestionButton = ({ questionId, questionText, onClick }) => {
  return (
    <button
      type="button"
      onClick={() => onClick(questionId, questionText)}
      className="inline-flex items-center justify-center p-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
    >
      <QuestionMarkCircleIcon className="h-4 w-4" />
    </button>
  );
};

export default QuestionButton;