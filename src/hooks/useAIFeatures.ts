import React from 'react';
import { useState, useEffect } from 'react';
import { mockProducts } from '@/lib/mockProducts';

// Custom hook for AI features
export const useAIFeatures = () => {
  const [trendingProducts, setTrendingProducts] = useState<any[]>([]);
  const [userRecommendations, setUserRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate fetching trending products
    const fetchTrendingProducts = async () => {
      setLoading(true);
      
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock trending products (randomly select 8 products)
        const shuffled = [...mockProducts].sort(() => 0.5 - Math.random());
        const trendings = shuffled.slice(0, 8).map(product => ({
          ...product,
          isTrending: true
        }));
        
        setTrendingProducts(trendings);
        
        // Mock user recommendations (based on trending products)
        const recommendations = trendings.slice(0, 4);
        setUserRecommendations(recommendations);
      } catch (error) {
        console.error('Error fetching AI features:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTrendingProducts();
  }, []);
  
  return {
    trendingProducts,
    userRecommendations,
    loading
  };
};