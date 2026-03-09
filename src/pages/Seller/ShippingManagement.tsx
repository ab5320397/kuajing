import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { toast } from 'sonner';
import { useTheme } from '@/hooks/useTheme';

// 物流模板接口
interface ShippingTemplate {
  id: string;
  name: string;
  deliveryTime: string;
  isDefault: boolean;
  regions: string[];
  feeRule: string;
  updatedAt: string;
}

// 物流公司接口
interface LogisticsCompany {
  id: string;
  name: string;
  code: string;
  contact: string;
  phone: string;
  isActive: boolean;
}

export default function ShippingManagement() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('templates');
  const [shippingTemplates, setShippingTemplates] = useState<ShippingTemplate[]>([]);
  const [logisticsCompanies, setLogisticsCompanies] = useState<LogisticsCompany[]>([]);
  const [isAddingTemplate, setIsAddingTemplate] = useState(false);
  const [isAddingCompany, setIsAddingCompany] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    deliveryTime: '',
    isDefault: false,
    regions: ['全国'],
    feeRule: '首重1kg内10元，续重每kg加5元'
  });
  const [newCompany, setNewCompany] = useState({
    name: '',
    code: '',
    contact: '',
    phone: '',
    isActive: true
  });

  // 从localStorage加载数据
  useEffect(() => {
    try {
      const savedTemplates = localStorage.getItem('shippingTemplates');
      const savedCompanies = localStorage.getItem('logisticsCompanies');
      
      if (savedTemplates) {
        setShippingTemplates(JSON.parse(savedTemplates));
      } else {
        // 默认模板
        const defaultTemplates: ShippingTemplate[] = [
          {
            id: 'temp1',
            name: '标准快递',
            deliveryTime: '3-5天',
            isDefault: true,
            regions: ['全国'],
            feeRule: '首重1kg内10元，续重每kg加5元',
            updatedAt: new Date().toISOString()
          },
          {
            id: 'temp2',
            name: '加急快递',
            deliveryTime: '1-2天',
            isDefault: false,
            regions: ['全国主要城市'],
            feeRule: '首重1kg内20元，续重每kg加10元',
            updatedAt: new Date().toISOString()
          }
        ];
        setShippingTemplates(defaultTemplates);
        localStorage.setItem('shippingTemplates', JSON.stringify(defaultTemplates));
      }
      
      if (savedCompanies) {
        setLogisticsCompanies(JSON.parse(savedCompanies));
      } else {
        // 默认物流公司
        const defaultCompanies: LogisticsCompany[] = [
          {
            id: 'comp1',
            name: '燕文物流',
            code: 'yanwen',
            contact: '张三',
            phone: '400-123-4567',
            isActive: true
          },
          {
            id: 'comp2',
            name: '递四方',
            code: '4px',
            contact: '李四',
            phone: '400-987-6543',
            isActive: true
          },
          {
            id: 'comp3',
            name: 'DHL',
            code: 'dhl',
            contact: '王五',
            phone: '400-888-8888',
            isActive: true
          }
        ];
        setLogisticsCompanies(defaultCompanies);
        localStorage.setItem('logisticsCompanies', JSON.stringify(defaultCompanies));
      }
    } catch (error) {
      console.error('Failed to load shipping data:', error);
      toast.error('加载物流数据失败');
    }
  }, []);

  // 保存物流模板到localStorage
  const saveTemplates = () => {
    try {
      localStorage.setItem('shippingTemplates', JSON.stringify(shippingTemplates));
    } catch (error) {
      console.error('Failed to save shipping templates:', error);
    }
  };

  // 保存物流公司到localStorage
  const saveCompanies = () => {
    try {
      localStorage.setItem('logisticsCompanies', JSON.stringify(logisticsCompanies));
    } catch (error) {
      console.error('Failed to save logistics companies:', error);
    }
  };

  // 添加新物流模板
  const handleAddTemplate = () => {
    if (!newTemplate.name || !newTemplate.deliveryTime) {
      toast.error('请填写模板名称和预计送达时间');
      return;
    }
    
    const template: ShippingTemplate = {
      id: 'temp_' + Date.now(),
      ...newTemplate,
      updatedAt: new Date().toISOString()
    };
    
    // 如果设为默认，更新其他模板
    let updatedTemplates = [...shippingTemplates, template];
    if (template.isDefault) {
      updatedTemplates = updatedTemplates.map(t => ({
        ...t,
        isDefault: t.id === template.id
      }));}
    
    setShippingTemplates(updatedTemplates);
    saveTemplates();
    setIsAddingTemplate(false);
    setNewTemplate({
      name: '',
      deliveryTime: '',
      isDefault: false,
      regions: ['全国'],
      feeRule: '首重1kg内10元，续重每kg加5元'
    });
    toast.success('物流模板添加成功');
  };

  // 添加新物流公司
  const handleAddCompany = () => {
    if (!newCompany.name || !newCompany.code || !newCompany.phone) {
      toast.error('请填写公司名称、代码和联系电话');
      return;
    }
    
    const company: LogisticsCompany = {
      id: 'comp_' + Date.now(),
      ...newCompany
    };
    
    setLogisticsCompanies([...logisticsCompanies, company]);
    saveCompanies();
    setIsAddingCompany(false);
    setNewCompany({
      name: '',
      code: '',
      contact: '',
      phone: '',
      isActive: true
    });
    toast.success('物流公司添加成功');
  };

  // 设置默认模板
  const setDefaultTemplate = (id: string) => {
    const updatedTemplates = shippingTemplates.map(template => ({
      ...template,
      isDefault: template.id === id
    }));
    
    setShippingTemplates(updatedTemplates);
    saveTemplates();
    toast.success('默认物流模板已更新');
  };

  // 切换物流公司状态
  const toggleCompanyStatus = (id: string) => {
    const updatedCompanies = logisticsCompanies.map(company => ({
      ...company,
      isActive: company.id === id ? !company.isActive : company.isActive
    }));
    
    setLogisticsCompanies(updatedCompanies);
    saveCompanies();
    toast.success(`物流公司已${updatedCompanies.find(c => c.id === id)?.isActive ? '启用' : '禁用'}`);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* 页面标题和说明 */}
          <div className={`mb-6 p-4 rounded-lg ${isDark ? 'bg-gray-800 text-gray-200 border border-gray-700' : 'bg-blue-50 text-blue-800 border border-blue-200'}`}>
            <div className="flex items-start">
              <i className="fa-solid fa-truck text-lg mr-3 mt-1"></i>
              <div>
                <h3 className="font-medium mb-1">发货管理中心</h3>
                <p className="text-sm">管理物流模板和物流公司，设置默认配送方式，优化发货流程。所有设置将应用于订单发货环节。</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">发货管理</h1>
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
                onClick={() => setActiveTab('templates')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'templates' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="fa-solid fa-box mr-2"></i>物流模板
              </button>
              <button
                onClick={() => setActiveTab('companies')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'companies' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="fa-solid fa-building mr-2"></i>物流公司
              </button>
              <button
                onClick={() => setActiveTab('batch')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'batch' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="fa-solid fa-layer-group mr-2"></i>批量发货
              </button>
            </nav>
          </div>
          
          {/* 物流模板管理 */}
          {activeTab === 'templates' && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">物流模板管理</h2>
                <button
                  onClick={() => setIsAddingTemplate(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <i className="fa-solid fa-plus mr-2"></i>添加模板
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        模板名称
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        配送范围
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        预计时效
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        运费规则
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        更新时间
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
                    {shippingTemplates.length > 0 ? (
                      shippingTemplates.map((template) => (
                        <tr key={template.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="text-sm font-medium text-gray-900">{template.name}</div>
                              {template.isDefault && (
                                <span className="ml-2 inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                  默认
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{template.regions.join(', ')}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{template.deliveryTime}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 truncate max-w-xs">{template.feeRule}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{new Date(template.updatedAt).toLocaleString()}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              启用中
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900 mr-3">编辑</button>
                            {!template.isDefault && (
                              <button 
                                onClick={() => setDefaultTemplate(template.id)}
                                className="text-green-600 hover:text-green-900 mr-3"
                              >
                                设为默认
                              </button>
                            )}
                            <button className="text-red-600 hover:text-red-900">删除</button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-10 text-center">
                          <div className="flex flex-col items-center">
                            <i className="fa-solid fa-box-open text-gray-300 text-4xl mb-3"></i>
                            <p className="text-gray-500">暂无物流模板数据</p>
                            <button 
                              onClick={() => setIsAddingTemplate(true)}
                              className="mt-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                            >
                              <i className="fa-solid fa-plus mr-1"></i> 创建物流模板
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* 物流公司管理 */}
          {activeTab === 'companies' && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">物流公司管理</h2>
                <button
                  onClick={() => setIsAddingCompany(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <i className="fa-solid fa-plus mr-2"></i>添加公司
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        公司名称
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        公司代码
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        联系人
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        联系电话
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
                    {logisticsCompanies.map((company) => (
                      <tr key={company.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{company.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{company.code}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{company.contact}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{company.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            company.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {company.isActive ? '启用中' : '已禁用'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            onClick={() => toggleCompanyStatus(company.id)}
                            className={`mr-3 ${
                              company.isActive 
                                ? 'text-gray-600 hover:text-gray-900' 
                                : 'text-green-600 hover:text-green-900'
                            }`}
                          >
                            {company.isActive ? '禁用' : '启用'}
                          </button>
                          <button className="text-blue-600 hover:text-blue-900 mr-3">编辑</button>
                          <button className="text-red-600 hover:text-red-900">删除</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* 批量发货 */}
          {activeTab === 'batch' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">批量发货</h2>
              
              <div className="space-y-6">
                <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                  <i className="fa-solid fa-file-import text-gray-400 text-4xl mb-3"></i>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">导入发货单</h3>
                  <p className="text-sm text-gray-500 mb-4">支持Excel格式批量导入订单发货信息</p>
                  <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                    <i className="fa-solid fa-download mr-2"></i>下载模板
                  </button>
                </div>
                
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-sm font-medium text-gray-700">在线填写发货信息</h3>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">订单号</label>
                        <input 
                          type="text" 
                          placeholder="多个订单号用逗号分隔" 
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">物流公司</label>
                        <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="">请选择物流公司</option>
                          {logisticsCompanies
                            .filter(c => c.isActive)
                            .map(company => (
                              <option key={company.id} value={company.code}>{company.name}</option>
                            ))}
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">物流单号</label>
                      <textarea 
                        placeholder="每行输入一个物流单号，与订单号顺序对应" 
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      ></textarea>
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                      <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                        <i className="fa-solid fa-paper-plane mr-2"></i> 提交发货
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* 添加物流模板模态框 */}
          {isAddingTemplate && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">添加物流模板</h2>
                    <button
                      onClick={() => setIsAddingTemplate(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <i className="fa-solid fa-times text-xl"></i>
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        模板名称 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newTemplate.name}
                        onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="例如：标准快递、加急快递"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        配送范围
                      </label>
                      <select
                        value={newTemplate.regions[0]}
                        onChange={(e) => setNewTemplate({...newTemplate, regions: [e.target.value]})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="全国">全国</option>
                        <option value="华北">华北地区</option>
                        <option value="华东">华东地区</option>
                        <option value="华南">华南地区</option>
                        <option value="西北">西北地区</option>
                        <option value="西南">西南地区</option>
                        <option value="东北">东北地区</option>
                        <option value="指定地区">指定地区</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        预计送达时间 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newTemplate.deliveryTime}
                        onChange={(e) => setNewTemplate({...newTemplate, deliveryTime: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="例如：3-5天、1-2工作日"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        运费规则
                      </label>
                      <input
                        type="text"
                        value={newTemplate.feeRule}
                        onChange={(e) => setNewTemplate({...newTemplate, feeRule: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="例如：首重1kg内10元，续重每kg加5元"
                      />
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newTemplate.isDefault}
                        onChange={(e) => setNewTemplate({...newTemplate, isDefault: e.target.checked})}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-700">设为默认物流模板</label>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex space-x-4">
                    <button
                      onClick={() => setIsAddingTemplate(false)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md transition-colors"
                    >
                      取消
                    </button>
                    
                    <button
                      onClick={handleAddTemplate}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
                    >
                      保存模板
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* 添加物流公司模态框 */}
          {isAddingCompany && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">添加物流公司</h2>
                    <button
                      onClick={() => setIsAddingCompany(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <i className="fa-solid fa-times text-xl"></i>
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        公司名称 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newCompany.name}
                        onChange={(e) => setNewCompany({...newCompany, name: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="物流公司名称"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        公司代码 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newCompany.code}
                        onChange={(e) => setNewCompany({...newCompany, code: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="物流公司代码（英文/拼音）"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        联系人
                      </label>
                      <input
                        type="text"
                        value={newCompany.contact}
                        onChange={(e) => setNewCompany({...newCompany, contact: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="联系人姓名"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        联系电话 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newCompany.phone}
                        onChange={(e) => setNewCompany({...newCompany, phone: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="联系电话"
                        required
                      />
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newCompany.isActive}
                        onChange={(e) => setNewCompany({...newCompany, isActive: e.target.checked})}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-700">启用该物流公司</label>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex space-x-4">
                    <button
                      onClick={() => setIsAddingCompany(false)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md transition-colors"
                    >
                      取消
                    </button>
                    
                    <button
                      onClick={handleAddCompany}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
                    >
                      保存公司信息
                    </button>
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