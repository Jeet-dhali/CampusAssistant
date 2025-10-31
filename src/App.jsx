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

  // Mock AI response - replace this with actual API call later
  const getMockResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('course') || lowerMessage.includes('class')) {
      return 'I can help you with course information! Our campus offers various programs including Computer Science, Business Administration, Engineering, and Liberal Arts. What specific course are you interested in?';
    } else if (lowerMessage.includes('schedule') || lowerMessage.includes('time')) {
      return 'Class schedules vary by semester. Most classes run Monday through Friday between 8 AM and 6 PM. Would you like information about a specific course schedule?';
    } else if (lowerMessage.includes('library') || lowerMessage.includes('study')) {
      return 'The campus library is open Monday-Friday 7 AM to 11 PM, and weekends 9 AM to 9 PM. We have study rooms, computer labs, and a quiet study area available.';
    } else if (lowerMessage.includes('cafeteria') || lowerMessage.includes('food') || lowerMessage.includes('dining')) {
      return 'Our main cafeteria serves breakfast (7-10 AM), lunch (11 AM-3 PM), and dinner (5-8 PM). We also have a coffee shop and food court open throughout the day.';
    } else if (lowerMessage.includes('event') || lowerMessage.includes('activity')) {
      return 'We have various campus events! This week includes a tech talk on Wednesday, sports day on Friday, and a cultural festival on Saturday.';
    } else {
      return 'I\'m here to help! You can ask me about courses, schedules, campus facilities, events, dining options, or anything else campus-related.';
    }
  };

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      const aiResponse = getMockResponse(userMessage);
      const finalMessages = [...newMessages, { role: 'assistant', content: aiResponse }];
      setMessages(finalMessages);
      setIsLoading(false);
    }, 1000);
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