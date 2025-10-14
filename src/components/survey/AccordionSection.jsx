import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

const AccordionSection = ({ title, children, isOpen, onToggle, disabled = false }) => {
  return (
    <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        className={`w-full px-6 py-4 flex items-center justify-between transition-all duration-200 ${
          disabled
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : isOpen
            ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        }`}
      >
        <h3 className="text-lg font-semibold text-left">{title}</h3>
        <div className="ml-4">
          {isOpen ? (
            <ChevronUpIcon className="h-5 w-5" />
          ) : (
            <ChevronDownIcon className="h-5 w-5" />
          )}
        </div>
      </button>

      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        {isOpen && (
          <div className="p-6 bg-white border-t border-gray-200">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccordionSection;