import React from 'react';
import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '@/contexts/CartContext';
import { AuthContext } from '@/contexts/authContext.tsx';
import Layout from '@/components/Layout';
import { toast } from 'sonner';
   import { useLanguage } from '@/contexts/LanguageContext';
 
 

// 地址类型定义
interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  isDefault: boolean;
}

export default function Checkout() {
  const { cartItems, clearCart, totalPrice } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
   const { t, formatPrice, exchangeRateText } = useLanguage();
   const [paymentMethod, setPaymentMethod] = useState<string>('credit_card');
   
  // 检查用户是否已登录，如果未登录则重定向到登录页面
  useEffect(() => {
    if (!isAuthenticated) {
      toast.info('请先登录再结账');
      navigate('/user-login', { state: { from: '/checkout' } });
    }
  }, [isAuthenticated, navigate]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  // 地址管理状态
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [currentAddressId, setCurrentAddressId] = useState<string>('');
  const [isAddingAddress, setIsAddingAddress] = useState<boolean>(false);
  const [isEditingAddress, setIsEditingAddress] = useState<boolean>(false);
  const [editAddressId, setEditAddressId] = useState<string>('');
  const currentAddress = addresses.find(addr => addr.id === currentAddressId);
  
  // 地址表单状态
  const [addressForm, setAddressForm] = useState({
    name: '',
    phone: '',
    address: '',
    isDefault: false
  });

  // 从localStorage加载地址
  useEffect(() => {
    try {
      const savedAddresses = localStorage.getItem('guestAddresses');
      if (savedAddresses) {
        const parsedAddresses: Address[] = JSON.parse(savedAddresses);
        setAddresses(parsedAddresses);
        
        // 设置默认地址
        const defaultAddress = parsedAddresses.find(addr => addr.isDefault) || parsedAddresses[0];
        if (defaultAddress) {
          setCurrentAddressId(defaultAddress.id);
        }
      } else {
        // 如果没有保存的地址，初始化一个默认地址
        const defaultAddress: Address = {
          id: 'default',
          name: '张三',
          phone: '13800138000',
          address: '北京市朝阳区建国路88号',
          isDefault: true
        };
        setAddresses([defaultAddress]);
        setCurrentAddressId(defaultAddress.id);
        localStorage.setItem('guestAddresses', JSON.stringify([defaultAddress]));
      }
    } catch (error) {
      console.error('Failed to load addresses from localStorage:', error);
      toast.error('加载地址失败，请刷新页面重试');
    }
  }, []);

  // 保存地址到localStorage
  useEffect(() => {
    try {
      localStorage.setItem('guestAddresses', JSON.stringify(addresses));
    } catch (error) {
      console.error('Failed to save addresses to localStorage:', error);
    }
  }, [addresses]);

  // 处理地址表单变更
  const handleAddressFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setAddressForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // 处理添加新地址
  const handleAddAddress = () => {
    if (!addressForm.name || !addressForm.phone || !addressForm.address) {
      toast.error('请填写完整的地址信息');
      return;
    }

    const newAddress: Address = {
      id: Date.now().toString(),
      ...addressForm
    };

    // 如果设为默认地址，更新其他地址
    let updatedAddresses = [...addresses, newAddress];
    if (newAddress.isDefault) {
      updatedAddresses = updatedAddresses.map(addr => ({
        ...addr,
        isDefault: addr.id === newAddress.id
      }));
    }

    setAddresses(updatedAddresses);
    setCurrentAddressId(newAddress.id);
    setIsAddingAddress(false);
    resetAddressForm();
    toast.success('地址添加成功');
  };

  // 处理编辑地址
  const handleEditAddress = () => {
    if (!addressForm.name || !addressForm.phone || !addressForm.address) {
      toast.error('请填写完整的地址信息');
      return;
    }

    // 更新地址
    let updatedAddresses = addresses.map(addr => 
      addr.id === editAddressId ? { ...addr, ...addressForm } : addr
    );

    // 如果设为默认地址，更新其他地址
    if (addressForm.isDefault) {
      updatedAddresses = updatedAddresses.map(addr => ({
        ...addr,
        isDefault: addr.id === editAddressId
      }));
    }

    setAddresses(updatedAddresses);
    setCurrentAddressId(editAddressId);
    setIsEditingAddress(false);
    resetAddressForm();
    toast.success('地址更新成功');
  };

  // 处理删除地址
  const handleDeleteAddress = (id: string) => {
    if (addresses.length <= 1) {
      toast.error('至少需要保留一个地址');
      return;
    }

    const updatedAddresses = addresses.filter(addr => addr.id !== id);
    setAddresses(updatedAddresses);
    
    // 如果删除的是当前选中的地址，选择第一个地址作为当前地址
    if (id === currentAddressId) {
      setCurrentAddressId(updatedAddresses[0].id);
    }
    
    toast.success('地址已删除');
  };

  // 打开添加地址模态框
  const openAddAddressModal = () => {
    resetAddressForm();
    setIsAddingAddress(true);
  };

  // 打开编辑地址模态框
  const openEditAddressModal = (id: string) => {
    const addressToEdit = addresses.find(addr => addr.id === id);
    if (addressToEdit) {
      setAddressForm({
        name: addressToEdit.name,
        phone: addressToEdit.phone,
        address: addressToEdit.address,
        isDefault: addressToEdit.isDefault
      });
      setEditAddressId(id);
      setIsEditingAddress(true);
    }
  };

  // 重置地址表单
  const resetAddressForm = () => {
    setAddressForm({
      name: '',
      phone: '',
      address: '',
      isDefault: false
    });
  };

  const handlePayment = () => {
    setIsProcessing(true);
    
    // 模拟支付处理延迟
    setTimeout(() => {
      setIsProcessing(false);
      
      // 模拟支付成功
       // 创建待付款订单
       toast.success('订单已创建，请完成支付');
       
           // 保存到本地存储
           const existingOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
           const newOrder = {
             id: Date.now().toString(),
             orderNumber: `ORD${Date.now()}`,
             items: cartItems,
             totalAmount: totalPrice,
             status: 'pending_payment',
             createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              buyerName: currentAddress?.name || '',
              buyerEmail: currentAddress?.name?.includes('@') ? currentAddress.name : `${currentAddress?.name || ''}@example.com`,
              shippingAddress: currentAddress?.address || ''
            };
           
            existingOrders.push(newOrder);
            localStorage.setItem('userOrders', JSON.stringify(existingOrders));
            
            // 跳转到支付页面
            navigate(`/payment/${newOrder.id}`);
    }, 2000);
  };

  return (
    <Layout>
       <div className="container mx-auto px-4 py-8">
         <h1 className="text-2xl font-bold text-gray-800 mb-2">结账</h1>
         <div className="text-sm text-green-600 mb-6">
           <i className="fa-solid fa-info-circle mr-1"></i>
           当前汇率: {exchangeRateText} | 价格已根据最新汇率自动换算
         </div>
         
        <div className="grid md:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="md:col-span-1">
             <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
               {!isAuthenticated && (
                 <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                   <div className="flex">
                     <div className="flex-shrink-0">
                       <i className="fa-solid fa-info-circle text-yellow-500"></i>
                     </div>
                     <div className="ml-3">
                       <p className="text-sm text-yellow-700">
                         您可以继续以游客身份结账，或 
                         <a href="/user-login" className="text-blue-600 hover:text-blue-800 font-medium ml-1">登录</a>
                         以享受更多优惠
                       </p>
                     </div>
                   </div>
                 </div>
               )}
               <h2 className="text-lg font-semibold text-gray-800 mb-4">订单摘要</h2>
              
              <div className="space-y-3 mb-6">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.name} x {item.quantity}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between font-semibold text-lg">
                  <span>总计</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
              </div>
              
              <button 
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition-colors disabled:opacity-70"
              >
                {isProcessing ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin mr-2"></i> 处理中...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-lock mr-2"></i> 提交订单
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Shipping Address & Payment Form */}
          <div className="md:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">收货地址</h2>
                <button 
                  onClick={openAddAddressModal}
                  className="text-blue-600 text-sm hover:text-blue-800 flex items-center"
                >
                  <i className="fa-solid fa-plus mr-1"></i> 添加新地址
                </button>
              </div>
              
              {addresses.map(address => (
                <div 
                  key={address.id} 
                  className={`border rounded-lg p-4 mb-4 ${currentAddressId === address.id ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'}`}
                >
                  <div className="flex items-start">
                    <input 
                      type="radio" 
                      name="address" 
                      checked={currentAddressId === address.id}
                      onChange={() => setCurrentAddressId(address.id)}
                      className="mt-1 mr-3" 
                    />
                    <div className="flex-1">
                      <div className="font-medium">{address.name}</div>
                      <div className="text-gray-600">{address.phone}</div>
                      <div className="text-gray-600">{address.address}</div>
                      {address.isDefault && (
                        <div className="inline-block mt-1 ml-0 bg-gray-200 text-gray-800 text-xs px-2 py-0.5 rounded">
                          默认地址
                        </div>
                      )}
                      <div className="flex mt-2 space-x-2">
                        <button 
                          onClick={() => openEditAddressModal(address.id)}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          编辑
                        </button>
                        <button 
                          onClick={() => handleDeleteAddress(address.id)}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">支付方式</h2>
              
              <div className="space-y-4">
                {/* Credit Card Option */}
                <div className="border rounded-lg p-4 cursor-pointer transition-colors hover:bg-gray-50"
                  onClick={() => setPaymentMethod('credit_card')}>
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${
                      paymentMethod === 'credit_card' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                    }`}>
                      <i className="fa-solid fa-check text-white text-xs"></i>
                    </div>
                    <div className="flex items-center">
                      <i className="fa-brands fa-cc-visa text-xl mr-2"></i>
                      <i className="fa-brands fa-cc-mastercard text-xl mr-2"></i>
                      <span className="ml-2">银行卡支付</span>
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
                            placeholder="123" 
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">持卡人姓名</label>
                        <input 
                          type="text" 
                          placeholder="张三" 
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                {/* WeChat Pay Option */}
                <div className="border rounded-lg p-4 cursor-pointer transition-colors hover:bg-gray-50"
                  onClick={() => setPaymentMethod('wechat')}>
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${
                      paymentMethod === 'wechat' 
                        ? 'border-green-600 bg-green-600' 
                        : 'border-gray-300'
                    }`}>
                      <i className="fa-solid fa-check text-white text-xs"></i>
                    </div>
                    <div className="flex items-center">
                      <i className="fa-brands fa-weixin text-xl mr-2 text-green-600"></i>
                      <span className="ml-2">微信支付</span>
                    </div>
                  </div>
                  
                  {paymentMethod === 'wechat' && (
                    <div className="mt-4 p-4 bg-green-50 rounded-md text-center">
                      <div className="bg-white p-4 inline-block rounded-md mb-3">
                        <i className="fa-qrcode text-5xl text-gray-400"></i>
                      </div>
                      <p className="text-sm text-gray-700">
                        <i className="fa-info-circle text-green-600 mr-2"></i>
                        请使用微信扫描二维码支付
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Alipay Option */}
                <div className="border rounded-lg p-4 cursor-pointer transition-colors hover:bg-gray-50"
                  onClick={() => setPaymentMethod('alipay')}>
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${
                      paymentMethod === 'alipay' 
                        ? 'border-blue-600 bg-blue-600' 
                        : 'border-gray-300'
                    }`}>
                      <i className="fa-solid fa-check text-white text-xs"></i>
                    </div>
                    <div className="flex items-center">
                      <i className="fa-brands fa-alipay text-xl mr-2 text-blue-500"></i>
                      <span className="ml-2">支付宝</span>
                    </div>
                  </div>
                  
                  {paymentMethod === 'alipay' && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-md text-center">
                      <div className="bg-white p-4 inline-block rounded-md mb-3">
                        <i className="fa-qrcode text-5xl text-gray-400"></i>
                      </div>
                      <p className="text-sm text-gray-700">
                        <i className="fa-info-circle text-blue-600 mr-2"></i>
                        请使用支付宝扫描二维码支付
                      </p>
                    </div>
                  )}
                </div>
                
                {/* PayPal Option */}
                <div className="border rounded-lg p-4 cursor-pointer transition-colors hover:bg-gray-50"
                  onClick={() => setPaymentMethod('paypal')}>
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${
                      paymentMethod === 'paypal' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                    }`}>
                      <i className="fa-solid fa-check text-white text-xs"></i>
                    </div>
                    <div className="flex items-center">
                      <i className="fa-brands fa-paypal text-xl mr-2"></i>
                      <span className="ml-2">PayPal</span>
                    </div>
                  </div>
                  
                  {paymentMethod === 'paypal' && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-md text-sm text-gray-700">
                      <i className="fa-info-circle text-blue-600 mr-2"></i>
                      将跳转至PayPal网站完成支付
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Order Notes */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">订单备注</h2>
              <textarea 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="请输入订单备注信息"
              ></textarea>
            </div>
          </div>
        </div>
      </div>
      
      {/* 添加地址模态框 */}
      {(isAddingAddress || isEditingAddress) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {isAddingAddress ? '添加新地址' : '编辑地址'}
                </h2>
                <button
                  onClick={() => {
                    setIsAddingAddress(false);
                    setIsEditingAddress(false);
                    resetAddressForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <i className="fa-solid fa-times text-xl"></i>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    收件人姓名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={addressForm.name}
                    onChange={handleAddressFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="请输入收件人姓名"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    联系电话 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={addressForm.phone}
                    onChange={handleAddressFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="请输入联系电话"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    详细地址 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="address"
                    value={addressForm.address}
                    onChange={handleAddressFormChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="请输入详细地址"
                    required
                  ></textarea>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={addressForm.isDefault}
                    onChange={handleAddressFormChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">
                    设置为默认地址
                  </label>
                </div>
              </div>
              
              <div className="mt-6 flex space-x-4">
                <button
                  onClick={() => {
                    setIsAddingAddress(false);
                    setIsEditingAddress(false);
                    resetAddressForm();
                  }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md transition-colors"
                >
                  取消
                </button>
                
                <button
                  onClick={isAddingAddress ? handleAddAddress : handleEditAddress}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
                >
                  {isAddingAddress ? '保存地址' : '更新地址'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}