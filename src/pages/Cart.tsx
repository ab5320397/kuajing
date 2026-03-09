import React from 'react';
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '@/contexts/CartContext';
import { AuthContext } from '@/contexts/authContext.tsx';
import Layout from '@/components/Layout';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Cart() {
   const { cartItems, removeFromCart, updateQuantity, clearCart, totalPrice } = useContext(CartContext);
   const navigate = useNavigate();
  const { t, formatPrice, language, exchangeRateText } = useLanguage();
  const { isAuthenticated } = useContext(AuthContext);
   
  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <i className="fa-solid fa-shopping-cart text-5xl text-gray-300 mb-4"></i>
           <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('cart.empty')}</h2>
           <p className="text-gray-600 mb-6">{t('cart.emptySubtitle')}</p>
           <Link 
            to="/" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition-colors"
               >
                 {t('cart.continueShopping')}
               </Link>
        </div>
      </Layout>
    );
  }
  
  const handleCheckout = () => {
    navigate('/checkout');
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{language === 'zh' ? '我的购物车' : 'My Cart'}</h1>
            <div className="text-sm text-green-600 mb-6">
              <i className="fa-solid fa-info-circle mr-1"></i>
              当前汇率: {exchangeRateText} | 价格已根据最新汇率自动换算
            </div>
         
         <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                       {language === 'zh' ? '商品' : 'Product'}
                     </th>
                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                       {language === 'zh' ? '价格' : 'Price'}
                     </th>
                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                       {language === 'zh' ? '数量' : 'Quantity'}
                     </th>
                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                       {language === 'zh' ? '小计' : 'Subtotal'}
                     </th>
                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                       {language === 'zh' ? '操作' : 'Action'}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-16 w-16 flex-shrink-0">
                            <img 
                              className="h-16 w-16 object-cover" 
                              src={item.image} 
                              alt={item.name}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              <Link to={`/product/${item.id}`} className="hover:text-blue-600">
                                {item.name}
                              </Link>
                            </div>
                             <div className="text-sm text-gray-500">{language === 'zh' ? item.category : item.englishCategory}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                         {formatPrice(item.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-3 rounded-l-md"
                            disabled={item.quantity <= 1}
                          >
                            <i className="fa-solid fa-minus text-xs"></i>
                          </button>
                          <input 
                            type="number" 
                            min="1" 
                            max={item.stock}
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                            className="w-12 text-center border-t border-b border-gray-300 py-1 text-sm focus:outline-none"
                          />
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-3 rounded-r-md"
                            disabled={item.quantity >= item.stock}
                          >
                            <i className="fa-solid fa-plus text-xs"></i>
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                         {formatPrice(item.price * item.quantity)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button 
                          onClick={() => {
                            removeFromCart(item.id);
                            toast.success(`${item.name} 已从购物车中移除`);
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          <i className="fa-solid fa-trash-alt"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div className="px-6 py-4 bg-gray-50 flex justify-between">
                <Link 
                  to="/" 
                  className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                >
                   <i className="fa-solid fa-arrow-left mr-1"></i> {t('cart.continueShopping')}
                </Link>
                <button 
                  onClick={() => {
                    clearCart();
                    toast.success("购物车已清空");
                  }}
                  className="text-red-600 hover:text-red-900 text-sm font-medium"
                >
                   <i className="fa-solid fa-trash-alt mr-1"></i> {t('cart.clear')}
                </button>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6">
               <h2 className="text-lg font-semibold text-gray-800 mb-4">{t('cart.orderSummary')}</h2>
              
               <div className="space-y-3 mb-6">
                 <div className="flex justify-between text-sm">
                   <span className="text-gray-600">{t('cart.subtotal')}</span>
                   <span>{formatPrice(totalPrice)}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                   <span className="text-gray-600">{t('cart.shipping')}</span>
                   <span>{language === 'zh' ? '免费' : 'Free'}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                   <span className="text-gray-600">{t('cart.tax')}</span>
                   <span>{formatPrice(0)}</span>
                 </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between font-semibold text-lg">
                   <span>{t('cart.total')}</span>
                   <span>{formatPrice(totalPrice)}</span>
                </div>
              </div>
              
                <button 
                  onClick={() => {
                    if (!isAuthenticated) {
                      toast.info('请先登录后再结账');
                      navigate('/user-login');
                    } else {
                      handleCheckout();
                    }
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition-colors"
                >
                  {t('cart.checkout')} 
                </button>
               
               {/* 支付方式图标 */}
               <div className="mt-4 pt-4 border-t border-gray-200">
                 <p className="text-sm text-gray-500 mb-2">支持的支付方式:</p>
                 <div className="flex space-x-4 text-2xl">
                   <i className="fa-brands fa-cc-visa text-gray-600" title="Visa"></i>
                   <i className="fa-brands fa-cc-mastercard text-gray-600" title="Mastercard"></i>
                   <i className="fa-brands fa-paypal text-gray-600" title="PayPal"></i>
                 </div>
               </div>
               
               <div className="mt-4 text-center text-sm text-gray-500">
                 <i className="fa-solid fa-lock mr-1"></i> 安全支付，购物无忧
               </div>
             </div>
           </div>
         </div>
      </div>
    </Layout>
  );
}