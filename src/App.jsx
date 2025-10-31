// App.jsx
import React, { useState } from 'react';
import Header from './components/Header';
import ChatArea from './components/ChatArea';
import InputArea from './components/inputArea';
import './App.css';

export default function App() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI Campus Assistant. How can I help you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Call the backend API
      const response = await fetch('http://localhost:5000/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: userMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from server');
      }

      const data = await response.json();
      const finalMessages = [...newMessages, { role: 'assistant', content: data.answer }];
      setMessages(finalMessages);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = 'Sorry, I encountered an error. Please make sure the backend server is running on port 5000.';
      const finalMessages = [...newMessages, { role: 'assistant', content: errorMessage }];
      setMessages(finalMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([{
      role: 'assistant',
      content: 'Chat history cleared! How can I help you today?'
    }]);
  };

  return (
    <div className="app-container">
      <Header onClearHistory={handleClearHistory} />
      
      <ChatArea 
        messages={messages}
        isLoading={isLoading}
      />
      
      <InputArea 
        input={input}
        setInput={setInput}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}