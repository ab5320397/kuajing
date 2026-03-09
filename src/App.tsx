import React from 'react';
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthProvider, AuthContext } from '@/contexts/authContext.tsx';
import { CartProvider } from '@/contexts/CartContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ProductProvider } from '@/contexts/ProductContext';
 import { SettingsProvider } from '@/contexts/SettingsContext';
 import { BannerProvider } from '@/contexts/BannerContext';
 import Layout from '@/components/Layout';
 
   // Pages
   import Dashboard from "@/pages/Seller/Dashboard";
 import Home from "@/pages/Home";
 import CategoryPage from "@/pages/CategoryPage";
 import Settings from "@/pages/Settings";
 import ProductManagement from "@/pages/Seller/ProductManagement";
 import ProductUpload from "@/pages/Seller/ProductUpload";
 import OrderManagement from "@/pages/Seller/OrderManagement";
 import ShippingManagement from "@/pages/Seller/ShippingManagement";
 import AfterSalesManagement from "@/pages/Seller/AfterSalesManagement";
 import ProductDetail from "@/pages/ProductDetail";
 import Orders from "@/pages/Orders";
 import Cart from "@/pages/Cart";
 import Checkout from "@/pages/Checkout";
 import AdminLogin from "@/pages/AdminLogin";
 import UserLogin from "@/pages/UserLogin";
 import Register from "@/pages/Register";
 import Payment from "@/pages/Payment";

   // 用户认证路由组件 - 需要登录访问
  const PrivateRoute = ({ children }: { children: React.ReactNode }) => { 
    const { isAuthenticated } = useContext(AuthContext);
    const location = useLocation();
    
    if (!isAuthenticated) { 
      // 重定向到登录页面，并记录当前位置以便登录后返回
      return <Navigate to="/user-login" state={{ from: location }} replace />;
    }
    
    return <>{children}</>; 
  };

  // 受保护的路由组件 - 只允许管理员访问
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useContext(AuthContext);
  
  if (!isAuthenticated || !user?.isAdmin) {
    return <Navigate to="/admin-login" replace />;
  }
  
  return <>{children}</>;
};

export default function App() {
  return (
     <AuthProvider>
       <LanguageProvider>
       <ProductProvider>
          <SettingsProvider>
          <BannerProvider>
          <CartProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:categoryKey" element={<CategoryPage />} />
           <Route path="/product/:id" element={<ProductDetail />} />
             <Route path="/cart" element={<Cart />} />
             <Route path="/checkout" element={
               <PrivateRoute>
                 <Checkout />
               </PrivateRoute>
              } />
             <Route path="/checkout" element={<Checkout />} />
             <Route path="/payment/:id" element={
               <PrivateRoute>
                 <Payment />
               </PrivateRoute>
             } />
               <Route path="/settings" element={<Settings />} />
                 <Route path="/orders" element={<Orders />} />
                 
              {/* 登录路由 */}
              <Route path="/user-login" element={<UserLogin />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              
              {/* 管理员路由 - 受保护 */}
               <Route path="/seller" element={
                 <AdminRoute>
                   <Dashboard />
                 </AdminRoute>
               } />
               <Route path="/seller/products" element={
                <AdminRoute>
                  <ProductManagement />
                </AdminRoute>
              } />
              <Route path="/seller/upload" element={
                <AdminRoute>
                  <ProductUpload />
                </AdminRoute>
              } />
               <Route path="/seller/orders" element={
                 <AdminRoute>
                   <OrderManagement />
                 </AdminRoute>
               } />
               <Route path="/seller/shipping" element={
                 <AdminRoute>
                   <ShippingManagement />
                 </AdminRoute>
               } />
               <Route path="/seller/after-sales" element={
                 <AdminRoute>
                   <AfterSalesManagement />
                 </AdminRoute>
               } />

           <Route path="*" element={
             <Layout>
               <div className="text-center py-16">
                 <i className="fa-solid fa-exclamation-triangle text-5xl text-yellow-500 mb-4"></i>
                 <h2 className="text-2xl font-bold text-gray-800 mb-2">页面未找到</h2>
                 <p className="text-gray-600 mb-6">抱歉，您访问的页面不存在</p>
                 <a 
                   href="/" 
                   className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition-colors"
                 >
                   返回首页
                 </a>
               </div>
             </Layout>
           } />
         </Routes>
          </CartProvider>
          </BannerProvider>
          </SettingsProvider>
       </ProductProvider>
       </LanguageProvider>
     </AuthProvider>
  );
}