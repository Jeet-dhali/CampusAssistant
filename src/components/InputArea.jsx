// components/InputArea.jsx
import React from 'react';
import { Send } from 'lucide-react';

export default function InputArea({ input, setInput, onSubmit, isLoading }) {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="input-area">
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me anything about campus..."
          className="input-field"
          disabled={isLoading}
        />
        <button
          onClick={onSubmit}
          disabled={isLoading || !input.trim()}
          className="send-button"
        >
          <Send size={20} />
          <span>Send</span>
        </button>
      </div>
    </div>
  );
}