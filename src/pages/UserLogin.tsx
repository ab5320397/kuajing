import React from 'react';
import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { AuthContext } from '@/contexts/authContext.tsx';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

export default function UserLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('请输入用户名和密码');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // 尝试普通用户登录
      const success = login(username, password, false);
      
      if (success) {
        toast.success('登录成功，欢迎回来！');
        navigate('/');
      } else {
        toast.error('登录失败，请检查用户名和密码');
      }
    } catch (error) {
      toast.error('登录失败，请重试');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <i className="fa-solid fa-user text-green-600 text-2xl"></i>
              </div>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
               {t('userLogin.title')}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
               {t('userLogin.subtitle')}
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <input type="hidden" name="remember" value="true" />
            <div className="rounded-md -space-y-px">
              <div>
                <label htmlFor="username" className="sr-only">用户名</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                   placeholder={t('userLogin.usernamePlaceholder')}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">密码</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                   placeholder={t('userLogin.passwordPlaceholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                   {t('userLogin.rememberMe')}
                </label>
              </div>
              
               <div className="text-sm">
                  <span className="text-gray-600">{t('userLogin.needAdminLogin')}</span>
                 <Link to="/admin-login" className="font-medium text-green-600 hover:text-green-500 ml-1">
                    {t('userLogin.goToAdminLogin')}
                 </Link>
               </div>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                    登录中...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-sign-in-alt mr-2"></i>
                     {t('userLogin.loginButton')}
                  </>
                )}
              </button>
            </div>
            
            <div className="text-center text-sm text-gray-500">
               <p>{t('userLogin.testAccountInfo')}</p>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}