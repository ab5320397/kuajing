import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 定义海报类型
export interface Banner {
  id: string;
  imageUrl: string;
  altText: string;
  isActive: boolean;
  order: number;
}

// 定义上下文类型
interface BannerContextType {
  banners: Banner[];
  addBanner: (banner: Omit<Banner, 'id'>) => void;
  updateBanner: (id: string, banner: Partial<Banner>) => void;
  deleteBanner: (id: string) => void;
  reorderBanners: (id: string, newOrder: number) => void;
  getActiveBanners: () => Banner[];
}

// 创建上下文
const BannerContext = createContext<BannerContextType | undefined>(undefined);

// 提供者组件
export const BannerProvider = ({ children }: { children: ReactNode }) => {
  const [banners, setBanners] = useState<Banner[]>([]);

  // 从localStorage加载海报数据
  useEffect(() => {
    try {
      const savedBanners = localStorage.getItem('banners');
      if (savedBanners) {
        setBanners(JSON.parse(savedBanners));
      } else {
        // 默认海报
        const defaultBanners: Banner[] = [
          {
            id: 'default-1',
            imageUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=E-commerce%20shopping%20illustration%20modern%20style&sign=5aa794d852153548827bd00d99f7f1c9',
            altText: '购物体验',
            isActive: true,
            order: 1
          }
        ];
        setBanners(defaultBanners);
        localStorage.setItem('banners', JSON.stringify(defaultBanners));
      }
    } catch (error) {
      console.error('Failed to load banners from localStorage:', error);
    }
  }, []);

  // 保存海报数据到localStorage
  useEffect(() => {
    try {
      localStorage.setItem('banners', JSON.stringify(banners));
    } catch (error) {
      console.error('Failed to save banners to localStorage:', error);
    }
  }, [banners]);

  // 添加海报
  const addBanner = (banner: Omit<Banner, 'id'>) => {
    const newBanner: Banner = {
      ...banner,
      id: Date.now().toString()
    };
    
    // 确保order是唯一的
    const maxOrder = banners.length > 0 ? Math.max(...banners.map(b => b.order)) : 0;
    newBanner.order = maxOrder + 1;
    
    setBanners([...banners, newBanner]);
  };

  // 更新海报
  const updateBanner = (id: string, bannerData: Partial<Banner>) => {
    setBanners(banners.map(banner => 
      banner.id === id ? { ...banner, ...bannerData } : banner
    ));
  };

  // 删除海报
  const deleteBanner = (id: string) => {
    if (banners.length <= 1) {
      alert('至少需要保留一张海报');
      return;
    }
    setBanners(banners.filter(banner => banner.id !== id));
  };

  // 重新排序海报
  const reorderBanners = (id: string, newOrder: number) => {
    // 调整其他海报的order以确保唯一性
    const updatedBanners = banners.map(banner => {
      if (banner.id === id) {
        return { ...banner, order: newOrder };
      } else if (banner.order >= newOrder) {
        return { ...banner, order: banner.order + 1 };
      }
      return banner;
    });
    
    // 按order排序
    updatedBanners.sort((a, b) => a.order - b.order);
    setBanners(updatedBanners);
  };

  // 获取激活的海报（按order排序）
  const getActiveBanners = () => {
    return [...banners]
      .filter(banner => banner.isActive)
      .sort((a, b) => a.order - b.order);
  };

  return (
    <BannerContext.Provider value={{
      banners,
      addBanner,
      updateBanner,
      deleteBanner,
      reorderBanners,
      getActiveBanners
    }}>
      {children}
    </BannerContext.Provider>
  );
};

// 自定义Hook，方便使用上下文
export const useBanner = () => {
  const context = useContext(BannerContext);
  if (context === undefined) {
    throw new Error('useBanner must be used within a BannerProvider');
  }
  return context;
}