import React from 'react';
import { Bot, User } from 'lucide-react';

export default function Message({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`message-row ${isUser ? 'message-row-user' : ''}`}>
      <div className={`avatar ${isUser ? 'avatar-user' : 'avatar-assistant'}`}>
        {isUser ? (
          <User size={20} color="white" />
        ) : (
          <Bot size={20} color="#e5e8efff" />
        )}
      </div>
      <div className={`message-bubble ${isUser ? 'message-bubble-user' : 'message-bubble-assistant'}`}>
        {message.content}
      </div>
    </div>
  );
}