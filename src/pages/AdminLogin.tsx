import React from 'react';
import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { AuthContext } from '@/contexts/authContext.tsx';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AdminLogin() {
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
      // 尝试管理员登录
      const success = login(username, password, true);
      
      if (success) {
        toast.success('管理员登录成功');
        navigate('/seller');
                 navigate('/seller');
      } else {
        toast.error('管理员账号或密码错误');
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
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <i className="fa-solid fa-user-shield text-blue-600 text-2xl"></i>
              </div>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              管理员登录
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              请输入管理员账号和密码
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
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="管理员用户名"
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
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="管理员密码"
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
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  记住我
                </label>
              </div>
              
               <div className="text-sm">
                 <span className="text-gray-600">普通用户登录？</span>
                 <Link to="/user-login" className="font-medium text-blue-600 hover:text-blue-500 ml-1">
                   前往普通用户登录
                 </Link>
               </div>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                    登录中...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-sign-in-alt mr-2"></i>
                     {t('adminLogin.loginButton')}
                  </>
                )}
              </button>
            </div>
            
            <div className="text-center text-sm text-gray-500">
              <p>管理员默认账号：<code className="bg-gray-100 px-1 py-0.5 rounded">admin</code></p>
              <p>管理员默认密码：<code className="bg-gray-100 px-1 py-0.5 rounded">admin123</code></p>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}