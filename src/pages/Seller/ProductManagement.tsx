import React from 'react';
import { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useProduct } from '@/contexts/ProductContext';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ProductManagement() {
  const { products, deleteProduct } = useProduct();
  const { isDark } = useTheme();
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const maxImages = 6;
  
  const handleToggleActive = (id: number) => {
    const updatedProducts = products.map(product => 
      product.id === id ? { ...product, isActive: !product.isActive } : product
    );
    // 这里假设useProduct提供了updateProduct方法来更新单个产品
    // 实际实现可能需要调用updateProduct(id, { isActive: !product.isActive })
    // 为了简化，我们直接更新本地状态并保存到localStorage
    localStorage.setItem('sellerProducts', JSON.stringify(updatedProducts));
    // 重新获取产品列表
    window.location.reload();
  };
  
  const handleDelete = (id: number, name: string) => {
    if (window.confirm(t('productManagement.deleteConfirm', { name }))) {
      deleteProduct(id);
      toast.success(t('productManagement.deleteSuccess'));
    }
  };
  
  // 过滤和排序产品
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // 过滤产品
  let filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.englishName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchTerm.toLowerCase());
                          
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && product.isActive) ||
                         (filterStatus === 'inactive' && !product.isActive);
                         
    return matchesSearch && matchesStatus;
  });
  
  // 排序产品
  filteredProducts.sort((a, b) => {
    if (sortField === 'name') {
      return sortDirection === 'asc' 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    } else if (sortField === 'price') {
      return sortDirection === 'asc' 
        ? a.price - b.price 
        : b.price - a.price;
    } else if (sortField === 'stock') {
      return sortDirection === 'asc' 
        ? a.stock - b.stock 
        : b.stock - a.stock;
    } else {
      // 默认按创建时间排序（使用ID模拟）
      return sortDirection === 'asc' 
        ? a.id - b.id 
        : b.id - a.id;
    }
  });
  
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
                <p className="text-sm">系统更新不会自动推送到GitHub。如需同步到GitHub，请手动执行以下步骤：</p>
                <ul className="text-sm list-disc list-inside mt-2 space-y-1">
                  <li>1. 提交更改到本地仓库: <code className="bg-white px-1 py-0.5 rounded text-xs">git add . && git commit -m "描述您的更改"</code></li>
                  <li>2. 推送到GitHub: <code className="bg-white px-1 py-0.5 rounded text-xs">git push origin main</code></li>
                </ul>
                <p className="text-sm mt-2">详细部署指南请查看项目根目录下的 <code className="bg-white px-1 py-0.5 rounded text-xs">DEPLOYMENT.md</code> 文件。</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">{t('productManagement.title')}</h1>
            <Link
              to="/seller/upload"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <i className="fa-solid fa-plus mr-2"></i>
              {t('productManagement.addNew')}
            </Link>
          </div>
          
          {/* 搜索栏 */}
           <div className="mb-6 flex flex-col md:flex-row gap-4">
             <div className="relative flex-1">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <i className="fa-solid fa-search text-gray-400"></i>
               </div>
               <input
                 type="text"
                 name="search"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                 placeholder={t('productManagement.searchPlaceholder')}
               />
             </div>
             
             <div className="flex gap-3">
               <select 
                 value={filterStatus}
                 onChange={(e) => setFilterStatus(e.target.value)}
                 className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
               >
                 <option value="all">所有状态</option>
                 <option value="active">已上架</option>
                 <option value="inactive">已下架</option>
               </select>
               
               <select 
                 value={`${sortField}-${sortDirection}`}
                 onChange={(e) => {
                   const [field, direction] = e.target.value.split('-');
                   setSortField(field as string);
                   setSortDirection(direction as 'asc' | 'desc');
                 }}
                 className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
               >
                 <option value="createdAt-desc">最新上架</option>
                 <option value="createdAt-asc">最早上架</option>
                 <option value="name-asc">名称 A-Z</option>
                 <option value="name-desc">名称 Z-A</option>
                 <option value="price-asc">价格 低到高</option>
                 <option value="price-desc">价格 高到低</option>
                 <option value="stock-asc">库存 低到高</option>
                 <option value="stock-desc">库存 高到低</option>
               </select>
             </div>
           </div>
          
          {/* 产品列表 */}
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('productManagement.image')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('productManagement.name')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('productManagement.category')}
                  </th>
                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     {t('productManagement.price')}
                   </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      会员价格
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('productManagement.stock')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('productManagement.status')}
                    </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('productManagement.status')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('productManagement.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                           <div className="h-10 w-10 flex-shrink-0 relative">
                             <img className="h-10 w-10 object-cover" src={product.images?.[0] || product.image || 'https://via.placeholder.com/150'} alt={product.name} />
                             {product.images && product.images.length > 1 && (
                               <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                 {product.images.length > maxImages ? `${maxImages}+` : product.images.length}
                               </div>
                             )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        {product.englishName && (
                          <div className="text-sm text-gray-500">{product.englishName}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{product.category}</div>
                        {product.englishCategory && (
                          <div className="text-sm text-gray-500">{product.englishCategory}</div>
                        )}
                      </td>
                       <td className="px-6 py-4 whitespace-nowrap">
                         <div className="text-sm text-gray-900">¥{product.price.toFixed(2)}</div>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap">
                         <div className="text-sm text-red-600">¥{product.memberPrice?.toFixed(2) || '未设置'}</div>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{product.stock}</div>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap">
                         <div className="flex items-center">
                           <label className="relative inline-flex items-center cursor-pointer">
                             <input
                               type="checkbox"
                               checked={product.isActive !== undefined ? product.isActive : true}
                               onChange={() => handleToggleActive(product.id)}
                               className="sr-only peer"
                             />
                             <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                           </label>
                           <span className="ml-2 text-sm text-gray-700">
                             {product.isActive !== undefined ? 
                               (product.isActive ? t('productManagement.active') : t('productManagement.inactive')) : 
                               t('productManagement.active')
                             }
                           </span>
                         </div>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                         <Link
                           to={`/seller/products/edit/${product.id}`}
                           className="text-blue-600 hover:text-blue-900 mr-4"
                         >
                           {t('productManagement.edit')}
                         </Link>
                         <button
                           onClick={() => handleDelete(product.id, product.name)}
                           className="text-red-600 hover:text-red-900"
                         >
                           {t('productManagement.delete')}
                         </button>
                       </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center">
                      <div className="flex flex-col items-center">
                        <i className="fa-solid fa-box-open text-gray-300 text-5xl mb-4"></i>
                        <h3 className="text-lg font-medium text-gray-900">{t('productManagement.noProducts')}</h3>
                        <p className="mt-1 text-sm text-gray-500 max-w-md">
                          {t('productManagement.noProductsHint')}
                        </p>
                        <div className="mt-4">
                          <Link
                            to="/seller/upload"
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <i className="fa-solid fa-plus mr-2"></i>
                            {t('productManagement.addFirstProduct')}
                          </Link>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}