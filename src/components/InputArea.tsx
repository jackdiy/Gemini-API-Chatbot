import React, { useState } from 'react';
import { Send, Paperclip, Mic } from 'lucide-react';

interface InputAreaProps {
  onSendMessage: (content: string) => void;
}

const InputArea: React.FC<InputAreaProps> = ({ onSendMessage }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 p-4 border-t dark:border-gray-700">
      <div className="flex items-center space-x-2">
        <button type="button" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
          <Paperclip size={20} />
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow p-2 border rounded-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <button type="button" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
          <Mic size={20} />
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
        >
          <Send size={20} />
        </button>
      </div>
    </form>
  );
};

export default InputArea;