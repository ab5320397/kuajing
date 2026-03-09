import React from 'react';
import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { AuthContext } from '@/contexts/authContext.tsx';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // 手机号验证函数 (支持国内外手机号)
  const validatePhoneNumber = (phone: string) => {
    // 简单验证：至少8位数字，支持带+号开头的国际格式
    const phoneRegex = /^(\+|00)?[1-9]\d{7,14}$/;
    return phoneRegex.test(phone);
  };
  
  // 获取验证码
  const handleGetVerificationCode = () => {
    if (!phoneNumber) {
      toast.error('请输入手机号');
      return;
    }
    
    if (!validatePhoneNumber(phoneNumber)) {
      toast.error('请输入有效的手机号');
      return;
    }
    
    // 生成4位数字验证码
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedCode(code);
    setCodeSent(true);
    
    // 模拟发送验证码
    toast.success(`验证码已发送至 ${phoneNumber}，验证码为 ${code}（测试用）`);
    
    // 开始倒计时
    setCountdown(60);
    setIsCountingDown(true);
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsCountingDown(false);
          return 0;
        }
        return prev - 1;
      });
    }, );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 表单验证
    if (!username || !email || !password || !confirmPassword || !phoneNumber || !verificationCode) {
      toast.error('请填写所有必填字段');
      return;
    }
    
    if (!validatePhoneNumber(phoneNumber)) {
      toast.error('请输入有效的手机号');
      return;
    }
    
    if (!codeSent || verificationCode !== generatedCode) {
      toast.error('验证码不正确或已过期');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('两次输入的密码不一致');
      return;
    }
    
    if (password.length < 6) {
      toast.error('密码长度不能少于6个字符');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // 模拟注册成功后自动登录
      const success = login(username, password, false);
      
      if (success) {
        toast.success('注册成功，欢迎加入！');
        navigate('/');
      } else {
        toast.error('注册失败，请稍后重试');
      }
    } catch (error) {
      toast.error('注册失败，请重试');
      console.error('Registration error:', error);
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
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <i className="fa-solid fa-user-plus text-purple-600 text-2xl"></i>
              </div>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              创建新账号
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              填写以下信息注册账号
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
                   className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-purple-５00 focus:border-purple-500 focus:z-10 sm:text-sm"
                    placeholder={t('register.usernamePlaceholder')}
                   value={username}
                   onChange={(e) => setUsername(e.target.value)}
                 />
               </div>
               <div>
                 <label htmlFor="email" className="sr-only">电子邮箱</label>
                 <input
                   id="email"
                   name="email"
                   type="email"
                   required
                   className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                   placeholder="电子邮箱"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                 />
               </div>
               <div>
                 <label htmlFor="phoneNumber" className="sr-only">手机号</label>
                 <input
                   id="phoneNumber"
                   name="phoneNumber"
                   type="tel"
                   required
                   className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                   placeholder="手机号（支持国内外格式，如+1xxxxxxxxxx或1xxxxxxxxxx）"
                   value={phoneNumber}
                   onChange={(e) => setPhoneNumber(e.target.value)}
                 />
               </div>
               <div className="flex space-x-2">
                 <div className="flex-1">
                   <label htmlFor="verificationCode" className="sr-only">验证码</label>
                   <input
                     id="verificationCode"
                     name="verificationCode" type="text"
                     required
                     className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                     placeholder="验证码"
                     value={verificationCode}
                     onChange={(e) => setVerificationCode(e.target.value)}
                   />
                 </div>
                 <button
                   type="button"
                   onClick={handleGetVerificationCode}
                   disabled={isCountingDown || !phoneNumber}
                   className="whitespace-nowrap px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                 >
                   {isCountingDown ? `重新发送(${countdown}s)` : t('register.getVerificationCode')}
                 </button>
               </div>
               <div>
                 <label htmlFor="password" className="sr-only">密码</label>
                 <input
                   id="password"
                   name="password"
                   type="password"
                   required
                   className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                   placeholder="密码"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                 />
               </div>
               <div>
                 <label htmlFor="confirmPassword" className="sr-only">确认密码</label>
                 <input
                   id="confirmPassword"
                   name="confirmPassword"
                   type="password"
                   required
                   className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                   placeholder="确认密码"
                   value={confirmPassword}
                   onChange={(e) => setConfirmPassword(e.target.value)}
                 />
               </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="agree-terms"
                  name="agree-terms"
                  type="checkbox"
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-900">
                  我同意服务条款和隐私政策
                </label>
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                    处理中...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-user-plus mr-2"></i>
                    注册账号
                  </>
                )}
              </button>
            </div>
            
            <div className="text-center text-sm text-gray-600">
              <p>已有账号？{' '}
                <Link to="/user-login" className="font-medium text-purple-600 hover:text-purple-500">
                  前往登录
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}