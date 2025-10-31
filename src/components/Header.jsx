import React from 'react';
import { Bot, Trash2 } from 'lucide-react';

export default function Header({ onClearHistory }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <div className="icon-box">
            <Bot size={24} color="white" />
          </div>
          <div>
            <h1 className="title">AI Campus Assistant</h1>
            <p className="subtitle">Your 24/7 campus guide</p>
          </div>
        </div>
        
        <div className="header-right">
          <button 
            className="header-button"
            onClick={onClearHistory}
            title="Clear Chat"
          >
            <Trash2 size={18} />
            Clear
          </button>
        </div>
      </div>
    </header>
  );
}