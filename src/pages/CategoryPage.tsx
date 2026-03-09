import React from 'react';
import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import Layout from '@/components/Layout';
import ProductList from '@/components/ProductList';
import { useProduct } from '@/contexts/ProductContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Empty } from '@/components/Empty';

export default function CategoryPage() {
  const { categoryKey } = useParams<{ categoryKey: string }>();
  const { products } = useProduct();
  const { language } = useLanguage();
  
  // 解码URL编码的分类键
  const decodedCategoryKey = categoryKey ? decodeURIComponent(categoryKey) : '';
  
  // 根据分类筛选产品
  const filteredProducts = products.filter(product => 
    product.category === decodedCategoryKey || 
    product.englishCategory === decodedCategoryKey
  );
  
  // 获取分类显示名称
  const getCategoryDisplayName = () => {
    const categories = [
      {zh: '电子产品', en: 'Electronics', categoryKey: '3C数码'},
      {zh: '服装', en: 'Clothing', categoryKey: '服装'},
      {zh: '家居用品', en: 'Home Goods', categoryKey: '家居用品'},
      {zh: '美妆', en: 'Beauty', categoryKey: '美妆'}
    ];
    
    const category = categories.find(c => c.categoryKey === decodedCategoryKey);
    if (category) {
      return language === 'zh' ? category.zh : category.en;
    }
    return decodedCategoryKey;
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            {getCategoryDisplayName()}
          </h1>
          <div className="text-sm text-gray-500">
            共 {filteredProducts.length} 件商品
          </div>
        </div>
        
        {filteredProducts.length > 0 ? (
          <ProductList products={filteredProducts} />
        ) : (
          <Empty message="该分类下暂无商品" />
        )}
      </div>
    </Layout>
  );
}