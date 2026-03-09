import { createContext, useState, ReactNode, useMemo, useEffect } from "react";

// 定义用户类型
interface User {
  name: string;
  email: string;
  isAdmin: boolean;
  membership: {
    level: 'regular' | 'silver' | 'gold' | 'platinum';
    points: number;
    benefits: {
      discountRate: number;
      pointsMultiplier: number;
      freeShippingThreshold: number;
    }
  }
}

// 定义上下文类型
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string, isAdmin: boolean) => boolean;
  logout: () => void;
  setIsAuthenticated: (value: boolean) => void;
}

// 创建上下文
export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: () => false,
  logout: () => {},
  setIsAuthenticated: () => {}
});

// 提供者组件
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // 从localStorage加载用户状态
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        setIsAuthenticated(true);
        setUser(userData);
      }
    } catch (error) {
      console.error('Failed to load user data from localStorage:', error);
    }
  }, []);

  // 模拟登录功能
  const login = (username: string, password: string, isAdmin: boolean): boolean => {
    // 管理员账户验证 (固定管理员账户)
    const adminCredentials = {
      username: 'admin',
      password: 'admin123'
    };
    
    // 验证管理员登录
    if (isAdmin) {
      if (username === adminCredentials.username && password === adminCredentials.password) {
        const adminUser: User = {
          name: 'Administrator',
          email: 'admin@example.com',
          isAdmin: true,
          membership: {
            level: 'platinum',
            points: 0,
            benefits: {
              discountRate: 0.8,
              pointsMultiplier: 2,
              freeShippingThreshold: 0
            }
          }
        };
        
        setIsAuthenticated(true);
        setUser(adminUser);
        localStorage.setItem('currentUser', JSON.stringify(adminUser));
        return true;
      }
      return false;
    }
    
    // 普通用户登录 (任意非空用户名和密码)
    if (username && password) {
      const regularUser: User = {
        name: username,
        email: username.includes('@') ? username : `${username}@example.com`,
        isAdmin: false,
        membership: {
          level: 'regular',
          points: 0,
          benefits: {
            discountRate: 1,
            pointsMultiplier: 1,
            freeShippingThreshold: 99
          }
        }
      };
      
      setIsAuthenticated(true);
      setUser(regularUser);
      localStorage.setItem('currentUser', JSON.stringify(regularUser));
      return true;
    }
    
    return false;
  };

  // 登出功能
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  // 准备上下文值
  const contextValue = useMemo(() => ({
    isAuthenticated,
    user,
    login,
    logout,
    setIsAuthenticated
  }), [isAuthenticated, user]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}