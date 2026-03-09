import { ReactNode, useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useLanguage } from '@/contexts/LanguageContext';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isChinaIP } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 模拟页面加载
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-background)] text-[var(--color-primary)]">
      {/* Preloader */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 animate-spin rounded-full border-4 border-[var(--color-accent)] border-t-transparent"></div>
            <div className="mt-4 text-sm text-[var(--color-secondary)]">Loading...</div>
          </div>
        </div>
      )}
      
      <Header />
      <main className="flex-grow container mx-auto px-4 md:px-8 lg:px-16 py-8 md:py-16">
        {!isLoading && children}
      </main>
      <Footer />
      
      {/* Back to top button */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-[var(--color-primary)] hover:bg-[var(--color-accent)] hover:text-white transition-colors z-40"
      >
        <i className="fa-solid fa-arrow-up"></i>
      </button>
    </div>
  );
}