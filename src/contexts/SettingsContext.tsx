import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 定义设置类型
interface Settings {
  customerServiceEnabled: boolean;
  setCustomerServiceEnabled: (enabled: boolean) => void;
}

// 创建上下文
const SettingsContext = createContext<Settings | undefined>(undefined);

// 提供者组件
export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [customerServiceEnabled, setCustomerServiceEnabled] = useState(true);

  // 从localStorage加载设置
  useEffect(() => {
    try {
      const savedSetting = localStorage.getItem('customerServiceEnabled');
      if (savedSetting !== null) {
        setCustomerServiceEnabled(savedSetting === 'true');
      }
    } catch (error) {
      console.error('Failed to load settings from localStorage:', error);
    }
  }, []);

  // 保存设置到localStorage
  useEffect(() => {
    try {
      localStorage.setItem('customerServiceEnabled', customerServiceEnabled.toString());
    } catch (error) {
      console.error('Failed to save settings to localStorage:', error);
    }
  }, [customerServiceEnabled]);

  return (
    <SettingsContext.Provider value={{
      customerServiceEnabled,
      setCustomerServiceEnabled
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

// 自定义Hook，方便使用设置上下文
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}