import React from 'react';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';

const QuestionButton = ({ questionId, questionText, onClick }) => {
  return (
    <button
      type="button"
      onClick={() => onClick(questionId, questionText)}
      className="inline-flex items-center justify-center p-3 sm:p-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full shadow-md hover:shadow-lg hover:scale-105 active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 transition-all duration-200 touch-manipulation"
    >
      <QuestionMarkCircleIcon className="h-5 w-5 sm:h-4 sm:w-4" />
    </button>
  );
};

export default QuestionButton;