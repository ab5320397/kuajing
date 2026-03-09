import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import { mockOrders, Order } from '@/lib/mockOrders';
import { useLanguage } from '@/contexts/LanguageContext';

// 订单状态样式映射
const orderStatusStyles = {
  'pending_payment': 'bg-yellow-100 text-yellow-800',
  'paid': 'bg-blue-100 text-blue-800',
  'shipped': 'bg-purple-100 text-purple-800',
  'delivered': 'bg-green-100 text-green-800',
  'cancelled': 'bg-red-100 text-red-800'
};

// 物流状态样式映射
const logisticsStatusStyles = {
  'pending': 'bg-yellow-100 text-yellow-800',
  'transit': 'bg-blue-100 text-blue-800',
  'delivered': 'bg-green-100 text-green-800',
  'failed': 'bg-red-100 text-red-800'
};

// 订单状态中文映射
const orderStatusNames = {
  'pending_payment': '待付款',
  'paid': '已付款',
  'shipped': '已发货',
  'delivered': '已送达',
  'cancelled': '已取消'
};

// 物流状态中文映射
const logisticsStatusNames = {
  'pending': '待处理',
  'transit': '运输中',
  'delivered': '已送达',
  'failed': '配送失败'
};

export default function Orders() {
  const navigate = useNavigate();
  const { t, formatPrice } = useLanguage();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  
  // 处理支付按钮点击
  const handlePayNow = (orderId: string) => {
    // 模拟支付处理
    const updatedOrders = userOrders.map(order => 
      order.id === orderId ? { ...order, status: 'paid', updatedAt: new Date().toISOString() } : order
    );
    
    // 更新本地存储
    localStorage.setItem('userOrders', JSON.stringify(updatedOrders));
    setUserOrders(updatedOrders);
    
    // 显示成功消息
    toast.success('支付成功！订单已更新');
  };
  
  // 在实际应用中，这里应该根据当前登录用户ID筛选订单
  // 这里暂时使用所有mock订单数据
  // 从本地存储获取用户订单
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState('pending_shipment');
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  
  useEffect(() => {
    try {
      const savedOrders = localStorage.getItem('userOrders');
      if (savedOrders) {
        setUserOrders(JSON.parse(savedOrders));
      } else {
        setUserOrders(mockOrders);
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
      setUserOrders(mockOrders);
    }
  }, []);
  
  // 根据标签筛选订单
  useEffect(() => {
    switch (activeTab) {
      case 'pending_shipment':
        setFilteredOrders(userOrders.filter(order => order.status === 'paid'));
        break;
      case 'shipped':
        setFilteredOrders(userOrders.filter(order => order.status === 'shipped'));
        break;
      case 'delivered':
        setFilteredOrders(userOrders.filter(order => order.status === 'delivered'));
        break;
      case 'all':
        setFilteredOrders(userOrders);
        break;
      default:
        setFilteredOrders(userOrders);
    }
  }, [activeTab, userOrders]);
  
  // 切换订单详情展开/收起状态
  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">我的订单</h1>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <i className="fa-solid fa-arrow-left mr-2"></i>
              返回首页
            </button>
          </div>
          
          {/* 订单分类标签 */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('all')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'all' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                全部订单
              </button>
              <button
                onClick={() => setActiveTab('pending_shipment')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'pending_shipment' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                待发货
              </button>
              <button
                onClick={() => setActiveTab('shipped')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'shipped' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                已发货
              </button>
              <button
                onClick={() => setActiveTab('delivered')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'delivered' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                已送达
              </button>
            </nav>
          </div>
          
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <i className="fa-solid fa-box-open text-gray-300 text-5xl mb-4"></i>
              <h3 className="text-lg font-medium text-gray-900 mb-1">您暂无订单记录</h3>
              <p className="text-gray-500 mb-6">快去选购心仪的商品吧！</p>
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <i className="fa-solid fa-shopping-bag mr-2"></i>
                去购物
              </button>
            </div>
            ) : (
              <div className="space-y-6">
                {filteredOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  {/* 订单头部 */}
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                      <div>
                        <div className="flex items-center">
                          <h2 className="text-lg font-semibold text-gray-900 mr-3">{order.orderNumber}</h2>
                       <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${orderStatusStyles[order.status]}`}>
                         {orderStatusNames[order.status]}
                         {order.status === 'pending_payment' && (
                           <button 
                             onClick={() => handlePayNow(order.id)}
                             className="ml-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded hover:bg-blue-700"
                           >
                             立即支付
                           </button>
                         )}
                            {orderStatusNames[order.status]}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          下单时间: {new Date(order.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="mt-3 md:mt-0">
                        <div className="text-lg font-semibold text-gray-900">
                          {formatPrice(order.totalAmount)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.items.reduce((total, item) => total + item.quantity, 0)}件商品
                        </div>
                      </div>
                    </div>
                    
                    {/* 展开/收起按钮 */}
                    <button
                      onClick={() => toggleOrderDetails(order.id)}
                      className="mt-4 text-sm text-blue-600 hover:text-blue-900"
                    >
                      {expandedOrderId === order.id ? (
                        <><i className="fa-solid fa-chevron-up mr-1"></i>收起详情</>
                      ) : (
                        <><i className="fa-solid fa-chevron-down mr-1"></i>查看详情</>
                      )}
                    </button>
                  </div>
                  
                  {/* 订单详情 */}
                  {expandedOrderId === order.id && (
                    <div className="px-6 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        {/* 商品信息 */}
                        <div className="md:col-span-2">
                          <h3 className="text-sm font-semibold text-gray-900 mb-3">商品信息</h3>
                          <div className="space-y-4">
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
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* 收货信息 */}
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900 mb-3">收货信息</h3>
                          <div className="text-sm text-gray-700 space-y-1">
                            <p><span className="font-medium">收货人：</span>{order.buyerName}</p>
                            <p><span className="font-medium">邮箱：</span>{order.buyerEmail}</p>
                            <p><span className="font-medium">地址：</span>{order.shippingAddress}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* 物流信息 */}
                      {order.logisticsInfo && (
                        <div className="border-t border-gray-200 pt-4">
                          <h3 className="text-sm font-semibold text-gray-900 mb-3">物流信息</h3>
                          <div className="mb-4">
                            <div className="flex flex-wrap items-center gap-4 mb-4">
                              <div>
                                <span className="text-sm text-gray-500">物流公司：</span>
                                <span className="text-sm font-medium text-gray-900">{order.logisticsInfo.providerName}</span>
                              </div>
                              <div>
                                <span className="text-sm text-gray-500">运单编号：</span>
                                <span className="text-sm font-medium text-gray-900">{order.logisticsInfo.trackingNumber}</span>
                              </div>
                              <div>
                                <span className="text-sm text-gray-500">物流状态：</span>
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${logisticsStatusStyles[order.logisticsInfo.status]}`}>
                                  {logisticsStatusNames[order.logisticsInfo.status]}
                                </span>
                              </div>
                              {order.logisticsInfo.estimatedDelivery && (
                                <div>
                                  <span className="text-sm text-gray-500">预计送达：</span>
                                  <span className="text-sm font-medium text-gray-900">{order.logisticsInfo.estimatedDelivery}</span>
                                </div>
                              )}
                            </div>
                            
                            {/* 物流跟踪记录 */}
                            {order.logisticsInfo.trackingEvents && order.logisticsInfo.trackingEvents.length > 0 && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-2">物流跟踪</h4>
                                <div className="relative pl-5 border-l border-gray-200 space-y-4">
                                  {order.logisticsInfo.trackingEvents.map((event, index) => (
                                    <div key={index} className="relative">
                                      <div className="absolute -left-5 w-3 h-3 rounded-full bg-blue-500"></div>
                                      <div className="text-sm">
                                        <p className="font-medium text-gray-900">{event.description}</p>
                                        <p className="text-gray-500">
                                          {event.location} · {new Date(event.timestamp).toLocaleString()}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}