import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface SystemPromptProps {
  systemPrompt: string;
  onSystemPromptChange: (newPrompt: string) => void;
}

const SystemPrompt: React.FC<SystemPromptProps> = ({ systemPrompt, onSystemPromptChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      const lineHeight = parseInt(getComputedStyle(textareaRef.current).lineHeight);
      const lines = textareaRef.current.value.split('\n').length;
      if (lines > 4 && isExpanded) {
        textareaRef.current.style.height = `${lineHeight * lines}px`;
      } else {
        textareaRef.current.style.height = `${lineHeight * 4}px`;
      }
    }
  }, [systemPrompt, isExpanded]);

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-4 border-b dark:border-gray-700 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">系统提示（角色设定）</h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>
      <textarea
        ref={textareaRef}
        value={systemPrompt}
        onChange={(e) => onSystemPromptChange(e.target.value)}
        className={`w-full p-2 border rounded resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
          isExpanded ? '' : 'max-h-24 overflow-hidden'
        }`}
        placeholder="输入系统提示（角色设定）..."
      />
    </div>
  );
};

export default SystemPrompt;