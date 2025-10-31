// components/LoadingIndicator.jsx
import React from 'react';
import { Bot } from 'lucide-react';

export default function LoadingIndicator() {
  return (
    <div className="message-row">
      <div className="avatar avatar-assistant">
        <Bot size={20} color="#374151" />
      </div>
      <div className="message-bubble message-bubble-assistant">
        <div className="loading-dots">
          <div className="dot dot-1"></div>
          <div className="dot dot-2"></div>
          <div className="dot dot-3"></div>
        </div>
      </div>
    </div>
  );
}