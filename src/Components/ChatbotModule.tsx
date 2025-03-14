import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2, User, Bot, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GoogleGenerativeAI } from "@google/generative-ai";

interface Message {
  role: 'user' | 'bot';
  content: string;
}

interface ChatbotModuleProps {
  onClose: () => void;
}

const ChatbotModule: React.FC<ChatbotModuleProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: 'Hi there! I\'m your health assistant. How can I help you with your health journey today?' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { currentUser } = useAuth();

  // Get API key from environment variables
  const API_KEY = import.meta.env.VITE_GOOGLE_AI_API_KEY;
  
  // Initialize the Google Generative AI
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Focus input when chat opens
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      const prompt = `
        You are a health assistant helping a user ${currentUser?.name || 'User'} with their health and wellness questions.
        Always provide friendly, conversational, and helpful advice about health-related topics.
        
        Current user health metrics:
        - Daily steps average: 7,500
        - Resting heart rate: 68 bpm
        - Average sleep: 7.2 hours
        - Stress level: 3/5 (moderate)
        
        User request: ${input}
      `;
      
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      const botMessage = {
        role: 'bot' as const,
        content: responseText
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error calling AI service:', error);
      setMessages(prev => [
        ...prev,
        { 
          role: 'bot', 
          content: "I'm having trouble connecting to my knowledge database. Please try again in a moment." 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className="fixed bottom-20 right-6 w-80 md:w-96 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col z-50">
      {/* Header */}
      <div className="flex justify-between items-center p-3 border-b border-gray-200 bg-blue-600 text-white rounded-t-lg">
        <div className="flex items-center">
          <Sparkles className="h-5 w-5 mr-2" />
          <h3 className="font-medium">Health Assistant</h3>
        </div>
        <button 
          onClick={onClose}
          className="text-white hover:bg-blue-700 rounded-full p-1"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`
              ${message.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg' 
                : 'bg-gray-100 text-gray-800 rounded-tl-lg rounded-tr-lg rounded-br-lg'}
              p-3 max-w-[80%] shadow-sm
            `}>
              <div className="flex items-center mb-1">
                {message.role === 'user' ? (
                  <User className="h-4 w-4 mr-1" />
                ) : (
                  <Bot className="h-4 w-4 mr-1" />
                )}
                <span className="text-xs font-medium">
                  {message.role === 'user' ? 'You' : 'HealthBot'}
                </span>
              </div>
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 p-3 rounded-lg max-w-[80%]">
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <div className="border-t border-gray-200 p-3">
        <div className="flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about your health..."
            className="flex-1 border border-gray-300 rounded-l-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className={`
              py-2 px-4 rounded-r-md flex items-center justify-center
              ${!input.trim() || isLoading 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'}
            `}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1 text-center">
          Powered by Google AI
        </p>
      </div>
    </div>
  );
};

export default ChatbotModule;
