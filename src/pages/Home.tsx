import React from 'react';
import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import ProductList from '@/components/ProductList';
import { mockProducts } from '@/lib/mockProducts';
import { useLanguage } from '@/contexts/LanguageContext';
import { AuthContext } from '@/contexts/authContext.tsx';
import { CartContext } from '@/contexts/CartContext';
import { useBanner } from '@/contexts/BannerContext';
import { toast } from 'sonner';

// Import custom hook for AI features
import { useAIFeatures } from '@/hooks/useAIFeatures';

export default function Home() {
  const { isAuthenticated, user } = useContext(AuthContext);
  const { t, language, isChinaIP } = useLanguage();
  const { getActiveBanners } = useBanner();
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [activeBanners, setActiveBanners] = useState(getActiveBanners());
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [carouselInterval, setCarouselInterval] = useState<ReturnType<typeof setTimeout> | null>(null);
  
  // AI features hook
  const { trendingProducts, userRecommendations } = useAIFeatures();
  
  // Update banners when they change
  useEffect(() => {
    setActiveBanners(getActiveBanners());
  }, [getActiveBanners]);
  
  // Auto-advance carousel
  useEffect(() => {
    if (activeBanners.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => 
        prev === activeBanners.length - 1 ? 0 : prev + 1
      );
    }, 8000);
    
    setCarouselInterval(interval);
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeBanners.length]);
  
  // Reset interval when manually changing slide
  useEffect(() => {
    if (carouselInterval) {
      clearInterval(carouselInterval);
      
      const newInterval = setInterval(() => {
        setCurrentBannerIndex((prev) => 
          prev === activeBanners.length - 1 ? 0 : prev + 1
        );
      }, 8000);
      
      setCarouselInterval(newInterval);
    }
  }, [currentBannerIndex]);
  
  // Custom products for the luxury fashion site
  const luxuryProducts = mockProducts.map(product => ({
    ...product,
    price: product.price * 5, // Increase prices for luxury feel
    memberPrice: product.memberPrice * 4.8,
    category: 'Luxury Fashion',
    englishCategory: 'Luxury Fashion'
  }));
  
  // Filter fashion-related products
  const featuredProducts = luxuryProducts.filter((_, index) => index % 2 === 0);
  
  return (
    <Layout>
      {/* Hero Banner Carousel */}
      <section className="relative overflow-hidden">
        <div className="relative h-[70vh] min-h-[500px]">
          {activeBanners.length > 0 ? (
            activeBanners.map((banner, index) => (
              <div 
                key={banner.id}
                className={`absolute inset-0 transition-opacity duration-1500 ease-in-out ${
                  currentBannerIndex === index ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'
                }`}
              >
                <div className="absolute inset-0 bg-black bg-opacity-30 z-10"></div>
                <img 
                  src={banner.imageUrl} 
                  alt={banner.altText}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Luxury%20fashion%20model%20runway%20show%20high%20end%20elegant&sign=9af131d30d8ec7623d1017c9d87fe814";
                  }}
                />
                <div className="absolute inset-0 flex items-center z-20">
                  <div className="container mx-auto px-4 md:px-8 lg:px-16">
                    <div className="max-w-xl text-white">
                      <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-4 leading-tight">
                        Autumn Winter <span className="font-medium">Collection</span>
                      </h1>
                      <p className="text-lg md:text-xl mb-8 leading-relaxed">
                        Elevate your style with our exclusive handcrafted pieces, designed for the modern connoisseur.
                      </p>
                      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                        <Link 
                          to="/collections" 
                          className="bg-white text-black px-8 py-3 rounded-none uppercase tracking-wider hover:bg-black hover:text-white transition-colors text-center"
                        >
                          Shop Now
                        </Link>
                        <Link 
                          to="/custom" 
                          className="bg-transparent border border-white text-white px-8 py-3 rounded-none uppercase tracking-wider hover:bg-white hover:text-black transition-colors text-center"
                        >
                          Custom Design
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-100">
              <p className="text-gray-500 text-lg">Banner images loading...</p>
            </div>
          )}
          
          {/* Carousel Controls */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2 z-30">
            {activeBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBannerIndex(index)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  currentBannerIndex === index ? 'bg-white w-8' : 'bg-white/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              ></button>
            ))}
          </div>
          
          {/* Previous/Next Buttons */}
          <button
            onClick={() => setCurrentBannerIndex((prev) => 
              prev === 0 ? activeBanners.length - 1 : prev - 1
            )}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-3 rounded-full transition-colors z-30"
            aria-label="Previous slide"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <button
            onClick={() => setCurrentBannerIndex((prev) => 
              prev === activeBanners.length - 1 ? 0 : prev + 1
            )}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-3 rounded-full transition-colors z-30"
            aria-label="Next slide"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'New Arrivals', image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Luxury%20new%20arrivals%20fashion%20collection%20minimalist&sign=2e3eaa1f16a00b760a5496f48be10576' },
              { name: 'Men\'s Collection', image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Luxury%20men%20fashion%20elegant%20style&sign=35286e48dabc6531661dc6e82716a600' },{ name: 'Women\'s Collection', image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Luxury%20women%20fashion%20runway%20model&sign=7879f43d00d3c763bcfb26586ea7120a' },
              { name: 'Custom Design', image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Custom%20luxury%20fashion%20tailored%20suit&sign=6610a52abada67a0e5df7052224e3574' }
            ].map((category, index) => (
              <div key={index} className="group relative overflow-hidden h-80">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end p-6">
                  <Link 
                    to="/collections" 
                    className="text-white text-xl font-medium group-hover:underline"
                  >
                    {category.name}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-light tracking-wide mb-2">Featured <span className="font-medium">Collections</span></h2>
              <p className="text-gray-600 max-w-xl">Hand-selected pieces that define the season's most coveted styles.</p>
            </div>
            <Link to="/collections" className="text-sm uppercase tracking-wider hover:text-[var(--color-accent)] transition-colors flex items-center">
              View All <i className="fa-solid fa-arrow-right ml-2 text-xs"></i>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map(product => (
              <div key={product.id} className="group">
                <div className="relative mb-4 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button 
                      onClick={() => addToCart(product, 1)}
                      className="bg-white text-black px-6 py-2 transform translate-y-4 group-hover:translate-y-0 transition-transform"
                    >
                      Add to Cart
                    </button>
                  </div>
                  {product.memberPrice && product.price > product.memberPrice && (
                    <div className="absolute top-4 left-4 bg-[var(--color-accent)] text-white text-xs px-2 py-1">
                      NEW
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">{product.englishCategory}</div>
                  <h3 className="font-medium mb-1 group-hover:text-[var(--color-accent)] transition-colors">
                    <Link to={`/product/${product.id}`}>{product.name}</Link>
                  </h3>
                  <div className="flex items-center">
                    <span className="font-medium">{t('currency')}{product.price}</span>
                    {product.memberPrice && product.price > product.memberPrice && (
                      <span className="ml-2 text-gray-500 line-through text-sm">{t('currency')}{product.memberPrice}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      {trendingProducts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 md:px-8 lg:px-16">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl font-light tracking-wide mb-2">Trending <span className="font-medium">Now</span></h2>
                <p className="text-gray-600 max-w-xl">AI-curated styles based on global fashion trends.</p>
              </div>
              <Link to="/trending" className="text-sm uppercase tracking-wider hover:text-[var(--color-accent)] transition-colors flex items-center">
                View All <i className="fa-solid fa-arrow-right ml-2 text-xs"></i>
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {trendingProducts.map(product => (
                <div key={product.id} className="group">
                  <div className="relative mb-4 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-medium text-sm group-hover:text-[var(--color-accent)] transition-colors">
                    <Link to={`/product/${product.id}`}>{product.name}</Link>
                  </h3>
                  <div className="text-sm">{t('currency')}{product.price}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Custom Design Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent)] to-transparent"></div>
        </div>
        <div className="container mx-auto px-4 md:px-8 lg:px-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-light tracking-wide mb-6">Custom <span className="font-medium">Tailoring</span></h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Experience the art of bespoke fashion with our custom tailoring service. Our master artisans will craft pieces tailored specifically to your measurements and style preferences.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <i className="fa-solid fa-check text-[var(--color-accent)] mt-1 mr-3"></i>
                  <span>Personalized measurements and fittings</span>
                </li>
                <li className="flex items-start">
                  <i className="fa-solid fa-check text-[var(--color-accent)] mt-1 mr-3"></i>
                  <span>Premium fabrics from around the world</span>
                </li>
                <li className="flex items-start">
                  <i className="fa-solid fa-check text-[var(--color-accent)] mt-1 mr-3"></i>
                  <span>Unique designs tailored to your style</span>
                </li>
                <li className="flex items-start">
                  <i className="fa-solid fa-check text-[var(--color-accent)] mt-1 mr-3"></i>
                  <span>Expert craftsmanship and attention to detail</span>
                </li>
              </ul>
              <Link 
                to="/custom" 
                className="inline-block bg-black text-white px-8 py-3 uppercase tracking-wider hover:bg-[var(--color-accent)] transition-colors"
              >
                Get Started
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img 
                  src="https://space.coze.cn/api/coze_space/gen_image?image_size=portrait_4_3&prompt=Tailor%20measuring%20client%20for%20suit&sign=77704555f4113b785456789baae13943" 
                  alt="Tailor measuring client"
                  className="w-full aspect-[3/4] object-cover"
                />
                <img 
                  src="https://space.coze.cn/api/coze_space/gen_image?image_size=portrait_4_3&prompt=Luxury%20fabric%20selection%20tailoring%20workshop&sign=726ac2e5b1fba69d40e7de6a98ca376b" 
                  alt="Luxury fabric selection"
                  className="w-full aspect-square object-cover"
                />
              </div>
              <div className="space-y-4">
                <img 
                  src="https://space.coze.cn/api/coze_space/gen_image?image_size=portrait_4_3&prompt=Artisan%20sewing%20custom%20suit%20tailoring&sign=800bff6ec4bf86d8617edccc520189a8" 
                  alt="Artisan sewing custom suit"
                  className="w-full aspect-square object-cover"
                />
                <img 
                  src="https://space.coze.cn/api/coze_space/gen_image?image_size=portrait_4_3&prompt=Finished%20luxury%20suit%20on%20mannequin&sign=0a5f44378c2417805d30d03c26545e7d" 
                  alt="Finished luxury suit"
                  className="w-full aspect-[3/4] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wholesale Section */}
      <section className="py-16 border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="bg-gray-50 p-8 md:p-12 text-center">
            <h2 className="text-3xl font-light tracking-wide mb-4">Wholesale <span className="font-medium">Inquiries</span></h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Interested in becoming a stockist or partnering with us for bulk orders? We offer special pricing and terms for wholesale clients.
            </p>
            <Link 
              to="/wholesale" 
              className="inline-block bg-black text-white px-8 py-3 uppercase tracking-wider hover:bg-[var(--color-accent)] transition-colors"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </section>
      
      {/* Newsletter */}
      <section className="py-16 bg-[var(--color-primary)] text-white">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-3xl font-light tracking-wide mb-4">Stay <span className="font-medium">Connected</span></h2>
            <p className="text-white/80 mb-8">
              Subscribe to our newsletter for exclusive updates, early access to new collections, and personalized style recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-[var(--color-accent)]"
              />
              <button className="bg-white text-black px-6 py-3 uppercase tracking-wider hover:bg-[var(--color-accent)] hover:text-white transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
            <p className="text-xs text-white/60 mt-4">
              By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}