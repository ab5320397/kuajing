import React from 'react';
import { useState } from 'react';

// Custom hook for AI chat functionality
export const useAIChat = () => {
  const [loading, setLoading] = useState(false);
  
  // Mock function to simulate AI response
  const getAIResponse = async (
    userMessage: string,
    messages: any[],
    language: string,
    productName?: string
  ): Promise<string> => {
    setLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));
      
      // Mock responses based on keywords
      const lowerMessage = userMessage.toLowerCase();
      
      if (lowerMessage.includes('size') || lowerMessage.includes('fit')) {
        return productName 
          ? `The ${productName} runs true to size. We recommend taking your usual size. If you prefer a looser fit, consider sizing up.`
          : 'Our products typically run true to size. Please refer to our size guide for detailed measurements.';
      }
      
      if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery')) {
        return language === 'zh' 
          ? '我们提供全球配送服务。标准配送通常需要7-14个工作日，加急配送需要3-5个工作日。'
          : 'We offer worldwide shipping. Standard delivery usually takes 7-14 business days, and express delivery takes 3-5 business days.';
      }
      
      if (lowerMessage.includes('return') || lowerMessage.includes('refund')) {
        return language === 'zh'
          ? '我们接受30天内的无理由退货。商品必须保持全新状态且带有原始包装。'
          : 'We accept returns within 30 days of delivery. Items must be in new condition with original packaging.';
      }
      
      // Default response
      return language === 'zh'
        ? '感谢您的咨询！我们的客服团队将很快为您提供详细的帮助。'
        : 'Thank you for your inquiry! Our customer service team will be happy to assist you with more details.';
    } catch (error) {
      console.error('Error getting AI response:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    getAIResponse,
    loading
  };
};