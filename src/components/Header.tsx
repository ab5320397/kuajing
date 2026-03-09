import React from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '@/contexts/authContext.tsx';
import { CartContext } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
  
 export default function Header() {
   const { user, isAuthenticated, logout } = useContext(AuthContext);
   const { cartItems } = useContext(CartContext);
   const { t, language, setLanguage, currency, setCurrency, isChinaIP } = useLanguage();
   
   // Calculate total items in cart
   const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
   
   return (
     <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
       <div className="container mx-auto px-4 md:px-8 lg:px-16">
         <div className="flex items-center justify-between h-20">
           {/* Logo */}
           <Link to="/" className="text-2xl font-light tracking-wider text-[var(--color-primary)]">
             LUXMODE
           </Link>
           
           {/* Desktop Navigation */}
           <nav className="hidden md:flex space-x-10">
             <Link to="/" className="text-sm uppercase tracking-wide hover:text-[var(--color-accent)] transition-colors">Collections</Link>
             <Link to="/products" className="text-sm uppercase tracking-wide hover:text-[var(--color-accent)] transition-colors">Men</Link>
             <Link to="/products" className="text-sm uppercase tracking-wide hover:text-[var(--color-accent)] transition-colors">Women</Link>
             <Link to="/custom" className="text-sm uppercase tracking-wide hover:text-[var(--color-accent)] transition-colors">Custom</Link>
             <Link to="/wholesale" className="text-sm uppercase tracking-wide hover:text-[var(--color-accent)] transition-colors">Wholesale</Link>
           </nav>
          
           {/* Right section: Search, Cart, User */}
           <div className="flex items-center space-x-6">
             {/* Search */}
             <button className="text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors">
               <i className="fa-solid fa-search"></i>
             </button>
            
            {/* Cart */}
            <Link to="/cart" className="relative text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors">
              <i className="fa-solid fa-shopping-bag"></i>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[var(--color-accent)] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            
            {/* User account */}
            {!isAuthenticated ? (
              <Link to="/user-login" className="text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors">
                <i className="fa-solid fa-user"></i>
              </Link>
            ) : (
              <div className="relative group">
                <button className="text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors">
                  <i className="fa-solid fa-user"></i>
                </button>
                
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10 hidden group-hover:block border border-gray-100">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Profile</Link>
                  <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Orders</Link>
                  <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Settings</Link>
                  
                  {/* Admin menu */}
                  {user?.isAdmin && (
                    <>
                      <div className="border-t border-gray-100 my-1"></div>
                      <div className="px-4 py-1 text-xs font-semibold text-gray-500">Admin</div>
                      <Link to="/seller/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Dashboard</Link>
                      <Link to="/seller/products" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Products</Link>
                      <Link to="/seller/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Orders</Link>
                    </>
                  )}
                  
                  <div className="border-t border-gray-100 my-1"></div>
                  <button 
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
            
            {/* Language & Currency Selector */}
            <div className="hidden md:flex items-center space-x-4">
              {isChinaIP !== false && (
                <button 
                  onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
                  className="text-sm text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors"
                >
                  {language === 'zh' ? 'EN' : '中文'}
                </button>
              )}
              
              <div className="relative group">
                <button className="text-sm flex items-center text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors">
                  {currency}
                  <i className="fa-solid fa-chevron-down ml-1 text-xs"></i>
                </button>
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block border border-gray-100">
                  <button 
                    onClick={() => setCurrency('USD')}
                    className={`block w-full text-left px-4 py-2 text-sm ${currency === 'USD' ? 'text-[var(--color-accent)]' : 'text-gray-700'}`}
                  >
                    USD
                  </button>
                  <button 
                    onClick={() => setCurrency('EUR')}
                    className={`block w-full text-left px-4 py-2 text-sm ${currency === 'EUR' ? 'text-[var(--color-accent)]' : 'text-gray-700'}`}
                  >
                    EUR
                  </button>
                  {isChinaIP !== false && (
                    <button 
                      onClick={() => setCurrency('CNY')}
                      className={`block w-full text-left px-4 py-2 text-sm ${currency === 'CNY' ? 'text-[var(--color-accent)]' : 'text-gray-700'}`}
                    >
                      CNY
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Mobile menu button */}
            <button className="md:hidden text-[var(--color-primary)]">
              <i className="fa-solid fa-bars text-xl"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}