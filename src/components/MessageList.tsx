import React, { useState } from 'react';
import { Message } from '../types';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Edit2, Trash2, RefreshCw, RotateCcw } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
  onEditMessage: (id: string, newContent: string) => void;
  onDeleteMessages: (ids: string[]) => void;
  onRegenerateResponse: (id: string) => void;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  onEditMessage,
  onDeleteMessages,
  onRegenerateResponse,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);

  const handleEdit = (id: string, content: string) => {
    setEditingId(id);
    setEditContent(content);
  };

  const handleSaveEdit = () => {
    if (editingId) {
      onEditMessage(editingId, editContent);
      setEditingId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  const handleSelect = (id: string) => {
    setSelectedMessages((prev) =>
      prev.includes(id) ? prev.filter((msgId) => msgId !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    onDeleteMessages(selectedMessages);
    setSelectedMessages([]);
  };

  return (
    <div className="space-y-4">
      {selectedMessages.length > 0 && (
        <div className="flex justify-end mb-2">
          <button
            onClick={handleDeleteSelected}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
          >
            Delete Selected
          </button>
        </div>
      )}
      {messages.map((message) => (
        <div
          key={message.id}
          className={`p-4 rounded-lg ${
            message.role === 'user' ? 'bg-blue-100' : 'bg-green-100'
          }`}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold capitalize">{message.role}</span>
            <div className="flex space-x-2">
              <input
                type="checkbox"
                checked={selectedMessages.includes(message.id)}
                onChange={() => handleSelect(message.id)}
                className="mr-2"
              />
              {message.role === 'model' && (
                <button
                  onClick={() => onRegenerateResponse(message.id)}
                  className="text-gray-600 hover:text-gray-800"
                  title="Regenerate response"
                >
                  <RotateCcw size={16} />
                </button>
              )}
              <button
                onClick={() => handleEdit(message.id, message.content)}
                className="text-gray-600 hover:text-gray-800"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => onDeleteMessages([message.id])}
                className="text-gray-600 hover:text-gray-800"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          {editingId === message.id ? (
            <div>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-2 border rounded"
                rows={4}
              />
              <div className="mt-2 space-x-2">
                <button
                  onClick={handleSaveEdit}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={tomorrow}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
          <div className="text-xs text-gray-500 mt-2">
            {message.role === 'model' && `Model: ${message.modelName} | `}
            Words: {message.wordCount} | Tokens: {message.tokenCount}
            {message.latency !== undefined && ` | Latency: ${message.latency}ms`}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;