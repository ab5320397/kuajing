import React from 'react';
import { useContext, useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CartContext } from '@/contexts/CartContext';
import { mockProducts } from '@/lib/mockProducts';
import Layout from '@/components/Layout';
import { toast } from 'sonner';
import CustomerServiceChat from '@/components/CustomerServiceChat';
import { useSettings } from '@/contexts/SettingsContext';
import { AuthContext } from '@/contexts/authContext.tsx';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAISizeRecommendation } from '@/hooks/useAISizeRecommendation';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { formatPrice, t } = useLanguage();
  const { isAuthenticated } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const { customerServiceEnabled } = useSettings();
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedSku, setSelectedSku] = useState<string | null>(null);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const maxImages = 6;
  
  // AI size recommendation hook
  const { recommendedSize, loadingSizeRecommendation } = useAISizeRecommendation();
  
  // Find product by ID
  const product = mockProducts.find(p => p.id === Number(id));
  
  // Get effective images
  const effectiveImages = product?.mainImages || product?.images || (product?.image ? [product.image] : []);
  
  // Load size recommendation when product is loaded
  useEffect(() => {
    if (product && (product.category.includes('服装') || product.category.includes('Clothing') || product.category.includes('Footwear'))) {
      // In a real implementation, this would call a function to get size recommendation
      console.log('Loading size recommendation for:', product.name);
    }
  }, [product]);
  
  // If product not found, redirect to home
  if (!product) {
    navigate('/');
    toast.error('Product not found');
    return null;
  }
  
  // Update quantity handler
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (newQuantity > product.stock) return;
    setQuantity(newQuantity);
  };
  
  // Add to cart handler
  const handleAddToCart = () => {
    // If product has SKUs, ensure a SKU is selected
    if (product.skus && product.skus.length > 0 && !selectedSku) {
      toast.error('Please select all product options');
      return;
    }
    
    addToCart(product, quantity);
    toast.success(`${product.name} has been added to your cart`);
  };
  
  // Handle attribute selection
  const handleAttributeSelect = (attrName: string, value: string) => {
    const updatedAttributes = { ...selectedAttributes, [attrName]: value };
    setSelectedAttributes(updatedAttributes);
    
    // Find matching SKU
    if (product.skus) {
      const matchingSku = product.skus.find(sku => {
        return Object.entries(updatedAttributes).every(([key, val]) => sku.attributes[key] === val);
      });
      
      if (matchingSku) {
        setSelectedSku(matchingSku.id);
      } else {
        setSelectedSku(null);
      }
    }
  };
  

  
  // Get current SKU price
  const getCurrentPrice = () => {
    if (!product.skus || !selectedSku) {
      return product.price;
    }
    
    const selectedProductSku = product.skus.find(sku => sku.id === selectedSku);
    return selectedProductSku ? selectedProductSku.price : product.price;
  };
  
  // Get current SKU stock
  const getCurrentStock = () => {
    if (!product.skus || !selectedSku) {
      return product.stock;
    }
    
    const selectedProductSku = product.skus.find(sku => sku.id === selectedSku);
    return selectedProductSku ? selectedProductSku.stock : product.stock;
  };
  
  const currentPrice = getCurrentPrice();
  const currentStock = getCurrentStock();
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb navigation */}
        <div className="text-sm mb-6">
          <Link to="/" className="text-gray-500 hover:text-[var(--color-accent)]">Home</Link>
          <span className="mx-2 text-gray-300">/</span>
          <Link to="/collections" className="text-gray-500 hover:text-[var(--color-accent)]">{product.englishCategory}</Link>
          <span className="mx-2 text-gray-300">/</span>
          <span className="text-gray-900">{product.englishName}</span>
        </div>
        
        <div className="bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Product Image Gallery */}
            <div className="relative">
              {/* Main Image */}
              <div className="bg-gray-50 aspect-square flex items-center justify-center mb-4 overflow-hidden">
                <img 
                  src={effectiveImages[activeImageIndex] || 'https://via.placeholder.com/1000x1000?text=Product+Image'} 
                  alt={`${product.name} - Image ${activeImageIndex + 1}`}
                  className="w-full h-full object-contain max-h-[600px]"
                  loading="lazy"
                />
              </div>
              
              {/* Thumbnail Images */}
              {effectiveImages.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {effectiveImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`aspect-square overflow-hidden border-2 transition-all ${
                        index === activeImageIndex ? 'border-[var(--color-accent)]' : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img 
                        src={img} 
                        alt={`${product.name} - Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              )}
              
              {/* Quick view options */}
              <div className="absolute top-4 left-4 flex flex-col space-y-2">
                {customerServiceEnabled && (
                  <button 
                    onClick={() => setIsChatOpen(true)}
                    className="bg-white/80 backdrop-blur-sm text-black p-2 rounded-full hover:bg-white transition-colors"
                    aria-label="Chat with customer service"
                  >
                    <i className="fa-solid fa-headset"></i>
                  </button>
                )}
                <button className="bg-white/80 backdrop-blur-sm text-black p-2 rounded-full hover:bg-white transition-colors">
                  <i className="fa-solid fa-eye"></i>
                </button>
                <button className="bg-white/80 backdrop-blur-sm text-black p-2 rounded-full hover:bg-white transition-colors">
                  <i className="fa-solid fa-heart"></i>
                </button>
              </div>
            </div>
            
            {/* Product Info */}
            <div className="py-4">
              {/* Brand */}
              <div className="text-sm text-gray-500 mb-1">LUXMODE</div>
              
              {/* Product Name */}
              <h1 className="text-3xl font-light mb-4">{product.name}</h1>
              
              {/* Price */}
              <div className="mb-6">
                <div className="text-3xl font-medium mb-1">{formatPrice(currentPrice)}</div>
                {product.memberPrice && currentPrice > product.memberPrice && (
                  <div className="flex items-center">
                    <span className="text-red-600 line-through mr-2">{formatPrice(product.memberPrice)}</span>
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                      Save {formatPrice(currentPrice - product.memberPrice)}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Rating */}
              <div className="flex items-center mb-6">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <i 
                      key={i} 
                      className={`fa${i < Math.floor(product.rating) ? 'solid' : 'regular'} fa-star`}
                    ></i>
                  ))}
                </div>
                <span className="text-gray-500 ml-2">({product.rating} rating{product.rating !== 1 ? 's' : ''})</span>
              </div>
              
              {/* Size Recommendation */}
              {recommendedSize && (
                <div className="mb-6 p-3 border border-[var(--color-accent)] bg-[var(--color-accent)]/5 rounded-md">
                  <p className="text-sm flex items-start">
                    <i className="fa-solid fa-lightbulb text-[var(--color-accent)] mt-1 mr-2"></i>
                    <span>Based on your previous purchases and body measurements, we recommend <span className="font-medium">{recommendedSize}</span></span>
                  </p>
                </div>
              )}
              
              {/* SKU Selectors */}
              {product.skuAttributes && product.skuAttributes.length > 0 && (
                <div className="mb-8 space-y-6">
                  {product.skuAttributes.map((attr, index) => (
                    <div key={index}>
                      <h3 className="text-sm font-medium mb-3">{attr.name}</h3>
                      <div className="flex flex-wrap gap-3">
                        {attr.values.map(value => {
                          // Determine if this value is selected
                          const isSelected = selectedAttributes[attr.name] === value;
                          
                          // Find matching SKU to check stock
                          let isInStock = true;
                          if (product.skus) {
                            const tempAttributes = { ...selectedAttributes, [attr.name]: value };
                            const matchingSkus = product.skus.filter(sku => {
                              return Object.entries(tempAttributes).every(([key, val]) => sku.attributes[key] === val);
                            });
                            isInStock = matchingSkus.length > 0 && matchingSkus.some(sku => sku.stock > 0);
                          }
                          
                          return (
                            <button
                              key={value}
                              onClick={() => handleAttributeSelect(attr.name, value)}
                              disabled={!isInStock}
                              className={`px-4 py-2 border text-sm transition-all ${
                                isSelected 
                                  ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/5' 
                                  : isInStock 
                                    ? 'border-gray-300 hover:border-[var(--color-accent)]' 
                                    : 'border-gray-200 text-gray-400 cursor-not-allowed'
                              }`}
                            >
                              {value}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Stock Status */}
              <div className="mb-8">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  currentStock > 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {currentStock > 0 
                    ? `In Stock (${currentStock} available)` 
                    : 'Out of Stock'}
                </span>
              </div>
              
              {/* Quantity Selector */}
              <div className="mb-8 flex items-center">
                <label className="block text-sm font-medium mr-4">Quantity</label>
                <div className="flex items-center">
                  <button 
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-3 rounded-l-md"
                    disabled={quantity <= 1}
                  >
                    <i className="fa-solid fa-minus text-xs"></i>
                  </button>
                  <input 
                    type="number" 
                    min="1" 
                    max={currentStock}
                    value={quantity}
                    onChange={(e) => handleQuantityChange(Number(e.target.value))}
                    className="w-16 text-center border-t border-b border-gray-300 py-2 focus:outline-none"
                  />
                  <button 
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-3 rounded-r-md"
                    disabled={quantity >= currentStock}
                  >
                    <i className="fa-solid fa-plus text-xs"></i>
                  </button>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-[var(--color-primary)] hover:bg-black text-white font-medium py-3 px-6 transition-colors flex items-center justify-center"
                  disabled={currentStock <= 0}
                >
                  <i className="fa-solid fa-cart-plus mr-2"></i>
                  Add to Cart
                </button>
                <button
                  onClick={() => {
                    if (!isAuthenticated) {
                      toast.info('Please log in to place an order');
                      navigate('/user-login');
                    } else {
                      addToCart(product, quantity);
                      navigate('/cart');
                    }
                  }}
                  className="flex-1 bg-transparent border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 font-medium py-3 px-6 transition-colors flex items-center justify-center"
                  disabled={currentStock <= 0}
                >
                  Buy Now
                </button>
              </div>
              
              {/* Share and save */}
              <div className="flex items-center text-sm text-gray-500">
                <span className="mr-4">Share:</span>
                <div className="flex space-x-4">
                  <a href="#" className="hover:text-[var(--color-accent)] transition-colors">
                    <i className="fa-brands fa-facebook-f"></i>
                  </a>
                  <a href="#" className="hover:text-[var(--color-accent)] transition-colors">
                    <i className="fa-brands fa-twitter"></i>
                  </a>
                  <a href="#" className="hover:text-[var(--color-accent)] transition-colors">
                    <i className="fa-brands fa-pinterest-p"></i>
                  </a>
                  <a href="#" className="hover:text-[var(--color-accent)] transition-colors">
                    <i className="fa-brands fa-instagram"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Product Details Tabs */}
          <div className="border-t border-gray-200 mt-8">
            <div className="flex flex-wrap">
              <button className="py-4 px-6 border-b-2 border-[var(--color-accent)] text-[var(--color-accent)] font-medium">
                Details
              </button>
              <button className="py-4 px-6 border-b-2 border-transparent text-gray-500 hover:text-gray-700">
                Shipping & Returns
              </button>
              <button className="py-4 px-6 border-b-2 border-transparent text-gray-500 hover:text-gray-700">
                Size Guide
              </button>
              <button className="py-4 px-6 border-b-2 border-transparent text-gray-500 hover:text-gray-700">
                Reviews ({product.rating})
              </button>
            </div>
            
            {/* Product Details Content */}
            <div className="py-8 px-6 md:px-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-xl font-medium mb-6">{product.name}</h2>
                  <div className="prose max-w-none text-gray-600">
                    <p>{product.englishDescription}</p>
                    
                    {/* Product attributes */}
                    <div className="mt-8 space-y-4">
                      {product.attributes && Object.entries(product.attributes).map(([key, value]) => (
                        <div key={key} className="flex">
                          <span className="font-medium text-gray-700 w-28 capitalize">{key}:</span>
                          <span className="text-gray-600">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-8">
                  {/* Sustainability */}
                  <div className="bg-gray-50 p-6 rounded-md"><h3 className="text-lg font-medium mb-4">Sustainability</h3>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <i className="fa-solid fa-leaf text-green-600 mt-1 mr-3"></i>
                        <div>
                          <h4 className="font-medium">Eco-Friendly Materials</h4>
                          <p className="text-sm text-gray-600">This product is made with sustainable materials that minimize environmental impact.</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <i className="fa-solid fa-recycle text-green-600 mt-1 mr-3"></i>
                        <div>
                          <h4 className="font-medium">Recyclable Packaging</h4>
                          <p className="text-sm text-gray-600">Packaged using recycled and recyclable materials to reduce waste.</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <i className="fa-solid fa-users text-green-600 mt-1 mr-3"></i>
                        <div>
                          <h4 className="font-medium">Ethical Production</h4>
                          <p className="text-sm text-gray-600">Manufactured in facilities that ensure fair wages and safe working conditions.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Care Instructions */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Care Instructions</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                      <li>Dry clean only</li>
                      <li>Do not bleach</li>
                      <li>Iron on low heat</li>
                      <li>Store in a cool, dry place</li>
                    </ul>
                  </div>
                  
                  {/* Customization */}
                  {product.category.includes('服装') || product.category.includes('Clothing') ? (
                    <div>
                      <h3 className="text-lg font-medium mb-4">Customization Available</h3>
                      <p className="text-gray-600 mb-4">This item can be customized to your specific measurements and preferences.</p>
                      <Link to="/custom" className="inline-block text-[var(--color-accent)] hover:text-black transition-colors">
                        Learn more about customization <i className="fa-solid fa-arrow-right ml-1 text-xs"></i>
                      </Link>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* You May Also Like */}
        <div className="mt-16">
          <h2 className="text-2xl font-light mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockProducts
              .filter(p => p.id !== Number(id))
              .slice(0, 4)
              .map(product => (
                <div key={product.id} className="group">
                  <Link to={`/product/${product.id}`} className="block relative mb-4 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </Link>
                  <h3 className="font-medium group-hover:text-[var(--color-accent)] transition-colors">
                    <Link to={`/product/${product.id}`}>{product.name}</Link>
                  </h3>
                  <div>{formatPrice(product.price)}</div>
                </div>
              ))}
          </div>
        </div>
      </div>
      
      {/* Customer Service Chat */}
      <CustomerServiceChat 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)}
        productId={product.id}
        productName={product.name}
      />
    </Layout>
  );
}