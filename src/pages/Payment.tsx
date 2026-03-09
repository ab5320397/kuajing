import React from 'react';
import { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { AuthContext } from '@/contexts/authContext.tsx';
import { CartContext } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { mockOrders, Order } from '@/lib/mockOrders';

export default function Payment() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { formatPrice } = useLanguage();
  const { clearCart } = useContext(CartContext);
  const [order, setOrder] = useState<Order | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('wechat');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  // 从localStorage获取订单信息
  useEffect(() => {
    try {
      const savedOrders = localStorage.getItem('userOrders');
      if (savedOrders && id) {
        const orders: Order[] = JSON.parse(savedOrders);
        const foundOrder = orders.find(o => o.id === id);
        if (foundOrder) {
          setOrder(foundOrder);
        } else {
          toast.error('未找到订单信息');
          navigate('/orders');
        }
      } else {
        toast.error('订单不存在');
        navigate('/orders');
      }
    } catch (error) {
      console.error('Failed to load order:', error);
      toast.error('加载订单失败');
      navigate('/orders');
    }
  }, [id, navigate]);
  
  // 处理支付
  const handlePayment = () => {
    if (!order) return;
    
    setIsProcessing(true);
    
    // 模拟支付处理延迟
    setTimeout(() => {
      try {
        // 获取所有订单
        const savedOrders = localStorage.getItem('userOrders');
        if (savedOrders) {
          const orders: Order[] = JSON.parse(savedOrders);
          
          // 更新当前订单状态
          const updatedOrders = orders.map(o => 
            o.id === order.id 
              ? { 
                  ...o, 
                  status: 'paid', 
                  updatedAt: new Date().toISOString() 
                } 
              : o
          );
          
          // 保存更新后的订单
          localStorage.setItem('userOrders', JSON.stringify(updatedOrders));
          
          // 支付成功，清空购物车
          clearCart();
          
          // 显示成功消息
          toast.success('支付成功！您的订单已提交');
          
          // 跳转到订单详情页
          navigate(`/orders`);
        }
      } catch (error) {
        console.error('Payment failed:', error);
        toast.error('支付处理失败，请重试');
      } finally {
        setIsProcessing(false);
      }
    }, 2000);
  };
  
  if (!order) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <i className="fa-solid fa-spinner fa-spin text-5xl text-gray-300 mb-4"></i>
          <p className="text-lg text-gray-500">加载订单信息中...</p>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">订单支付</h1>
            <button
              onClick={() => navigate('/orders')}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              <i className="fa-solid fa-arrow-left mr-1"></i> 返回订单列表
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">订单信息</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-500">订单编号</p>
                  <p className="font-medium">{order.orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">下单时间</p>
                  <p className="font-medium">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">订单状态</p>
                  <p className="font-medium text-yellow-600">待付款</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-4">商品信息</h3>
              <div className="space-y-4 mb-6">
                {order.items.map(item => (
                  <div key={item.id} className="flex">
                    <div className="h-16 w-16 flex-shrink-0">
                      <img className="h-16 w-16 object-cover rounded" src={item.image} alt={item.name} />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-500">
                        {formatPrice(item.price)} x {item.quantity}
                      </div>
                    </div>
                    <div className="ml-auto flex-shrink-0 flex items-center">
                      <p className="text-sm font-medium text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>订单总额</p>
                  <p>{formatPrice(order.totalAmount)}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">选择支付方式</h2>
            
            <div className="space-y-4">
              {/* 微信支付 */}
              <div 
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  paymentMethod === 'wechat' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setPaymentMethod('wechat')}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${
                    paymentMethod === 'wechat' ? 'border-green-500 bg-green-500' : 'border-gray-300'
                  }`}>
                    {paymentMethod === 'wechat' && (
                      <i className="fa-solid fa-check text-white text-xs"></i>
                    )}
                  </div>
                  <div className="flex items-center">
                    <i className="fa-brands fa-weixin text-green-600 text-xl mr-3"></i>
                    <div>
                      <div className="font-medium">微信支付</div>
                      <div className="text-sm text-gray-500">微信扫码支付</div>
                    </div>
                  </div>
                </div>
                
                {paymentMethod === 'wechat' && (
                  <div className="mt-4 p-4 bg-white rounded-md text-center">
                    <div className="bg-gray-100 p-4 inline-block rounded-md mb-3">
                      <i className="fa-qrcode text-5xl text-gray-400"></i>
                    </div>
                    <p className="text-sm text-gray-700">
                      <i className="fa-info-circle text-green-600 mr-2"></i>
                      请使用微信扫描二维码支付
                    </p>
                  </div>
                )}
              </div>
              
              {/* 支付宝 */}
              <div 
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  paymentMethod === 'alipay' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setPaymentMethod('alipay')}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${
                    paymentMethod === 'alipay' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                  }`}>
                    {paymentMethod === 'alipay' && (
                      <i className="fa-solid fa-check text-white text-xs"></i>
                    )}
                  </div>
                  <div className="flex items-center">
                    <i className="fa-brands fa-alipay text-blue-500 text-xl mr-3"></i>
                    <div>
                      <div className="font-medium">支付宝</div>
                      <div className="text-sm text-gray-500">支付宝扫码支付</div>
                    </div>
                  </div>
                </div>
                
                {paymentMethod === 'alipay' && (
                  <div className="mt-4 p-4 bg-white rounded-md text-center">
                    <div className="bg-gray-100 p-4 inline-block rounded-md mb-3">
                      <i className="fa-qrcode text-5xl text-gray-400"></i>
                    </div>
                    <p className="text-sm text-gray-700">
                      <i className="fa-info-circle text-blue-600 mr-2"></i>
                      请使用支付宝扫描二维码支付
                    </p>
                  </div>
                )}
              </div>
              
              {/* 银行卡支付 */}
              <div 
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  paymentMethod === 'credit_card' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setPaymentMethod('credit_card')}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${
                    paymentMethod === 'credit_card' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                  }`}>
                    {paymentMethod === 'credit_card' && (
                      <i className="fa-solid fa-check text-white text-xs"></i>
                    )}
                  </div>
                  <div className="flex items-center">
                    <i className="fa-solid fa-credit-card text-blue-600 text-xl mr-3"></i>
                    <div>
                      <div className="font-medium">银行卡支付</div>
                      <div className="text-sm text-gray-500">支持 Visa, MasterCard, UnionPay</div>
                    </div>
                  </div>
                </div>
                
                {paymentMethod === 'credit_card' && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">卡号</label>
                      <input 
                        type="text" 
                        placeholder="1234 5678 9012 3456" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">有效期</label>
                        <input 
                          type="text" 
                          placeholder="MM/YY" 
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">安全码</label>
                        <input 
                          type="text" 
                          placeholder="CVV" 
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-70"
            >
              {isProcessing ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                  处理中...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-lock mr-2"></i>
                  确认支付 {formatPrice(order.totalAmount)}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}