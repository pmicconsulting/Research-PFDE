import React from 'react';
import QuestionButton from '../QuestionButton';

/**
 * 質問ボタン付きフィールドラッパー
 */
const FieldWithQuestion = ({
  questionId,
  questionText,
  onQuestionClick,
  children
}) => {
  return (
    <div className="relative">
      <div className="flex items-start justify-between gap-4 mb-2">
        <label className="block text-sm font-medium text-gray-700 flex-1">
          {questionText}
        </label>
        <QuestionButton
          questionId={questionId}
          questionText={questionText}
          onClick={onQuestionClick}
        />
      </div>
      <div>
        {children}
      </div>
    </div>
  );
};

export default FieldWithQuestion;