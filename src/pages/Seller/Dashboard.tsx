import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useTheme } from '@/hooks/useTheme';
import { mockOrders } from '@/lib/mockOrders';
import { mockProducts } from '@/lib/mockProducts';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';

// 生成模拟销售数据
const generateSalesData = () => {
  const data = [];
  const today = new Date();
  
  // 生成过去14天的销售数据
  for (let i = 13; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    data.push({
      date: date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }),
      orders: Math.floor(Math.random() * 20) + 5,
      sales: Math.floor(Math.random() * 5000) + 1000,
      visitors: Math.floor(Math.random() * 500) + 100
    });
  }
  
  return data;
};

// 生成商品销售分布数据
const generateProductSalesData = () => {
  return mockProducts.slice(0, 5).map(product => ({
    name: product.name.substring(0, 10),
    value: Math.floor(Math.random() * 100) + 10
  }));
};

// 生成订单状态分布数据
const generateOrderStatusData = () => {
  return [
    { name: '待付款', value: 15, color: '#fbbf24' },
    { name: '已付款', value: 30, color: '#3b82f6' },
    { name: '已发货', value: 45, color: '#8b5cf6' },
    { name: '已完成', value: 60, color: '#10b981' },
    { name: '已取消', value: 8, color: '#ef4444' }
  ];
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function Dashboard() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [salesData, setSalesData] = useState(generateSalesData());
  const [productSalesData, setProductSalesData] = useState(generateProductSalesData());
  const [orderStatusData, setOrderStatusData] = useState(generateOrderStatusData());
  const [timeRange, setTimeRange] = useState('14days');
  const [activeMenu, setActiveMenu] = useState('dashboard');
  
  // 计算总计数据
  const totalOrders = salesData.reduce((sum, day) => sum + day.orders, 0);
  const totalSales = salesData.reduce((sum, day) => sum + day.sales, 0);
  const totalVisitors = salesData.reduce((sum, day) => sum + day.visitors, 0);
  const conversionRate = totalOrders > 0 ? ((totalOrders / totalVisitors) * 100).toFixed(2) : '0.00';
  
  // 切换时间范围
  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
    // 在实际应用中，这里会根据选择的时间范围重新获取数据
    setSalesData(generateSalesData());
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-0">
        <div className="max-w-7xl mx-auto flex min-h-screen">
          {/* 左侧导航栏 - 淘宝卖家中心风格 */}
          <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 hidden lg:block">
            <div className="p-4 border-b border-gray-200">
              <h1 className="text-xl font-bold text-orange-600 flex items-center">
                <i className="fa-solid fa-shopping-bag mr-2"></i>卖家中心
              </h1>
            </div>
            
            <nav className="p-4">
              <ul className="space-y-1">
                <li>
                  <button 
                    onClick={() => setActiveMenu('dashboard')}
                    className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                      activeMenu === 'dashboard' 
                        ? 'bg-orange-50 text-orange-600 font-medium' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <i className="fa-solid fa-tachometer-alt w-5 text-center mr-3"></i>
                    <span>控制台</span>
                  </button>
                </li>
                
                <li className="mt-6">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-2">商品管理</p>
                  <ul className="space-y-1">
                    <li>
                      <Link 
                        to="/seller/products"
                        className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                          activeMenu === 'products' 
                            ? 'bg-orange-50 text-orange-600 font-medium' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => setActiveMenu('products')}
                      >
                        <i className="fa-solid fa-box w-5 text-center mr-3"></i>
                        <span>商品列表</span>
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/seller/upload"
                        className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                          activeMenu === 'upload' 
                            ? 'bg-orange-50 text-orange-600 font-medium' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => setActiveMenu('upload')}
                      >
                        <i className="fa-solid fa-upload w-5 text-center mr-3"></i>
                        <span>发布商品</span>
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/seller/banners"
                        className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                          activeMenu === 'banners' 
                            ? 'bg-orange-50 text-orange-600 font-medium' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => setActiveMenu('banners')}
                      >
                        <i className="fa-solid fa-image w-5 text-center mr-3"></i>
                        <span>海报管理</span>
                      </Link>
                    </li>
                  </ul>
                </li>
                
                <li className="mt-6">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-2">订单管理</p>
                  <ul className="space-y-1">
                    <li>
                      <Link 
                        to="/seller/orders"
                        className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                          activeMenu === 'orders' 
                            ? 'bg-orange-50 text-orange-600 font-medium' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => setActiveMenu('orders')}
                      >
                        <i className="fa-solid fa-file-invoice w-5 text-center mr-3"></i>
                        <span>订单列表</span>
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/seller/shipping"
                        className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                          activeMenu === 'shipping' 
                            ? 'bg-orange-50 text-orange-600 font-medium' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => setActiveMenu('shipping')}
                      >
                        <i className="fa-solid fa-truck w-5 text-center mr-3"></i>
                        <span>物流管理</span>
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/seller/after-sales"
                        className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                          activeMenu === 'after-sales' 
                            ? 'bg-orange-50 text-orange-600 font-medium' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => setActiveMenu('after-sales')}
                      >
                        <i className="fa-solid fa-exchange w-5 text-center mr-3"></i>
                        <span>售后管理</span>
                      </Link>
                    </li>
                  </ul>
                </li>
                
                <li className="mt-6">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-2">营销中心</p>
                  <ul className="space-y-1">
                    <li>
                      <button className="w-full text-left px-4 py-2 rounded-md flex items-center text-gray-700 hover:bg-gray-100">
                        <i className="fa-solid fa-bullhorn w-5 text-center mr-3"></i>
                        <span>促销活动</span>
                      </button>
                    </li>
                    <li>
                      <button className="w-full text-left px-4 py-2 rounded-md flex items-center text-gray-700 hover:bg-gray-100">
                        <i className="fa-solid fa-comment-dots w-5 text-center mr-3"></i>
                        <span>评价管理</span>
                      </button>
                    </li>
                  </ul>
                </li>
                
                <li className="mt-6">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-2">数据中心</p>
                  <ul className="space-y-1">
                    <li>
                      <button className="w-full text-left px-4 py-2 rounded-md flex items-center text-gray-700 hover:bg-gray-100">
                        <i className="fa-solid fa-chart-line w-5 text-center mr-3"></i>
                        <span>销售数据</span>
                      </button>
                    </li>
                    <li>
                      <button className="w-full text-left px-4 py-2 rounded-md flex items-center text-gray-700 hover:bg-gray-100">
                        <i className="fa-solid fa-users w-5 text-center mr-3"></i>
                        <span>客户分析</span>
                      </button>
                    </li>
                  </ul>
                </li>
                
                <li className="mt-6">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-2">店铺设置</p>
                  <ul className="space-y-1">
                    <li>
                      <button className="w-full text-left px-4 py-2 rounded-md flex items-center text-gray-700 hover:bg-gray-100">
                        <i className="fa-solid fa-store w-5 text-center mr-3"></i>
                        <span>店铺信息</span>
                      </button>
                    </li>
                    <li>
                      <Link 
                        to="/settings"
                        className="w-full text-left px-4 py-2 rounded-md flex items-center text-gray-700 hover:bg-gray-100"
                      >
                        <i className="fa-solid fa-cog w-5 text-center mr-3"></i>
                        <span>账户设置</span>
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </nav>
          </aside>
          
          {/* 移动端菜单按钮 */}
          <div className="lg:hidden p-4 bg-white border-b border-gray-200 sticky top-0 z-10">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold text-orange-600 flex items-center">
                <i className="fa-solid fa-shopping-bag mr-2"></i>卖家中心
              </h1>
              <button className="text-gray-700">
                <i className="fa-solid fa-bars text-xl"></i>
              </button>
            </div>
          </div>
          
          {/* 主内容区域 */}
          <main className="flex-1 p-6">
            {/* 快捷操作栏 */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">店铺控制台</h2>
                <p className="text-gray-500">欢迎回来！今天是 {new Date().toLocaleDateString()}</p>
              </div>
              
              <div className="mt-4 sm:mt-0 flex space-x-3">
                <div className="relative">
                  <select 
                    value={timeRange}
                    onChange={(e) => handleTimeRangeChange(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-sm"
                  >
                    <option value="today">今日</option>
                    <option value="7days">过去7天</option>
                    <option value="14days">过去14天</option>
                    <option value="30days">过去30天</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <i className="fa-solid fa-chevron-down text-xs"></i>
                  </div>
                </div>
                
                <button
                  onClick={() => navigate('/seller/upload')}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  <i className="fa-solid fa-plus mr-2"></i>发布商品
                </button>
              </div>
            </div>
            
            {/* 关键指标卡片 - 淘宝风格 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">订单总数</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">{totalOrders}</h3>
                    <p className="text-sm text-green-600 mt-2 flex items-center">
                      <i className="fa-solid fa-arrow-up mr-1"></i>12.5% <span className="text-gray-500 ml-1">较上期</span>
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <i className="fa-solid fa-shopping-cart text-blue-600"></i>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">销售总额</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">¥{totalSales.toLocaleString()}</h3>
                    <p className="text-sm text-green-600 mt-2 flex items-center">
                      <i className="fa-solid fa-arrow-up mr-1"></i>8.2% <span className="text-gray-500 ml-1">较上期</span>
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <i className="fa-solid fa-money-bill text-green-600"></i>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">访客总数</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">{totalVisitors}</h3>
                    <p className="text-sm text-red-600 mt-2 flex items-center">
                      <i className="fa-solid fa-arrow-down mr-1"></i>2.1% <span className="text-gray-500 ml-1">较上期</span>
                    </p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <i className="fa-solid fa-users text-purple-600"></i>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">转化率</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">{conversionRate}%</h3>
                    <p className="text-sm text-green-600 mt-2 flex items-center">
                      <i className="fa-solid fa-arrow-up mr-1"></i>0.8% <span className="text-gray-500 ml-1">较上期</span>
                    </p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <i className="fa-solid fa-percent text-yellow-600"></i>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 订单状态卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 md:col-span-2">
                <h3 className="text-sm font-medium text-gray-700 mb-3">待办事项</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center p-3 border border-orange-200 rounded-lg bg-orange-50">
                    <div className="bg-orange-100 p-2 rounded-full mr-3">
                      <i className="fa-solid fa-clock text-orange-600"></i>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">待发货订单</p>
                      <p className="text-xl font-bold text-gray-800">12</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 border border-blue-200 rounded-lg bg-blue-50">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <i className="fa-solid fa-comment text-blue-600"></i>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">待回复留言</p>
                      <p className="text-xl font-bold text-gray-800">8</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">订单状态</h3>
                <div className="space-y-3">
                  {orderStatusData.slice(0, 3).map((status, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: status.color }}></span>
                        <span className="text-sm text-gray-700">{status.name}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-800">{status.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">库存预警</h3>
                <div className="space-y-3">
                  {mockProducts.slice(0, 3).map((product, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="w-3 h-3 rounded-full mr-2 bg-red-100"></span>
                        <span className="text-sm text-gray-700 truncate max-w-[100px]">{product.name}</span>
                      </div>
                      <span className="text-sm font-medium text-red-600">{product.stock < 20 ? product.stock : product.stock}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* 图表区域 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-medium text-gray-700">销售趋势</h3>
                  <div className="flex space-x-2">
                    <button className="text-xs px-3 py-1 rounded-full bg-orange-100 text-orange-600">销售额</button>
                    <button className="text-xs px-3 py-1 rounded-full text-gray-500 hover:bg-gray-100">订单数</button>
                    <button className="text-xs px-3 py-1 rounded-full text-gray-500 hover:bg-gray-100">访客数</button>
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={salesData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#999" />
                      <YAxis tick={{ fontSize: 12 }} stroke="#999" />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: '8px',
                          border: 'none',
                          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                        }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="sales" 
                        name="销售额"
                        stroke="#ff7a45" 
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5, strokeWidth: 0 }}
                        animationDuration={1500}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-4">订单分布</h3>
                <div className="h-64 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={orderStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {orderStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value}个订单`, '订单数量']}
                        contentStyle={{ 
                          borderRadius: '8px',
                          border: 'none',
                          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            {/* 热销商品 */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-gray-700">热销商品</h3>
                <button className="text-xs text-blue-600 hover:text-blue-800">查看全部</button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        商品
                      </th>
                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        销售额
                      </th>
                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        销量
                      </th>
                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        库存
                      </th>
                      <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockProducts.slice(0, 5).map((product, index) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img className="h-10 w-10 object-cover rounded-md" src={product.image} alt={product.name} />
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900 truncate max-w-[150px]">{product.name}</div>
                              <div className="text-xs text-gray-500">{product.category}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                          ¥{(Math.floor(Math.random() * 1000) + 200).toFixed(2)}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                          {Math.floor(Math.random() * 100) + 10}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                          {product.stock}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-800 mr-3">编辑</button>
                          <button className="text-green-600 hover:text-green-800">推广</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* 快速入口 */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-4">快速入口</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                <Link to="/seller/products" className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="bg-blue-100 p-2 rounded-full mb-2">
                    <i className="fa-solid fa-box text-blue-600"></i>
                  </div>
                  <span className="text-xs text-gray-700">商品管理</span>
                </Link>
                
                <Link to="/seller/orders" className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="bg-green-100 p-2 rounded-full mb-2">
                    <i className="fa-solid fa-file-invoice text-green-600"></i>
                  </div>
                  <span className="text-xs text-gray-700">订单管理</span>
                </Link>
                
                <Link to="/seller/upload" className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="bg-purple-100 p-2 rounded-full mb-2">
                    <i className="fa-solid fa-upload text-purple-600"></i>
                  </div>
                  <span className="text-xs text-gray-700">发布商品</span>
                </Link>
                
                <Link to="/seller/shipping" className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="bg-yellow-100 p-2 rounded-full mb-2">
                    <i className="fa-solid fa-truck text-yellow-600"></i>
                  </div>
                  <span className="text-xs text-gray-700">物流管理</span>
                </Link>
                
                <Link to="/seller/banners" className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="bg-red-100 p-2 rounded-full mb-2">
                    <i className="fa-solid fa-image text-red-600"></i>
                  </div>
                  <span className="text-xs text-gray-700">海报管理</span>
                </Link>
                
                <Link to="/seller/after-sales" className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="bg-indigo-100 p-2 rounded-full mb-2">
                    <i className="fa-solid fa-exchange text-indigo-600"></i>
                  </div>
                  <span className="text-xs text-gray-700">售后管理</span>
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </Layout>
  );
}