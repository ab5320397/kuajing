import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useProduct } from '@/contexts/ProductContext';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { SkuAttribute, SkuItem } from '@/contexts/CartContext';


export default function ProductUpload() {
  const navigate = useNavigate();
  const { addProduct } = useProduct();
  const { t } = useLanguage();
  
  const maxImages = 6;
   const [formData, setFormData] = useState({
     name: '',
     englishName: '',
     price: 0,
     memberPrice: 0,
     description: '',
     englishDescription: '',
     category: '',
     englishCategory: '',
   stock: 0,
   isActive: true,
     mainImages: [], // 主图，最多6张
     detailImages: [] // 详情图，最多20张
   });
   
   // SKU相关状态
   const [skuAttributes, setSkuAttributes] = useState<SkuAttribute[]>([]);
   const [newAttributeName, setNewAttributeName] = useState('');
   const [newAttributeValue, setNewAttributeValue] = useState('');
   const [skus, setSkus] = useState<SkuItem[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
   // 主图和详情图预览状态
   const [mainImagePreviews, setMainImagePreviews] = useState<string[]>([]);
   const [detailImagePreviews, setDetailImagePreviews] = useState<string[]>([]);
   
   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
     const { name, value } = e.target;
     
     // 处理数字类型
     if (name === 'price' || name === 'stock') {
       setFormData(prev => ({ ...prev, [name]: Number(value) }));
     } else {
       setFormData(prev => ({ ...prev, [name]: value }));
     }
   };
   
   // 处理主图上传
   const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const files = e.target.files;
     if (files) {
       // 限制最多选择6张主图
       const remainingSlots = 6 - formData.mainImages.length;
       const newFiles = Array.from(files).slice(0, remainingSlots);
       
       if (newFiles.length === 0) {
         toast.error(`最多只能上传6张主图`);
         return;
       }
       
       // 为每个文件创建预览
       newFiles.forEach(file => {
         const reader = new FileReader();
         reader.onloadend = () => {
           // 添加预览
           setMainImagePreviews(prev => [...prev, reader.result as string]);
           
           // 生成模拟图片URL
           const simulatedImageUrl = `https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=${encodeURIComponent(formData.name || 'product')}_main_${Date.now()}`;
           
           // 添加到图片URL数组
           setFormData(prev => ({ 
             ...prev, 
             mainImages: [...prev.mainImages, simulatedImageUrl] 
           }));
         };
         reader.readAsDataURL(file);
       });
       
       // 清空input值，允许重复选择相同文件
       if (e.target instanceof HTMLInputElement) {
         e.target.value = '';
       }
     }
   };
   
   // 处理详情图上传
   const handleDetailImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const files = e.target.files;
     if (files) {
       // 限制最多选择20张详情图
       const remainingSlots = 20 - formData.detailImages.length;
       const newFiles = Array.from(files).slice(0, remainingSlots);
       
       if (newFiles.length === 0) {
         toast.error(`最多只能上传20张详情图`);
         return;
       }
       
       // 为每个文件创建预览
       newFiles.forEach(file => {
         const reader = new FileReader();
         reader.onloadend = () => {
           // 添加预览
           setDetailImagePreviews(prev => [...prev, reader.result as string]);
           
           // 生成模拟图片URL
           const simulatedImageUrl = `https://space.coze.cn/api/coze_space/gen_image?image_size=portrait_16_9&prompt=${encodeURIComponent(formData.name || 'product')}_detail_${Date.now()}`;
           
           // 添加到图片URL数组
           setFormData(prev => ({ 
             ...prev, 
             detailImages: [...prev.detailImages, simulatedImageUrl] 
           }));
         };
         reader.readAsDataURL(file);
       });
       
       // 清空input值，允许重复选择相同文件
       if (e.target instanceof HTMLInputElement) {
         e.target.value = '';
       }
     }
   };
  
   // 移除主图
   const removeMainImage = (index: number) => {
     // 更新预览
     const newPreviews = [...mainImagePreviews];
     newPreviews.splice(index, 1);
     setMainImagePreviews(newPreviews);
     
     // 更新URL数组
     const newUrls = [...formData.mainImages];
     newUrls.splice(index, 1);
     
     // 更新表单数据
     setFormData(prev => ({ ...prev, mainImages: newUrls }));
   };
   
   // 移除详情图
   const removeDetailImage = (index: number) => {
     // 更新预览
     const newPreviews = [...detailImagePreviews];
     newPreviews.splice(index, 1);
     setDetailImagePreviews(newPreviews);
     
     // 更新URL数组
     const newUrls = [...formData.detailImages];
     newUrls.splice(index, 1);
     
     // 更新表单数据
     setFormData(prev => ({ ...prev, detailImages: newUrls }));
   };
   
   // 添加SKU属性
   const addSkuAttribute = () => {
     if (!newAttributeName.trim()) {
       toast.error('请输入属性名称');
       return;
     }
     
     setSkuAttributes(prev => [...prev, { name: newAttributeName.trim(), values: [] }]);
     setNewAttributeName('');
   };
   
   // 为指定属性添加值
   const addAttributeValue = (attributeIndex: number) => {
     if (!newAttributeValue.trim()) {
       toast.error('请输入属性值');
       return;
     }
     
     const updatedAttributes = [...skuAttributes];
     if (!updatedAttributes[attributeIndex].values.includes(newAttributeValue.trim())) {
       updatedAttributes[attributeIndex].values.push(newAttributeValue.trim());
       setSkuAttributes(updatedAttributes);
     }
     setNewAttributeValue('');
   };
   
   // 生成SKU组合
   const generateSkus = () => {
     if (skuAttributes.length === 0) return;
     
     // 简单生成所有可能的SKU组合
     let combinations: SkuItem[] = [{ id: '1', attributes: {}, price: formData.price, stock: formData.stock }];
     
     skuAttributes.forEach(attr => {
       const newCombinations: SkuItem[] = [];
       
       combinations.forEach(comb => {
         attr.values.forEach(value => {
           const newComb = { ...comb };
           newComb.id = Date.now().toString();
           newComb.attributes = { ...comb.attributes, [attr.name]: value };
           newCombinations.push(newComb);
         });
       });
       
       combinations = newCombinations;
     });
     
     setSkus(combinations);
   };
  
   const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     
     // 表单验证
      if (!formData.name || !formData.price || !formData.category || !formData.stock) {
       toast.error(t('productUpload.missingFields'));
       return;
     }
     
     // 验证主图数量
     if (formData.mainImages.length === 0) {
       toast.error('请至少上传一张主图');
       return;
     }
     
     setIsSubmitting(true);
     
     try {
       // 准备完整产品数据
       const productData = {
         ...formData,
         skuAttributes,
         skus,
         // 兼容旧的image字段，取第一张主图
         image: formData.mainImages[0] || ''
       };
       
       // 添加产品
       const newProduct = addProduct(productData);
       toast.success(t('productUpload.success'));
       navigate('/seller/products');
     } catch (error) {
       toast.error(t('productUpload.error'));
       console.error('Failed to add product:', error);
     } finally {
       setIsSubmitting(false);
     }
   };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">{t('productUpload.title')}</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                {/* 基本信息 */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('productUpload.name')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('productUpload.englishName')}
                    </label>
                    <input
                      type="text"
                      name="englishName"
                      value={formData.englishName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('productUpload.price')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('productUpload.category')} <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                       <option value="">{t('productUpload.selectCategory')}</option>
                       <option value="服装">{t('productUpload.clothing')}</option>
                       <option value="鞋子">{t('productUpload.shoes')}</option>
                       <option value="3C数码">{t('productUpload.electronics')}</option>
                       <option value="家居用品">{t('productUpload.homeGoods')}</option>
                       <option value="美妆">{t('productUpload.beauty')}</option>
                       <option value="食品">{t('productUpload.food')}</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('productUpload.englishCategory')}
                    </label>
                    <input
                      type="text"
                      name="englishCategory"
                      value={formData.englishCategory}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('productUpload.stock')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                
                {/* 详细信息和图片 */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('productUpload.description')}
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('productUpload.englishDescription')}
                    </label>
                    <textarea
                      name="englishDescription"
                      value={formData.englishDescription}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                  </div>
                  
                     {/* 主图上传区域 */}
                     <div className="mb-8">
                       <label className="block text-sm font-medium text-gray-700 mb-1">
                         主图 (最多6张) <span className="text-red-500">*</span>
                       </label>
                       <input
                         type="file"
                         accept="image/*"
                         onChange={handleMainImageChange}
                         multiple
                         className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                       />
                       
                       <div className="mt-2 text-sm text-gray-500">
                         最多上传6张主图，建议尺寸：800x800像素
                       </div>
                       
                       {mainImagePreviews.length > 0 && (
                         <div className="mt-4">
                           <div className="flex flex-wrap gap-3">
                             {mainImagePreviews.map((preview, index) => (
                               <div key={index} className="relative group">
                                 <img 
                                   src={preview} 
                                   alt={`主图 ${index + 1}`}
                                   className="h-24 w-24 object-cover rounded border border-gray-200"
                                 />
                                 <button
                                   type="button"
                                   onClick={() => removeMainImage(index)}
                                   className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                 >
                                   <i className="fa-solid fa-times"></i>
                                 </button>
                               </div>
                             ))}
                           </div>
                           
                           <div className="mt-2 text-sm font-medium">
                             {mainImagePreviews.length}/6 张主图已上传
                           </div>
                         </div>
                       )}
                     </div>
                     
                     {/* 详情图上传区域 */}
                     <div className="mb-8">
                       <label className="block text-sm font-medium text-gray-700 mb-1">
                         详情图 (最多20张)
                       </label>
                       <input
                         type="file"
                         accept="image/*"
                         onChange={handleDetailImageChange}
                         multiple
                         className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                       />
                       
                       <div className="mt-2 text-sm text-gray-500">
                         最多上传20张详情图，建议尺寸：800x1200像素
                       </div>
                       
                       {detailImagePreviews.length > 0 && (
                         <div className="mt-4">
                           <div className="flex flex-wrap gap-3">
                             {detailImagePreviews.map((preview, index) => (
                               <div key={index} className="relative group">
                                 <img 
                                   src={preview} 
                                   alt={`详情图 ${index + 1}`}
                                   className="h-32 w-24 object-cover rounded border border-gray-200"
                                 />
                                 <button
                                   type="button"
                                   onClick={() => removeDetailImage(index)}
                                   className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                 >
                                   <i className="fa-solid fa-times"></i>
                                 </button>
                               </div>
                             ))}
                           </div>
                           
                           <div className="mt-2 text-sm font-medium">
                             {detailImagePreviews.length}/20 张详情图已上传
                           </div>
                         </div>
                       )}
                     </div>
                     
                     {/* SKU管理区域 */}
                     <div className="mt-8 pt-6 border-t border-gray-200">
                       <h3 className="text-lg font-medium text-gray-900 mb-4">SKU管理</h3>
                       
                       {/* 添加SKU属性 */}
                       <div className="mb-6">
                         <h4 className="text-sm font-medium text-gray-700 mb-3">添加SKU属性（如颜色、尺寸等）</h4>
                         
                         <div className="flex space-x-3 mb-4">
                           <input
                             type="text"
                             placeholder="属性名称（如：颜色）"
                             value={newAttributeName}
                             onChange={(e) => setNewAttributeName(e.target.value)}
                             className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                           />
                           <button
                             onClick={addSkuAttribute}
                             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                           >
                             添加属性
                           </button>
                         </div>
                         
                         {/* 属性值管理 */}
                         {skuAttributes.map((attribute, index) => (
                           <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg">
                             <div className="flex justify-between items-center mb-3">
                               <h5 className="font-medium">{attribute.name}</h5>
                             </div>
                             
                             <div className="flex space-x-3">
                               <input
                                 type="text"
                                 placeholder={`添加${attribute.name}值（如：红色）`}
                                 value={newAttributeValue}
                                 onChange={(e) => setNewAttributeValue(e.target.value)}
                                 className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                               />
                               <button
                                 onClick={() => addAttributeValue(index)}
                                 className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                               >
                                 添加值
                               </button>
                             </div>
                             
                             {/* 属性值标签 */}
                             {attribute.values.length > 0 && (
                               <div className="flex flex-wrap gap-2 mt-3">
                                 {attribute.values.map((value, valueIndex) => (
                                   <span key={valueIndex} className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                                     {value}
                                   </span>
                                 ))}
                               </div>
                             )}
                           </div>
                         ))}
                       </div>
                       
                       {/* 生成SKU按钮 */}
                       {skuAttributes.length > 0 && (
                         <button
                           onClick={generateSkus}
                           className="mb-6 w-full py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                         >
                           生成SKU组合
                         </button>
                       )}
                       
                       {/* SKU列表 */}
                       {skus.length > 0 && (
                         <div className="mt-6">
                           <h4 className="text-sm font-medium text-gray-700 mb-3">SKU列表</h4>
                           <div className="overflow-x-auto">
                             <table className="min-w-full divide-y divide-gray-200">
                               <thead className="bg-gray-50">
                                 <tr>
                                   {skuAttributes.map(attr => (
                                     <th key={attr.name} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                       {attr.name}
                                     </th>
                                   ))}
                                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                     价格
                                   </th>
                                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                     库存
                                   </th>
                                 </tr>
                               </thead>
                               <tbody className="bg-white divide-y divide-gray-200">
                                 {skus.map(sku => (
                                   <tr key={sku.id}>
                                     {Object.values(sku.attributes).map((value, index) => (
                                       <td key={index} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                         {value}
                                       </td>
                                     ))}
                                     <td className="px-6 py-4 whitespace-nowrap">
                                       <input
                                         type="number"
                                         value={sku.price}
                                         onChange={(e) => {
                                           const updatedSkus = [...skus];
                                           const skuIndex = updatedSkus.findIndex(s => s.id === sku.id);
                                           updatedSkus[skuIndex].price = Number(e.target.value);
                                           setSkus(updatedSkus);
                                         }}
                                         className="w-24 px-2 py-1 border border-gray-300 rounded-md"
                                       />
                                     </td>
                                     <td className="px-6 py-4 whitespace-nowrap">
                                       <input
                                         type="number"
                                         value={sku.stock}
                                         onChange={(e) => {
                                           const updatedSkus = [...skus];
                                           const skuIndex = updatedSkus.findIndex(s => s.id === sku.id);
                                           updatedSkus[skuIndex].stock = Number(e.target.value);
                                           setSkus(updatedSkus);
                                         }}
                                         className="w-24 px-2 py-1 border border-gray-300 rounded-md"
                                       />
                                     </td>
                                   </tr>
                                 ))}
                               </tbody>
                             </table>
                           </div>
                         </div>
                       )}
                     </div>

                   {/* 类目特定属性 */}
                   {formData.category === '服装' && (
                     <div className="mt-6 pt-6 border-t border-gray-200">
                       <h3 className="text-lg font-medium text-gray-900 mb-4">服装属性</h3>
                       <div className="grid grid-cols-2 gap-4">
                         <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">尺码</label>
                           <input
                             type="text"
                             placeholder="S,M,L,XL"
                             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                           />
                         </div>
                         <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">颜色</label>
                           <input
                             type="text"
                             placeholder="黑色,白色,红色"
                             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                           />
                         </div>
                         <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">材质</label>
                           <input
                             type="text"
                             placeholder="棉,涤纶,羊毛"
                             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                           />
                         </div>
                         <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">季节</label>
                           <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                             <option>春季</option>
                             <option>夏季</option>
                             <option>秋季</option>
                             <option>冬季</option>
                             <option>四季通用</option>
                           </select>
                         </div>
                       </div>
                     </div>
                   )}

                   {formData.category === '鞋子' && (
                     <div className="mt-6 pt-6 border-t border-gray-200">
                       <h3 className="text-lg font-medium text-gray-900 mb-4">鞋子属性</h3>
                       <div className="grid grid-cols-2 gap-4">
                         <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">鞋码</label>
                           <input
                             type="text"
                             placeholder="36,37,38,39,40"
                             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                           />
                         </div>
                         <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">颜色</label>
                           <input
                             type="text"
                             placeholder="黑色,白色,红色"
                             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                           />
                         </div>
                         <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">材质</label>
                           <input
                             type="text"
                             placeholder="皮革,布料,橡胶"
                             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                           />
                         </div>
                         <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">鞋跟高度</label>
                           <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                             <option>平底</option>
                             <option>低跟</option>
                             <option>中跟</option>
                             <option>高跟</option>
                           </select>
                         </div>
                       </div>
                     </div>
                   )}

                   {formData.category === '3C数码' && (
                     <div className="mt-6 pt-6 border-t border-gray-200">
                       <h3 className="text-lg font-medium text-gray-900 mb-4">3C数码属性</h3>
                       <div className="space-y-4">
                         <div className="grid grid-cols-2 gap-4">
                           <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1">品牌</label>
                             <input
                               type="text"
                               placeholder="苹果,三星,华为"
                               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                             />
                           </div>
                           <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1">型号</label>
                             <input
                               type="text"
                               placeholder="iPhone 13, Galaxy S22"
                               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                             />
                           </div>
                         </div>
                         <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">规格参数</label>
                           <textarea
                             rows={3}
                             placeholder="屏幕尺寸: 6.7英寸&#10;处理器: A15仿生芯片&#10;存储容量: 128GB/256GB/512GB"
                             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                           ></textarea>
                         </div>
                         <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">保修期限</label>
                           <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                             <option>12个月</option>
                             <option>24个月</option>
                             <option>36个月</option>
                           </select>
                         </div>
                       </div>
                     </div>
                   )}
                </div>
              </div>
              
              <div className="mt-8 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/seller/products')}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {t('productUpload.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 border border-transparent rounded-md font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                      {t('productUpload.submitting')}
                    </span>
                  ) : (
                    t('productUpload.submit')
                  )}
                </button>
              </div>
            </form>
          </div>
          
          {/* 与国内平台对比优势 */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-100">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">{t('productUpload.comparisonTitle')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <i className="fa-solid fa-check-circle text-green-500 mt-1 mr-2"></i>
                <span>{t('productUpload.advantage1')}</span>
              </li>
              <li className="flex items-start">
                <i className="fa-solid fa-check-circle text-green-500 mt-1 mr-2"></i>
                <span>{t('productUpload.advantage2')}</span>
              </li>
              <li className="flex items-start">
                <i className="fa-solid fa-check-circle text-green-500 mt-1 mr-2"></i>
                <span>{t('productUpload.advantage3')}</span>
              </li>
              <li className="flex items-start">
                <i className="fa-solid fa-check-circle text-green-500 mt-1 mr-2"></i>
                <span>{t('productUpload.advantage4')}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}