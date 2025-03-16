import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2, User, Bot, Sparkles, Heart, Activity, Moon, Flame } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { motion } from 'framer-motion';

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
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([
    "How can I improve my sleep quality?",
    "What's my health score based on?",
    "Tips for reducing stress?",
    "How many steps should I aim for daily?",
    "How to improve my heart health?"
  ]);

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

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
    // Remove the selected question from suggestions
    setSuggestedQuestions(prev => prev.filter(q => q !== question));
  };
  
  return (
    <motion.div 
      className="fixed bottom-20 right-6 w-80 md:w-96 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col z-50"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header with glass morphism effect */}
      <div className="flex justify-between items-center p-3 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
        <div className="flex items-center">
          <Sparkles className="h-5 w-5 mr-2" />
          <h3 className="font-medium">Health Assistant</h3>
        </div>
        <motion.button 
          onClick={onClose}
          className="text-white hover:bg-blue-700 rounded-full p-1"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="h-5 w-5" />
        </motion.button>
      </div>
      
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message, index) => (
          <motion.div 
            key={index} 
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
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
          </motion.div>
        ))}
        {isLoading && (
          <motion.div 
            className="flex justify-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="bg-gray-100 text-gray-800 p-3 rounded-lg max-w-[80%]">
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Suggested questions that appear when no messages yet */}
        {messages.length <= 1 && !isLoading && (
          <div className="mt-4">
            <p className="text-xs text-gray-500 mb-2">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <motion.button
                  key={index}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-2 rounded-full flex items-center"
                  onClick={() => handleSuggestedQuestion(question)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {question.includes("sleep") && <Moon className="h-3 w-3 mr-1 text-indigo-500" />}
                  {question.includes("steps") && <Activity className="h-3 w-3 mr-1 text-blue-500" />}
                  {question.includes("heart") && <Heart className="h-3 w-3 mr-1 text-red-500" />}
                  {question.includes("stress") && <Flame className="h-3 w-3 mr-1 text-orange-500" />}
                  {question}
                </motion.button>
              ))}
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area with enhanced styling */}
      <div className="border-t border-gray-200 p-3 bg-gray-50 rounded-b-lg">
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
          <motion.button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className={`
              py-2 px-4 rounded-r-md flex items-center justify-center
              ${!input.trim() || isLoading 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'}
            `}
            whileHover={!input.trim() || isLoading ? {} : { scale: 1.05 }}
            whileTap={!input.trim() || isLoading ? {} : { scale: 0.95 }}
          >
            <Send className="h-4 w-4" />
          </motion.button>
        </div>
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-gray-500">
            Powered by Google AI
          </p>
          <button 
            onClick={() => setMessages([{ role: 'bot', content: 'Hi there! I\'m your health assistant. How can I help you with your health journey today?' }])}
            className="text-xs text-blue-600 hover:text-blue-800"
            disabled={isLoading}
          >
            Reset chat
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatbotModule;
