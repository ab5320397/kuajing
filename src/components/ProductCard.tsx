import React from 'react';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/contexts/CartContext';
import { CartContext } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { language, t, formatPrice } = useLanguage();
  const { addToCart } = useContext(CartContext);
  
  const handleAddToCart = () => {
    addToCart(product, 1);
    toast.success(`${product.name} has been added to your cart`);
  };
  
  return (
    <div className="group">
      {/* Product Image */}
      <Link to={`/product/${product.id}`} className="block relative mb-4 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        {/* Sale Badge (if applicable) */}
        {product.memberPrice && product.price > product.memberPrice && (
          <div className="absolute top-4 left-4 bg-[var(--color-accent)] text-white text-xs px-2 py-1">
            NEW
          </div>
        )}
        
        {/* Quick View Button */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button 
            onClick={handleAddToCart}
            className="bg-white text-black px-6 py-2 transform translate-y-4 group-hover:translate-y-0 transition-transform"
            disabled={product.stock <= 0}
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </Link>
      
      {/* Product Info */}
      <div>
        {/* Category */}
        <div className="text-sm text-gray-500 mb-1">{language === 'zh' ? product.category : product.englishCategory}</div>
        
        {/* Product Name */}
        <Link to={`/product/${product.id}`}>
           <h3 className="font-medium mb-1 group-hover:text-[var(--color-accent)] transition-colors line-clamp-2">
              {language === 'zh' ? product.name : product.englishName}
           </h3>
        </Link>
        
        {/* Price */}
        <div>
          <div className="flex items-center">
            <span className="font-medium">{formatPrice(product.price)}</span>
            {product.memberPrice && product.price > product.memberPrice && (
              <span className="ml-2 text-gray-500 line-through text-sm">{formatPrice(product.memberPrice)}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}