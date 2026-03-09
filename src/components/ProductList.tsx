import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/contexts/CartContext';

interface ProductListProps {
  products: Product[];
  title?: string;
}

export default function ProductList({ products, title }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <i className="fa-solid fa-box-open text-5xl text-gray-300 mb-4"></i>
        <h3 className="text-xl font-medium text-gray-500">暂无产品</h3>
      </div>
    );
  }
  
  return (
    <div className="mb-16">
      {title && (
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <i className="fa-solid fa-fire-alt text-orange-500 mr-2"></i>
          {title}
        </h2>
      )}
      
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.filter(product => product.isActive !== undefined ? product.isActive : true).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
    </div>
  );
}