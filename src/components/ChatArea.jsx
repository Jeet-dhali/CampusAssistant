import React, { useEffect, useRef } from 'react';
import Message from './Message';
import LoadingIndicator from './loadingIndicator';

export default function ChatArea({ messages, isLoading }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="chat-area">
      <div className="messages-container">
        {messages.map((msg, idx) => (
          <Message key={idx} message={msg} />
        ))}
        
        {isLoading && <LoadingIndicator />}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}