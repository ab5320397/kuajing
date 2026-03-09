import React from 'react';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSettings } from '@/contexts/SettingsContext';
import { useAIChat } from '@/hooks/useAIChat';

// Message type definition
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface CustomerServiceChatProps {
  isOpen: boolean;
  onClose: () => void;
  productId?: number;
  productName?: string;
}

export default function CustomerServiceChat({ 
  isOpen, 
  onClose,
  productId,
  productName
}: CustomerServiceChatProps) {
  const { t, language } = useLanguage();
  const { customerServiceEnabled } = useSettings();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Custom hook for AI chat functionality
  const { getAIResponse } = useAIChat();

  // Initialize messages when chat window opens
  useEffect(() => {
    if (isOpen) {
      // Initial welcome message
      const welcomeMessages: Message[] = [
        {
          id: 'init-1',
          content: t('customerService.welcome'),
          sender: 'ai',
          timestamp: new Date()
        }
      ];
      
      // Add product-specific questions if product information is provided
      if (productName) {
        welcomeMessages.push({
          id: 'init-2',
          content: `I noticed you're looking at our ${productName}. Is there anything specific you'd like to know about this item?`,
          sender: 'ai',
          timestamp: new Date(Date.now() + 1000)
        });
      }
      
      setMessages(welcomeMessages);
    }
  }, [isOpen, t, productName]);

  // Send message
  const sendMessage = () => {
    if (!input.trim()) return;
    
    const newMessage: Message = {
      id: `user-${Date.now()}`,
      content: input.trim(),
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    
    // Simulate AI response
    getAIReply(input.trim());
  };

  // Get AI response
  const getAIReply = async (userMessage: string) => {
    setIsTyping(true);
    
    try {
      // Get response from AI service
      const aiResponse = await getAIResponse(userMessage, messages, language, productName);
      
      // Simulate network delay
      setTimeout(() => {
        const aiMessage: Message = {
          id: `ai-${Date.now()}`,
          content: aiResponse || t('customerService.defaultReply'),
          sender: 'ai',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
      }, 1000 + Math.random() * 1500);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setIsTyping(false);
      
      // Send error message
      const errorMessage: Message = {
        id: `ai-error-${Date.now()}`,
        content: 'I apologize, but I\'m having trouble responding right now. Please try again later or contact our support team directly.',
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  if (!isOpen || !customerServiceEnabled) return null;

  return (
    <div className="fixed bottom-0 right-0 z-50 w-full max-w-md mx-auto md:mx-0 md:right-6 md:bottom-6">
      {/* Background overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>
      
      {/* Chat window */}
      <div className="relative bg-white rounded-t-lg shadow-2xl flex flex-col h-[500px] w-full md:w-[400px]">
        {/* Chat header */}
        <div className="bg-[var(--color-primary)] text-white p-4 rounded-t-lg flex justify-between items-center">
          <div className="flex items-center">
            <i className="fa-solid fa-headset text-xl mr-2"></i>
            <h3 className="font-medium">{t('customerService.title')}</h3>
          </div>
          <div className="flex items-center">
            <span className="text-xs bg-green-500 w-2 h-2 rounded-full mr-2 animate-pulse"></span>
            <span className="text-xs">Online</span>
            <button 
              onClick={onClose}
              className="text-white hover:text-gray-200 ml-4"
            >
              <i className="fa-solid fa-times"></i>
            </button>
          </div>
        </div>
        
        {/* Chat content area */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === 'user' 
                      ? 'bg-[var(--color-primary)] text-white rounded-br-none' 
                      : 'bg-white text-gray-800 shadow-sm rounded-bl-none'
                  }`}
                >
                  <p className="leading-relaxed">{message.content}</p>
                  <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-lg shadow-sm rounded-bl-none max-w-[80%]">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Input area */}
        <div className="p-3 border-t">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('customerService.typeMessage')}
              className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="bg-[var(--color-primary)] text-white px-4 rounded-r-lg hover:bg-[var(--color-accent)] disabled:opacity-50"
            >
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-2 text-center">
            {t('customerService.availability')}
          </p>
        </div>
      </div>
    </div>
  );
}