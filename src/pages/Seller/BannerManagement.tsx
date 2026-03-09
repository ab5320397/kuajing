import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useBanner } from '@/contexts/BannerContext';
import { toast } from 'sonner';
import { useTheme } from '@/hooks/useTheme';

export default function BannerManagement() {
  const navigate = useNavigate();
  const { banners, addBanner, updateBanner, deleteBanner, reorderBanners } = useBanner();
  const { isDark } = useTheme();
  const [isAddingBanner, setIsAddingBanner] = useState(false);
  const [newBanner, setNewBanner] = useState({
    imageUrl: '',
    altText: '',
    isActive: true
  });
  const [imagePreview, setImagePreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 处理图片URL变化
  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setNewBanner({...newBanner, imageUrl: url});
    
    // 预览图片
    setImagePreview(url);
  };

  // 处理表单输入变化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBanner({...newBanner, [name]: value});
  };

  // 处理添加新海报
  const handleAddBanner = () => {
    if (!newBanner.imageUrl || !newBanner.altText) {
      toast.error('请填写所有必填字段');
      return;
    }
    
    setIsLoading(true);
    
    try {
      addBanner(newBanner);
      toast.success('海报添加成功');
      setIsAddingBanner(false);
      setNewBanner({
        imageUrl: '',
        altText: '',
        isActive: true
      });
      setImagePreview('');
    } catch (error) {
      toast.error('添加海报失败');
      console.error('Failed to add banner:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 处理删除海报
  const handleDelete = (id) => {
    if (window.confirm('确定要删除这张海报吗？')) {
      deleteBanner(id);
      toast.success('海报已删除');
    }
  };

  // 处理海报状态切换
  const handleToggleActive = (id, currentState) => {
    updateBanner(id, { isActive: !currentState });
    toast.success(`海报已${!currentState ? '启用' : '禁用'}`);
  };

  // 处理海报排序
  const handleOrderChange = (id, e) => {
    const newOrder = parseInt(e.target.value);
    if (!isNaN(newOrder) && newOrder > 0) {
      reorderBanners(id, newOrder);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 数据同步说明卡片 */}
          <div className={`mb-6 p-4 rounded-lg ${isDark ? 'bg-gray-800 text-gray-200 border border-gray-700' : 'bg-blue-50 text-blue-800 border border-blue-200'}`}>
            <div className="flex items-start">
              <i className="fa-solid fa-info-circle mt-1 mr-3 text-lg"></i>
              <div>
                <h3 className="font-medium mb-1">海报管理说明</h3>
                <p className="text-sm">这里可以管理首页轮播海报。添加或修改海报后，更改会自动保存并在首页生效。</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">海报管理</h1>
            <div className="flex space-x-3">
              <button
                onClick={() => navigate('/seller/products')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <i className="fa-solid fa-arrow-left mr-2"></i>
                返回商品管理
              </button>
              <button
                onClick={() => setIsAddingBanner(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <i className="fa-solid fa-plus mr-2"></i>
                添加新海报
              </button>
            </div>
          </div>

          {/* 海报列表 */}
          <div className="bg-white shadow overflow-hidden rounded-lg mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    预览
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    图片URL
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    描述文本
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    排序
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
                {banners.length > 0 ? (
                  banners
                    .sort((a, b) => a.order - b.order)
                    .map((banner) => (
                      <tr key={banner.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-16 w-32 flex-shrink-0">
                            <img 
                              className="h-16 w-full object-cover rounded" 
                              src={banner.imageUrl} 
                              alt={banner.altText}
                              onError={(e) => {
                                (e.target).src = "https://via.placeholder.com/150?text=Image+Error";
                              }}
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 truncate max-w-xs">{banner.imageUrl}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{banner.altText}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            min="1"
                            value={banner.order}
                            onChange={(e) => handleOrderChange(banner.id, e)}
                            className="w-16 px-2 py-1 border border-gray-300 rounded-md text-sm"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={banner.isActive}
                                onChange={() => handleToggleActive(banner.id, banner.isActive)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                            <span className="ml-2 text-sm text-gray-700">
                              {banner.isActive ? '启用' : '禁用'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => {
                              setNewBanner({
                                imageUrl: banner.imageUrl,
                                altText: banner.altText,
                                isActive: banner.isActive
                              });
                              setImagePreview(banner.imageUrl);
                              setIsAddingBanner(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            编辑
                          </button>
                          <button
                            onClick={() => deleteBanner(banner.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            删除
                          </button>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center">
                      <div className="flex flex-col items-center">
                        <i className="fa-solid fa-image text-gray-300 text-4xl mb-3"></i>
                        <p className="text-gray-500">暂无海报数据</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 添加/编辑海报表单 */}
          {isAddingBanner && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">添加新海报</h2>
                <button
                  onClick={() => {
                    setIsAddingBanner(false);
                    setNewBanner({
                      imageUrl: '',
                      altText: '',
                      isActive: true
                    });
                    setImagePreview('');
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <i className="fa-solid fa-times text-xl"></i>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    图片URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="imageUrl"
                    value={newBanner.imageUrl}
                    onChange={handleImageUrlChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="输入图片URL地址"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    建议尺寸: 1200x400像素，支持JPG、PNG格式
                  </p>
                </div>

                {imagePreview && (
                  <div className="mt-2 p-2 border border-gray-200 rounded-md">
                    <p className="text-sm font-medium text-gray-700 mb-1">预览:</p>
                    <img 
                      src={imagePreview} 
                      alt="预览" 
                      className="max-w-full h-auto rounded-md"
                      onError={(e) => {
                        (e.target).src = "https://via.placeholder.com/600x200?text=Image+Preview+Error";
                      }}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    描述文本 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="altText"
                    value={newBanner.altText}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="输入图片描述文本"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={newBanner.isActive}
                    onChange={(e) => setNewBanner({...newBanner, isActive: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                    启用海报
                  </label>
                </div>
              </div>

              <div className="mt-6 flex space-x-4">
                <button
                  onClick={() => {
                    setIsAddingBanner(false);
                    setNewBanner({
                      imageUrl: '',
                      altText: '',
                      isActive: true
                    });
                    setImagePreview('');
                  }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleAddBanner}
                  disabled={isLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-70"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                      保存中...
                    </span>
                  ) : (
                    '保存海报'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}