import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useTheme } from '@/hooks/useTheme';
import { mockOrders, Order, LogisticsInfo, LogisticsStatus } from '@/lib/mockOrders';
import { toast } from 'sonner';

// 物流商名称映射
const logisticsProviderNames = {
  'yanwen': '燕文物流',
  '4px': '递四方',
  'dhl': 'DHL',
  'other': '其他物流'
};

// 订单状态样式映射
const orderStatusStyles = {
  'pending': 'bg-yellow-100 text-yellow-800',
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
  'pending': '待付款',
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

export default function OrderManagement() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
  const { isDark } = useTheme();
  const [logisticsInfo, setLogisticsInfo] = useState<Partial<LogisticsInfo>>({
    provider: 'yanwen',
    trackingNumber: ''
  });
  const [trackingDetailsOpen, setTrackingDetailsOpen] = useState<Record<string, boolean>>({});

  // 打开发货模态框
  const handleShipOrder = (order: Order) => {
    setSelectedOrder(order);
    setLogisticsInfo({
      provider: 'yanwen',
      trackingNumber: ''
    });
    setIsShippingModalOpen(true);
  };

  // 提交物流信息
  const handleSubmitLogistics = () => {
    if (!selectedOrder || !logisticsInfo.provider || !logisticsInfo.trackingNumber) {
      toast.error('请填写完整的物流信息');
      return;
    }

    // 创建新的物流信息
    const newLogisticsInfo: LogisticsInfo = {
      id: `logi${Date.now()}`,
      provider: logisticsInfo.provider as any,
      providerName: logisticsProviderNames[logisticsInfo.provider as keyof typeof logisticsProviderNames],
      trackingNumber: logisticsInfo.trackingNumber,
      status: 'transit',
      trackingEvents: [
        {
          timestamp: new Date().toISOString(),
          location: '未知',
          description: '包裹已揽收'
        }
      ],
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    // 更新订单状态和物流信息
    const updatedOrders = orders.map(order => {
      if (order.id === selectedOrder.id) {
        return {
          ...order,
          status: 'shipped',
          updatedAt: new Date().toISOString(),
          logisticsInfo: newLogisticsInfo
        };
      }
      return order;
    });

    setOrders(updatedOrders);
    setIsShippingModalOpen(false);
    toast.success('订单已标记为发货');
  };

  // 切换物流详情展开状态
  const toggleTrackingDetails = (orderId: string) => {
    setTrackingDetailsOpen(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
           <div className="max-w-6xl mx-auto">
   {/* 数据同步说明卡片 */}
   <div className={`mb-6 p-4 rounded-lg ${isDark ? 'bg-gray-800 text-gray-200 border border-gray-700' : 'bg-blue-50 text-blue-800 border border-blue-200'}`}>
     <div className="flex items-start">
       <i className="fa-solid fa-info-circle mt-1 mr-3 text-lg"></i>
       <div>
         <h3 className="font-medium mb-1">数据同步说明</h3>
         <p className="text-sm">订单数据会自动保存在浏览器本地存储中。如需同步到GitHub并部署，请手动执行以下步骤：</p>
         <ul className="text-sm list-disc list-inside mt-2 space-y-1">
           <li>1. 提交更改到本地仓库: <code className="bg-white px-1 py-0.5 rounded text-xs">git add . && git commit -m "描述您的更改"</code></li>
           <li>2. 推送到GitHub: <code className="bg-white px-1 py-0.5 rounded text-xs">git push origin main</code></li>
           <li>3. 推送后Vercel会自动部署更新（如已配置Vercel集成）</li>
         </ul>
         <p className="text-sm mt-2">详细部署指南请查看项目根目录下的 <code className="bg-white px-1 py-0.5 rounded text-xs">DEPLOYMENT.md</code> 文件。</p>
       </div>
     </div>
   </div>
  
  <div className="flex justify-between items-center mb-6">
    <h1 className="text-2xl font-bold text-gray-800">订单管理</h1>
            <button
              onClick={() => navigate('/seller/products')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <i className="fa-solid fa-arrow-left mr-2"></i>
              返回商品管理
            </button>
          </div>
          
          {/* 订单列表 */}
           <div className="bg-white shadow overflow-hidden rounded-lg">
             <div className="p-4 border-b border-gray-200 flex justify-between items-center">
               <h3 className="font-medium">订单管理</h3>
               <div className="flex space-x-2">
                 <select className="border border-gray-300 rounded px-3 py-1 text-sm">
                   <option>所有状态</option>
                   <option>待付款</option>
                   <option>已付款</option>
                   <option>已发货</option>
                   <option>已送达</option>
                   <option>已取消</option>
                 </select>
                 <div className="relative">
                   <input type="text" placeholder="搜索订单号" className="border border-gray-300 rounded px-3 py-1 text-sm pl-8" />
                   <i className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
                 </div>
               </div>
             </div>
             <table className="min-w-full divide-y divide-gray-200">
               <thead className="bg-gray-50">
                 <tr>
                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     订单编号
                   </th>
                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     客户信息
                   </th>
                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     订单金额
                   </th>
                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     订单状态
                   </th>
                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     物流信息
                   </th>
                   <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                     操作
                   </th>
                 </tr>
               </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                        <div className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{order.buyerName}</div>
                        <div className="text-sm text-gray-500">{order.buyerEmail}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">¥{order.totalAmount.toFixed(2)}</div>
                        <div className="text-sm text-gray-500">{order.items.reduce((total, item) => total + item.quantity, 0)}件商品</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${orderStatusStyles[order.status]}`}>
                          {orderStatusNames[order.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {order.logisticsInfo ? (
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">{order.logisticsInfo.providerName}</div>
                            <div className="text-gray-500">{order.logisticsInfo.trackingNumber}</div>
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${logisticsStatusStyles[order.logisticsInfo.status]}`}>
                              {logisticsStatusNames[order.logisticsInfo.status]}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">暂无物流信息</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {order.status === 'paid' && (
                          <button
                            onClick={() => handleShipOrder(order)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            发货
                          </button>
                        )}
                        <button
                          onClick={() => toggleTrackingDetails(order.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          {trackingDetailsOpen[order.id] ? '收起详情' : '查看详情'}
                        </button>
                      </td>
                    </tr>
                    
                    {/* 订单详情展开行 */}
                    {trackingDetailsOpen[order.id] && (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* 商品信息 */}
                            <div>
                              <h3 className="text-sm font-semibold text-gray-900 mb-3">商品信息</h3>
                              <div className="space-y-3">
                                {order.items.map(item => (
                                  <div key={item.id} className="flex">
                                    <div className="h-12 w-12 flex-shrink-0">
                                      <img className="h-12 w-12 object-cover" src={item.image} alt={item.name} />
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                      <div className="text-sm text-gray-500">
                                        ¥{item.price.toFixed(2)} x {item.quantity}
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
                                <p>
                                  <span className="font-medium">订单状态：</span>
                                  {orderStatusNames[order.status]}
                                  <span className="text-gray-500 ml-2">
                                    ({new Date(order.updatedAt).toLocaleString()})
                                  </span>
                                </p>
                              </div>
                            </div>
                            
                            {/* 物流信息 */}
                            <div>
                              <h3 className="text-sm font-semibold text-gray-900 mb-3">物流信息</h3>
                              {order.logisticsInfo ? (
                                <div className="space-y-3">
                                  <div className="text-sm">
                                    <p><span className="font-medium">物流公司：</span>{order.logisticsInfo.providerName}</p>
                                    <p><span className="font-medium">运单编号：</span>{order.logisticsInfo.trackingNumber}</p>
                                    <p>
                                      <span className="font-medium">物流状态：</span>
                                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${logisticsStatusStyles[order.logisticsInfo.status]}`}>
                                        {logisticsStatusNames[order.logisticsInfo.status]}
                                      </span>
                                    </p>
                                    {order.logisticsInfo.estimatedDelivery && (
                                      <p><span className="font-medium">预计送达：</span>{order.logisticsInfo.estimatedDelivery}</p>
                                    )}
                                  </div>
                                  
                                  {/* 物流跟踪 */}
                                  {order.logisticsInfo.trackingEvents && (
                                    <div className="mt-4">
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
                              ) : (
                                <div className="text-sm text-gray-500">
                                  订单尚未发货，暂无物流信息
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* 发货模态框 */}
      {isShippingModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">订单发货</h2>
                <button
                  onClick={() => setIsShippingModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <i className="fa-solid fa-times text-xl"></i>
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-700 mb-2">订单编号: {selectedOrder.orderNumber}</p>
                <p className="text-sm text-gray-700">客户: {selectedOrder.buyerName}</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    选择物流公司
                  </label>
                  <select
                    value={logisticsInfo.provider}
                    onChange={(e) => setLogisticsInfo({...logisticsInfo, provider: e.target.value as any})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="yanwen">燕文物流</option>
                    <option value="4px">递四方</option>
                    <option value="dhl">DHL</option>
                    <option value="other">其他物流</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    物流跟踪号
                  </label>
                  <input
                    type="text"
                    value={logisticsInfo.trackingNumber}
                    onChange={(e) => setLogisticsInfo({...logisticsInfo, trackingNumber: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="输入物流跟踪号"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex space-x-4">
                <button
                  onClick={() => setIsShippingModalOpen(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md transition-colors"
                >
                  取消
                </button>
                
                <button
                  onClick={handleSubmitLogistics}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
                >
                  确认发货
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}