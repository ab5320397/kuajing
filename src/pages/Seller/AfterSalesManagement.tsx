import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { toast } from 'sonner';
import { useTheme } from '@/hooks/useTheme';
import { mockOrders, Order } from '@/lib/mockOrders';

// 售后订单接口
interface AfterSalesOrder extends Order {
  afterSalesType: 'refund' | 'return' | 'exchange';
  afterSalesStatus: 'pending' | 'processing' | 'approved' | 'rejected' | 'completed';
  afterSalesReason: string;
  afterSalesDescription: string;
  afterSalesImages: string[];
  afterSalesCreatedAt: string;
  afterSalesUpdatedAt: string;
  refundAmount?: number;
  refundMethod?: 'original' | 'other';
  refundStatus?: 'pending' | 'processing' | 'completed' | 'failed';
}

export default function AfterSalesManagement() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('all');
  const [afterSalesOrders, setAfterSalesOrders] = useState<AfterSalesOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<AfterSalesOrder | null>(null);
  const [isProcessingModalOpen, setIsProcessingModalOpen] = useState(false);
  const [processingAction, setProcessingAction] = useState<'approve' | 'reject'>('approve');
  const [processingNote, setProcessingNote] = useState('');

  // 从localStorage加载售后订单
  useEffect(() => {
    try {
      const savedAfterSalesOrders = localStorage.getItem('afterSalesOrders');
      
      if (savedAfterSalesOrders) {
        setAfterSalesOrders(JSON.parse(savedAfterSalesOrders));
      } else {
        // 创建模拟售后订单数据
        const sampleAfterSalesOrders: AfterSalesOrder[] = mockOrders.slice(0, 3).map(order => ({
          ...order,
          afterSalesType: Math.random() > 0.5 ? 'refund' : 'return',
          afterSalesStatus: ['pending', 'processing', 'approved'][Math.floor(Math.random() * 3)] as 'pending' | 'processing' | 'approved',
          afterSalesReason: ['商品质量问题', '与描述不符', '尺寸不合适', '不想要了'][Math.floor(Math.random() * 4)],
          afterSalesDescription: '这是一个模拟的售后申请描述，用户对商品不满意，希望进行退换货处理。',
          afterSalesImages: [
            'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Product%20quality%20issue%20photo&sign=039de84252cf88e1e89d5ba3f3637bea',
            'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Product%20damage%20photo&sign=68852cb125cef46001b873f3a09a85f3'
          ],
          afterSalesCreatedAt: new Date(Date.now() - Math.floor(Math.random() * 86400000 * 7)).toISOString(),
          afterSalesUpdatedAt: new Date().toISOString(),
          refundAmount: order.totalAmount * (0.5 + Math.random() * 0.5),
          refundMethod: Math.random() > 0.5 ? 'original' : 'other',
          refundStatus: ['pending', 'processing', 'completed'][Math.floor(Math.random() * 3)] as 'pending' | 'processing' | 'completed'
        }));
        
        setAfterSalesOrders(sampleAfterSalesOrders);
        localStorage.setItem('afterSalesOrders', JSON.stringify(sampleAfterSalesOrders));
      }
    } catch (error) {
      console.error('Failed to load after-sales orders:', error);
      toast.error('加载售后订单数据失败');
    }
  }, []);

  // 保存售后订单到localStorage
  const saveAfterSalesOrders = () => {
    try {
      localStorage.setItem('afterSalesOrders', JSON.stringify(afterSalesOrders));
    } catch (error) {
      console.error('Failed to save after-sales orders:', error);
    }
  };

  // 处理售后申请
  const handleProcessAfterSales = () => {
    if (!selectedOrder) return;
    
    const updatedOrders = afterSalesOrders.map(order => {
      if (order.id === selectedOrder.id) {
        return {
          ...order,
          afterSalesStatus: processingAction === 'approve' ? 'approved' : 'rejected',
          afterSalesUpdatedAt: new Date().toISOString()
        };
      }
      return order;
    });
    
    setAfterSalesOrders(updatedOrders);
    saveAfterSalesOrders();
    setIsProcessingModalOpen(false);
    toast.success(`售后申请已${processingAction === 'approve' ? '批准' : '拒绝'}`);
  };

  // 根据标签筛选订单
  const filteredOrders = afterSalesOrders.filter(order => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return order.afterSalesStatus === 'pending';
    if (activeTab === 'processing') return order.afterSalesStatus === 'processing';
    if (activeTab === 'refund') return order.afterSalesType === 'refund';
    if (activeTab === 'return') return order.afterSalesType === 'return';
    return false;
  });

  // 获取售后类型文本
  const getAfterSalesTypeText = (type: string) => {
    switch (type) {
      case 'refund': return '退款';
      case 'return': return '退货退款';
      case 'exchange': return '换货';
      default: return '售后';
    }
  };

  // 获取售后状态样式
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // 获取售后状态文本
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '待处理';
      case 'processing': return '处理中';
      case 'approved': return '已批准';
      case 'rejected': return '已拒绝';
      case 'completed': return '已完成';
      default: return status;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* 页面标题和说明 */}
          <div className={`mb-6 p-4 rounded-lg ${isDark ? 'bg-gray-800 text-gray-200 border border-gray-700' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            <div className="flex items-start">
              <i className="fa-solid fa-exchange text-lg mr-3 mt-1"></i>
              <div>
                <h3 className="font-medium mb-1">售后管理中心</h3>
                <p className="text-sm">处理客户退款、退货和换货申请，查看售后记录和统计数据。及时处理售后可以提升客户满意度。</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">售后管理</h1>
            <button
              onClick={() => navigate('/seller/orders')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <i className="fa-solid fa-arrow-left mr-2"></i>
              返回订单管理
            </button>
          </div>
          
          {/* 标签页 */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('all')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'all' 
                    ? 'border-red-500 text-red-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="fa-solid fa-list mr-2"></i>所有售后
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'pending' 
                    ? 'border-red-500 text-red-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="fa-solid fa-clock mr-2"></i>待处理
                <span className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-100 text-red-800 text-xs font-medium">
                  {afterSalesOrders.filter(o => o.afterSalesStatus === 'pending').length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('processing')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'processing' 
                    ? 'border-red-500 text-red-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="fa-solid fa-spinner mr-2"></i>处理中
              </button>
              <button
                onClick={() => setActiveTab('refund')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'refund' 
                    ? 'border-red-500 text-red-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="fa-solid fa-money-bill mr-2"></i>仅退款
              </button>
              <button
                onClick={() => setActiveTab('return')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'return' 
                    ? 'border-red-500 text-red-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="fa-solid fa-box-open mr-2"></i>退货退款
              </button>
            </nav>
          </div>
          
          {/* 售后订单列表 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">售后订单列表</h2>
              <div className="flex space-x-2">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="搜索订单号/客户" 
                    className="border border-gray-300 rounded px-3 py-2 text-sm pl-8"
                  />
                  <i className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
                </div>
                <select className="border border-gray-300 rounded px-3 py-2 text-sm">
                  <option>最近30天</option>
                  <option>最近90天</option>
                  <option>今年</option>
                  <option>去年</option>
                  <option>自定义</option>
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      售后单号
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      订单编号
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      客户信息
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      售后类型
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      申请金额
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      申请时间
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      状态
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">A{order.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{order.orderNumber}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{order.buyerName}</div>
                          <div className="text-xs text-gray-500">{order.buyerEmail}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{getAfterSalesTypeText(order.afterSalesType)}</div>
                          <div className="text-xs text-gray-500">{order.afterSalesReason}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">¥{(order.refundAmount || order.totalAmount).toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{new Date(order.afterSalesCreatedAt).toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyles(order.afterSalesStatus)}`}>
                            {getStatusText(order.afterSalesStatus)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            onClick={() => {
                              setSelectedOrder(order);
                              setIsProcessingModalOpen(true);
                            }}
                            className={`mr-3 ${
                              order.afterSalesStatus === 'pending' 
                                ? 'text-blue-600 hover:text-blue-900' 
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                            disabled={order.afterSalesStatus !== 'pending' && order.afterSalesStatus !== 'processing'}
                          >
                            {order.afterSalesStatus === 'pending' ? '处理' : '查看'}
                          </button>
                          <button className="text-red-600 hover:text-red-900">详情</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-6 py-10 text-center">
                        <div className="flex flex-col items-center">
                          <i className="fa-solid fa-file-text-o text-gray-300 text-4xl mb-3"></i>
                          <p className="text-gray-500">暂无售后订单数据</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* 分页控件 */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  上一页
                </button>
                <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  下一页
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    显示第 <span className="font-medium">1</span> 到 <span className="font-medium">{filteredOrders.length}</span> 条，共 <span className="font-medium">{filteredOrders.length}</span> 条结果
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      <span className="sr-only">上一页</span>
                      <i className="fa-solid fa-chevron-left text-xs"></i>
                    </button>
                    <button className="bg-red-50 border-red-500 text-red-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                      1
                    </button>
                    <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                      2
                    </button>
                    <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      <span className="sr-only">下一页</span>
                      <i className="fa-solid fa-chevron-right text-xs"></i>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
          
          {/* 处理售后模态框 */}
          {isProcessingModalOpen && selectedOrder && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">处理售后申请</h2>
                    <button
                      onClick={() => setIsProcessingModalOpen(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <i className="fa-solid fa-times text-xl"></i>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* 订单信息 */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">订单信息</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">售后单号</p>
                          <p className="text-sm font-medium text-gray-900">A{selectedOrder.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">订单编号</p>
                          <p className="text-sm font-medium text-gray-900">{selectedOrder.orderNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">下单时间</p>
                          <p className="text-sm font-medium text-gray-900">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">订单金额</p>
                          <p className="text-sm font-medium text-gray-900">¥{selectedOrder.totalAmount.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">申请金额</p>
                          <p className="text-sm font-medium text-gray-900">¥{(selectedOrder.refundAmount || selectedOrder.totalAmount).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* 客户信息 */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">客户信息</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">客户姓名</p>
                          <p className="text-sm font-medium text-gray-900">{selectedOrder.buyerName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">联系邮箱</p>
                          <p className="text-sm font-medium text-gray-900">{selectedOrder.buyerEmail}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">收货地址</p>
                          <p className="text-sm font-medium text-gray-900 truncate">{selectedOrder.shippingAddress}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">申请时间</p>
                          <p className="text-sm font-medium text-gray-900">{new Date(selectedOrder.afterSalesCreatedAt).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">售后类型</p>
                          <p className="text-sm font-medium text-gray-900">{getAfterSalesTypeText(selectedOrder.afterSalesType)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 售后详情 */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">售后详情</h3>
                    <div className="border border-gray-200 rounded-lg p-4 mb-4">
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-900 mb-1">申请原因</p>
                        <p className="text-sm text-gray-700">{selectedOrder.afterSalesReason}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-1">问题描述</p>
                        <p className="text-sm text-gray-700">{selectedOrder.afterSalesDescription}</p>
                      </div>
                    </div>
                    
                    {/* 售后图片 */}
                    {selectedOrder.afterSalesImages && selectedOrder.afterSalesImages.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-2">问题图片</p>
                        <div className="flex flex-wrap gap-3">
                          {selectedOrder.afterSalesImages.map((img, index) => (
                            <div key={index} className="relative group">
                              <img 
                                src={img} 
                                alt={`售后图片 ${index + 1}`}
                                className="h-24 w-24 object-cover rounded border border-gray-200"
                              />
                              <button className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <i className="fa-solid fa-search-plus text-white text-xl"></i>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* 商品信息 */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">商品信息</h3>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              商品
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              单价
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              数量
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              小计
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedOrder.items.map(item => (
                            <tr key={item.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 flex-shrink-0">
                                    <img className="h-10 w-10 object-cover" src={item.image} alt={item.name} />
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">¥{item.price.toFixed(2)}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{item.quantity}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">¥{(item.price * item.quantity).toFixed(2)}</div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  {/* 处理操作 */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">处理操作</h3>
                    
                    <div className="mb-4">
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="processingAction"
                            value="approve"
                            checked={processingAction === 'approve'}
                            onChange={() => setProcessingAction('approve')}
                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 block text-sm text-gray-700">同意申请</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="processingAction"
                            value="reject"
                            checked={processingAction === 'reject'}
                            onChange={() => setProcessingAction('reject')}
                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 block text-sm text-gray-700">拒绝申请</span>
                        </label>
                      </div>
                    </div>
                    
                    {processingAction === 'approve' && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          退款金额
                        </label>
                        <input
                          type="number"
                          value={(selectedOrder.refundAmount || selectedOrder.totalAmount).toFixed(2)}
                          step="0.01"
                          min="0"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                    )}
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        处理备注（将通知客户）
                      </label>
                      <textarea
                        value={processingNote}
                        onChange={(e) => setProcessingNote(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        rows={3}
                        placeholder={processingAction === 'approve' 
                          ? '请输入同意退款/退货的备注信息...' 
                          : '请输入拒绝原因，以便客户了解...'}
                      ></textarea>
                    </div>
                    
                    <div className="flex space-x-4">
                      <button
                        onClick={() => setIsProcessingModalOpen(false)}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md transition-colors"
                      >
                        取消
                      </button>
                      
                      <button
                        onClick={() => {
                          // 这里应该有实际处理逻辑
                          toast.success(`售后申请已${processingAction === 'approve' ? '批准' : '拒绝'}`);
                          setIsProcessingModalOpen(false);
                          
                          // 更新本地存储中的售后订单状态
                          const updatedAfterSalesOrders = afterSalesOrders.map(order => 
                            order.id === selectedOrder.id 
                              ? {
                                  ...order,
                                  afterSalesStatus: processingAction === 'approve' ? 'approved' : 'rejected',
                                  afterSalesUpdatedAt: new Date().toISOString()
                                } 
                              : order
                          );
                          
                          setAfterSalesOrders(updatedAfterSalesOrders);
                          localStorage.setItem('afterSalesOrders', JSON.stringify(updatedAfterSalesOrders));
                        }}
                        className={`flex-1 ${
                          processingAction === 'approve' 
                            ? 'bg-green-600 hover:bg-green-700' 
                            : 'bg-red-600 hover:bg-red-700'
                        } text-white font-bold py-2 px-4 rounded-md transition-colors`}
                      >
                        {processingAction === 'approve' ? '确认同意' : '确认拒绝'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}