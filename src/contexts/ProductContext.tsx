import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from './CartContext';

// 定义产品上下文类型
interface ProductContextType {
   products: Product[];
   addProduct: (product: Omit<Product, 'id' | 'rating'> & { attributes?: Record<string, any> }) => void;
   updateProduct: (id: number, product: Partial<Product> & { attributes?: Record<string, any> }) => void;
   deleteProduct: (id: number) => void;
   getProductById: (id: number) => Product | undefined;
}

// 创建上下文
const ProductContext = createContext<ProductContextType | undefined>(undefined);

// 提供者组件
export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);

  // 从localStorage加载产品数据
  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem('sellerProducts');
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      }
    } catch (error) {
      console.error('Failed to load products from localStorage:', error);
    }
  }, []);

  // 保存产品数据到localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sellerProducts', JSON.stringify(products));
    } catch (error) {
      console.error('Failed to save products to localStorage:', error);
    }
  }, [products]);

  // 添加产品
   const addProduct = (product: Omit<Product, 'id' | 'rating'> & { attributes?: Record<string, any> }) => {
     // 确保主图不超过6张
     const limitedMainImages = Array.isArray(product.mainImages) ? product.mainImages.slice(0, 6) : [];
     
     // 确保详情图不超过20张
     const limitedDetailImages = Array.isArray(product.detailImages) ? product.detailImages.slice(0, 20) : [];
     
     const newProduct: Product & { attributes?: Record<string, any> } = {
       ...product,
       id: Date.now(), // 使用时间戳作为临时ID
       rating: 0, // 初始评分为0
       // 应用图片限制
       mainImages: limitedMainImages,
       detailImages: limitedDetailImages,
       // 兼容旧的images字段，取主图第一张
       image: limitedMainImages[0] || ''
     };
     
     setProducts([...products, newProduct]);
     return newProduct;
  };

  // 更新产品
  const updateProduct = (id: number, productData: Partial<Product>) => {
    setProducts(products.map(product => 
      product.id === id ? { ...product, ...productData } : product
    ));
  };

  // 删除产品
  const deleteProduct = (id: number) => {
    setProducts(products.filter(product => product.id !== id));
  };

  // 根据ID获取产品
  const getProductById = (id: number): Product | undefined => {
    return products.find(product => product.id === id);
  };

  return (
    <ProductContext.Provider value={{
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      getProductById
    }}>
      {children}
    </ProductContext.Provider>
  );
};

// 自定义Hook，方便使用产品上下文
export const useProduct = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
}