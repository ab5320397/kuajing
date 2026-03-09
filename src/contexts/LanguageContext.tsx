import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define supported languages
type Language = 'zh' | 'en' | 'es' | 'fr';

// Define supported currencies
type Currency = 'CNY' | 'USD' | 'EUR';

// Define context type
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  t: (key: string) => string;
  formatPrice: (price: number) => string;
  isChinaIP: boolean | null;
  currencySymbol: string;
  // Return currency string for display
  getCurrency: () => string;
}

// Default context value
const defaultContext: LanguageContextType = {
  language: 'en',
  setLanguage: () => {},
  currency: 'USD',
  setCurrency: () => {},
  t: (key) => key,
  formatPrice: (price) => `$${price.toFixed(2)}`,
  isChinaIP: null,
  currencySymbol: '$',
  getCurrency: () => 'USD'
};

// Create context
const LanguageContext = createContext<LanguageContextType>(defaultContext);

// Translation data
const translations = {
  // English translations (default for non-China IP)
  en: {
    'navigation.home': 'Home',
    'navigation.collections': 'Collections',
    'navigation.men': 'Men',
    'navigation.women': 'Women',
    'navigation.custom': 'Custom',
    'navigation.wholesale': 'Wholesale',
    'navigation.account': 'Account',
    'navigation.cart': 'Cart',
    'hero.title': 'Autumn Winter Collection',
    'hero.subtitle': 'Elevate your style with our exclusive handcrafted pieces, designed for the modern connoisseur.',
    'hero.shopNow': 'Shop Now',
    'hero.customDesign': 'Custom Design',
    'featured.title': 'Featured Collections',
    'featured.subtitle': 'Hand-selected pieces that define the season\'s most coveted styles.',
    'trending.title': 'Trending Now',
    'trending.subtitle': 'AI-curated styles based on global fashion trends.',
    'custom.title': 'Custom Tailoring',
    'custom.subtitle': 'Experience the art of bespoke fashion with our custom tailoring service.',
    'custom.feature1': 'Personalized measurements and fittings',
    'custom.feature2': 'Premium fabrics from around the world',
    'custom.feature3': 'Unique designs tailored to your style',
    'custom.feature4': 'Expert craftsmanship and attention to detail',
    'custom.cta': 'Get Started',
    'wholesale.title': 'Wholesale Inquiries',
    'wholesale.subtitle': 'Interested in becoming a stockist or partnering with us for bulk orders?',
    'wholesale.cta': 'Apply Now',
    'newsletter.title': 'Stay Connected',
    'newsletter.subtitle': 'Subscribe for exclusive updates and early access to new collections.',
    'newsletter.placeholder': 'Enter your email',
    'newsletter.button': 'Subscribe',
    'newsletter.privacy': 'By subscribing, you agree to our Privacy Policy.',
    'product.addToCart': 'Add to Cart',
    'product.buyNow': 'Buy Now',
    'product.outOfStock': 'Out of Stock',
    'product.details': 'Product Details',
    'cart.title': 'Your Cart',
    'cart.empty': 'Your cart is empty',
    'cart.continueShopping': 'Continue Shopping',
    'cart.checkout': 'Proceed to Checkout',
    'cart.subtotal': 'Subtotal',
    'cart.shipping': 'Shipping',
    'cart.tax': 'Tax',
    'cart.total': 'Total',
    'checkout.title': 'Checkout',
    'checkout.shipping': 'Shipping Information',
    'checkout.payment': 'Payment Method',
    'checkout.placeOrder': 'Place Order',
    'login.title': 'Sign In',
    'login.subtitle': 'Enter your account information',
    'login.username': 'Email',
    'login.password': 'Password',
    'login.remember': 'Remember me',
    'login.forgot': 'Forgot password?',
    'login.button': 'Sign In',
    'login.register': 'Create Account',
    'register.title': 'Create Account',
    'register.subtitle': 'Join our exclusive community',
    'register.firstName': 'First Name',
    'register.lastName': 'Last Name',
    'register.email': 'Email',
    'register.password': 'Password',
    'register.confirmPassword': 'Confirm Password',
    'register.agree': 'I agree to the Terms & Conditions and Privacy Policy',
    'register.button': 'Create Account',
    'footer.about': 'About Us',
    'footer.contact': 'Contact',
    'footer.shipping': 'Shipping & Returns',
    'footer.sizeGuide': 'Size Guide',
    'footer.faq': 'FAQ',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.sustainability': 'Sustainability',
    'customerService.title': 'Customer Service',
    'customerService.welcome': 'Hello! How can I assist you today?',
    'customerService.typing': 'AI is typing...',
    'currency': '$',
    'yes': 'Yes',
    'no': 'No',
    'error': 'An error occurred',
    'success': 'Success',
    'loading': 'Loading...'
  },
  
  // Chinese translations (for China IP)
  zh: {
    'navigation.home': '首页',
    'navigation.collections': '系列',
    'navigation.men': '男装',
    'navigation.women': '女装',
    'navigation.custom': '定制',
    'navigation.wholesale': '批发',
    'navigation.account': '账户',
    'navigation.cart': '购物车',
    'hero.title': '秋冬系列',
    'hero.subtitle': '精选手工定制单品，为现代鉴赏家打造独特风格。',
    'hero.shopNow': '立即购买',
    'hero.customDesign': '定制设计',
    'featured.title': '精选系列',
    'featured.subtitle': '当季精选，定义潮流风尚。',
    'trending.title': '热门单品',
    'trending.subtitle': 'AI精选全球流行款式。',
    'custom.title': '私人定制',
    'custom.subtitle': '体验定制服装的艺术，我们的工匠将为您量身打造专属单品。',
    'custom.feature1': '个性化量身定制',
    'custom.feature2': '全球精选优质面料',
    'custom.feature3': '独一无二的设计风格',
    'custom.feature4': '精湛工艺与细节考究',
    'custom.cta': '开始定制',
    'wholesale.title': '批发合作',
    'wholesale.subtitle': '有兴趣成为我们的零售商或批量采购合作伙伴？',
    'wholesale.cta': '申请合作',
    'newsletter.title': '保持联系',
    'newsletter.subtitle': '订阅获取独家更新和新品优先购买权。',
    'newsletter.placeholder': '输入您的邮箱',
    'newsletter.button': '订阅',
    'newsletter.privacy': '订阅即表示您同意我们的隐私政策。',
    'product.addToCart': '加入购物车',
    'product.buyNow': '立即购买',
    'product.outOfStock': '缺货',
    'product.details': '产品详情',
    'cart.title': '购物车',
    'cart.empty': '您的购物车是空的',
    'cart.continueShopping': '继续购物',
    'cart.checkout': '前往结算',
    'cart.subtotal': '小计',
    'cart.shipping': '运费',
    'cart.tax': '税费',
    'cart.total': '总计',
    'checkout.title': '结算',
    'checkout.shipping': '配送信息',
    'checkout.payment': '支付方式',
    'checkout.placeOrder': '提交订单',
    'login.title': '登录',
    'login.subtitle': '请输入您的账号信息',
    'login.username': '邮箱',
    'login.password': '密码',
    'login.remember': '记住我',
    'login.forgot': '忘记密码？',
    'login.button': '登录',
    'login.register': '创建账号',
    'register.title': '创建账号',
    'register.subtitle': '加入我们的专属会员社区',
    'register.firstName': '名字',
    'register.lastName': '姓氏',
    'register.email': '邮箱',
    'register.password': '密码',
    'register.confirmPassword': '确认密码',
    'register.agree': '我同意条款和条件以及隐私政策',
    'register.button': '创建账号',
    'footer.about': '关于我们',
    'footer.contact': '联系我们',
    'footer.shipping': '配送与退换',
    'footer.sizeGuide': '尺码指南',
    'footer.faq': '常见问题',
    'footer.privacy': '隐私政策',
    'footer.terms': '服务条款',
    'footer.sustainability': '可持续发展',
    'customerService.title': '客户服务',
    'customerService.welcome': '您好！我能为您提供什么帮助？',
    'customerService.typing': 'AI正在输入...',
    'currency': '¥',
    'yes': '是',
    'no': '否',
    'error': '发生错误',
    'success': '成功',
    'loading': '加载中...'
  },
  
  // Spanish translations (for Spanish-speaking regions)
  es: {
    'navigation.home': 'Inicio',
    'navigation.collections': 'Colecciones',
    'navigation.men': 'Hombres',
    'navigation.women': 'Mujeres',
    'navigation.custom': 'Personalizado',
    'navigation.wholesale': 'Mayorista',
    'navigation.account': 'Cuenta',
    'navigation.cart': 'Carrito',
    'hero.title': 'Colección Otoño Invierno',
    'hero.subtitle': 'Eleva tu estilo con nuestras piezas exclusivas hechas a mano, diseñadas para el conocedor moderno.',
    'hero.shopNow': 'Comprar Ahora',
    'hero.customDesign': 'Diseño Personalizado',
    'featured.title': 'Colecciones Destacadas',
    'featured.subtitle': 'Piezas seleccionadas a mano que definen los estilos más codiciados de la temporada.',
    'trending.title': 'Tendencias Actuales',
    'trending.subtitle': 'Estilos curados por IA basados en tendencias globales de moda.',
    'custom.title': 'Confección a Medida',
    'custom.subtitle': 'Experimenta el arte de la moda hecha a medida con nuestro servicio de confección personalizada.',
    'custom.feature1': 'Medições y ajustes personalizados',
    'custom.feature2': 'Telas de alta calidad de todo el mundo',
    'custom.feature3': 'Diseños únicos adaptados a tu estilo',
    'custom.feature4': 'Habilidad artesanal experta y atención al detalle',
    'custom.cta': 'Comenzar',
    'wholesale.title': 'Consultas Mayoristas',
    'wholesale.subtitle': '¿Interesado en ser minorista o asociarte con nosotros para pedidos al por mayor?',
    'wholesale.cta': 'Solicitar Ahora',
    'newsletter.title': 'Mantente Conectado',
    'newsletter.subtitle': 'Suscríbete para obtener actualizaciones exclusivas y acceso anticipado a nuevas colecciones.',
    'newsletter.placeholder': 'Introduce tu correo electrónico',
    'newsletter.button': 'Suscribirse',
    'newsletter.privacy': 'Al suscribirte, aceptas nuestra Política de Privacidad.',
    'product.addToCart': 'Añadir al Carrito',
    'product.buyNow': 'Comprar Ahora',
    'product.outOfStock': 'Agotado',
    'product.details': 'Detalles del Producto',
    'cart.title': 'Tu Carrito',
    'cart.empty': 'Tu carrito está vacío',
    'cart.continueShopping': 'Continuar Comprando',
    'cart.checkout': 'Proceder al Pago',
    'cart.subtotal': 'Subtotal',
    'cart.shipping': 'Envío',
    'cart.tax': 'Impuestos',
    'cart.total': 'Total',
    'checkout.title': 'Pago',
    'checkout.shipping': 'Información de Envío',
    'checkout.payment': 'Método de Pago',
    'checkout.placeOrder': 'Realizar Pedido',
    'login.title': 'Iniciar Sesión',
    'login.subtitle': 'Introduce tu información de cuenta',
    'login.username': 'Correo Electrónico',
    'login.password': 'Contraseña',
    'login.remember': 'Recuérdame',
    'login.forgot': '¿Olvidaste tu contraseña?',
    'login.button': 'Iniciar Sesión',
    'login.register': 'Crear Cuenta',
    'register.title': 'Crear Cuenta',
    'register.subtitle': 'Únete a nuestra comunidad exclusiva',
    'register.firstName': 'Nombre',
    'register.lastName': 'Apellido',
    'register.email': 'Correo Electrónico',
    'register.password': 'Contraseña',
    'register.confirmPassword': 'Confirmar Contraseña',
    'register.agree': 'Acepto los Términos y Condiciones y la Política de Privacidad',
    'register.button': 'Crear Cuenta',
    'footer.about': 'Sobre Nosotros',
    'footer.contact': 'Contacto',
    'footer.shipping': 'Envío y Devoluciones',
    'footer.sizeGuide': 'Guía de Tallas',
    'footer.faq': 'Preguntas Frecuentes',
    'footer.privacy': 'Política de Privacidad',
    'footer.terms': 'Términos de Servicio',
    'footer.sustainability': 'Sostenibilidad',
    'customerService.title': 'Servicio al Cliente',
    'customerService.welcome': '¡Hola! ¿En qué puedo ayudarte hoy?',
    'customerService.typing': 'AI está escribiendo...',
    'currency': '€',
    'yes': 'Sí',
    'no': 'No',
    'error': 'Se produjo un error',
    'success': 'Éxito',
    'loading': 'Cargando...'
  },
  
  // French translations
  fr: {
    'navigation.home': 'Accueil',
    'navigation.collections': 'Collections',
    'navigation.men': 'Hommes',
    'navigation.women': 'Femmes',
    'navigation.custom': 'Sur Mesure',
    'navigation.wholesale': 'Gros',
    'navigation.account': 'Compte',
    'navigation.cart': 'Panier',
    'hero.title': 'Collection Automne Hiver',
    'hero.subtitle': 'Élevez votre style avec nos pièces exclusives confectionnées à la main, conçues pour le connaisseur moderne.',
    'hero.shopNow': 'Acheter Maintenant',
    'hero.customDesign': 'Design Sur Mesure',
    'featured.title': 'Collections en Vedette',
    'featured.subtitle': 'Pièces sélectionnées à la main qui définissent les styles les plus prisés de la saison.',
    'trending.title': 'Tendances Actuelles',
    'trending.subtitle': 'Styles sélectionnés par IA basés sur les tendances mondiales de la mode.',
    'custom.title': 'Confection Sur Mesure',
    'custom.subtitle': 'Découvrez l\'art de la mode sur mesure avec notre service de confection personnalisée.',
    'custom.feature1': 'Mesures et ajustements personnalisés',
    'custom.feature2': 'Tissus de luxe du monde entier',
    'custom.feature3': 'Conceptions uniques adaptées à votre style',
    'custom.feature4': 'Artisanat expert et attention aux détails',
    'custom.cta': 'Commencer',
    'wholesale.title': 'Demandes de Gros',
    'wholesale.subtitle': 'Intéressé par devenir revendeur ou se partenarier avec nous pour des commandes en gros ?',
    'wholesale.cta': 'Postuler Maintenant',
    'newsletter.title': 'Restez Connecté',
    'newsletter.subtitle': 'Abonnez-vous pour recevoir des mises à jour exclusives et un accès anticipé aux nouvelles collections.',
    'newsletter.placeholder': 'Entrez votre email',
    'newsletter.button': 'S\'abonner',
    'newsletter.privacy': 'En vous abonnant, vous acceptez notre Politique de Confidentialité.',
    'product.addToCart': 'Ajouter au Panier',
    'product.buyNow': 'Acheter Maintenant',
    'product.outOfStock': 'En Rupture de Stock',
    'product.details': 'Détails du Produit',
    'cart.title': 'Votre Panier',
    'cart.empty': 'Votre panier est vide',
    'cart.continueShopping': 'Continuer vos Achats',
    'cart.checkout': 'Passer à la Caisse',
    'cart.subtotal': 'Sous-total',
    'cart.shipping': 'Livraison',
    'cart.tax': 'Taxes',
    'cart.total': 'Total',
    'checkout.title': 'Paiement',
    'checkout.shipping': 'Informations de Livraison',
    'checkout.payment': 'Méthode de Paiement',
    'checkout.placeOrder': 'Passer la Commande',
    'login.title': 'Connexion',
    'login.subtitle': 'Entrez vos informations de compte',
    'login.username': 'Email',
    'login.password': 'Mot de Passe',
    'login.remember': 'Se Souvenir de Moi',
    'login.forgot': 'Mot de passe oublié ?',
    'login.button': 'Se Connecter',
    'login.register': 'Créer un Compte',
    'register.title': 'Créer un Compte',
    'register.subtitle': 'Rejoignez notre communauté exclusive',
    'register.firstName': 'Prénom',
    'register.lastName': 'Nom',
    'register.email': 'Email',
    'register.password': 'Mot de Passe',
    'register.confirmPassword': 'Confirmer le Mot de Passe',
    'register.agree': 'J\'accepte les Conditions Générales et la Politique de Confidentialité',
    'register.button': 'Créer un Compte',
    'footer.about': 'À Propos de Nous',
    'footer.contact': 'Contact',
    'footer.shipping': 'Livraison et Retours',
    'footer.sizeGuide': 'Guide des Tailles',
    'footer.faq': 'FAQ',
    'footer.privacy': 'Politique de Confidentialité',
    'footer.terms': 'Conditions Générales',
    'footer.sustainability': 'Durabilité',
    'customerService.title': 'Service Client',
    'customerService.welcome': 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?',
    'customerService.typing': 'IA est en train d\'écrire...',
    'currency': '€',
    'yes': 'Oui',
    'no': 'Non',
    'error': 'Une erreur s\'est produite',
    'success': 'Succès',
    'loading': 'Chargement...'
  }
};

// Get real-time exchange rates (simulated)
const getDailyExchangeRates = () => {
  // Generate realistic-looking rates based on current date to simulate daily changes
  const date = new Date();
  const baseUSD = 1;
  const baseEUR = 0.92; // Base rate USD to EUR
  const baseCNY = 7.20; // Base rate USD to CNY
  
  // Create small fluctuations based on date to simulate rate changes
  const dayFactor = date.getDate() / 31; // 0-1
  const monthFactor = date.getMonth() / 12; // 0-1
  
  // Generate fluctuations between -0.02 and +0.02
  const fluctuationUSD = (dayFactor + monthFactor - 1) * 0.02;
  const fluctuationEUR = (dayFactor + monthFactor - 1) * 0.015;
  const fluctuationCNY = (dayFactor + monthFactor - 1) * 0.05;
  
  return {
    USD: parseFloat((baseUSD + fluctuationUSD).toFixed(4)),
    EUR: parseFloat((baseEUR + fluctuationEUR).toFixed(4)),
    CNY: parseFloat((baseCNY + fluctuationCNY).toFixed(4))
  };
};
 
// Get current exchange rates
const exchangeRates = getDailyExchangeRates();

// Get currency symbol based on currency type
const getCurrencySymbol = (currency: Currency): string => {
  switch (currency) {
    case 'USD': return '$';
    case 'EUR': return '€';
    case 'CNY': return '¥';
    default: return '$';
  }
};

// Provider component
interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<Language>('en');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [isChinaIP, setIsChinaIP] = useState<boolean | null>(null);
  const [currencySymbol] = useState(getCurrencySymbol(currency));

  // Simulate IP detection - determine if user is from China
  const detectIPLocation = (): Promise<boolean> => {
    return new Promise((resolve) => {
      // Simulate API call delay
      setTimeout(() => {
        // Simulate detection result - randomly return true/false for testing
        // In a real application, this should call a real IP detection API
        const mockIsChinaIP = Math.random() > 0.5;
        resolve(mockIsChinaIP);
      }, 300);
    });
  };

  // Load language and currency preferences from localStorage and detect IP
  useEffect(() => {
    const initLanguage = async () => {
      try {
        // Detect IP location
        const detectedChinaIP = await detectIPLocation();
        setIsChinaIP(detectedChinaIP);
        
        // Get saved language settings from localStorage
        const savedLang = localStorage.getItem('language') as Language;
        const savedCurrency = localStorage.getItem('currency') as Currency;
        
        // Determine language based on IP and saved settings
        if (savedLang) {
          setLanguage(savedLang);
        } else {
          // Force English for non-China IP
          setLanguage(detectedChinaIP ? 'zh' : 'en');
        }
        
        // Determine currency based on IP and saved settings
        if (savedCurrency) {
          setCurrency(savedCurrency);
        } else {
          // Force USD for non-China IP
          setCurrency(detectedChinaIP ? 'CNY' : 'USD');
        }
      } catch (error) {
        console.error('Failed to initialize language settings:', error);
        setLanguage('en');
        setCurrency('USD');
      }
    };

    initLanguage();
  }, []);

  // Save language and currency preferences to localStorage
  useEffect(() => {
    if (language) {
      localStorage.setItem('language', language);
    }
  }, [language]);

  useEffect(() => {
    if (currency) {
      localStorage.setItem('currency', currency);
    }
  }, [currency]);

  // Override language setting - force English for non-China IP
  const overrideSetLanguage = (lang: Language) => {
    if (isChinaIP === false) {
      // Force English for non-China IP
      setLanguage('en');
      return;
    }
    setLanguage(lang);
  };

  // Override currency setting - force USD/EUR for non-China IP
  const overrideSetCurrency = (selectedCurrency: Currency) => {
    if (isChinaIP === false) {
      // Force USD/EUR based on region (simplified for demo)
      setCurrency(selectedCurrency === 'EUR' ? 'EUR' : 'USD');
      return;
    }
    setCurrency(selectedCurrency);
  };

  // Translation function
  const t = (key: string): string => {
    // Force English translations for non-China IP
    const effectiveLanguage = isChinaIP === false ? 'en' : language;
    return translations[effectiveLanguage][key] || key;
  };

  // Get current exchange rate text
  const getExchangeRateText = () => {
    if (currency === 'CNY') {
      return `1 USD = ${(1 / exchangeRates.CNY).toFixed(2)} CNY`;
    } else if (currency === 'EUR') {
      return `1 USD = ${exchangeRates.EUR.toFixed(2)} EUR`;
    } else {
      return `1 EUR = ${(1 / exchangeRates.EUR).toFixed(2)} USD | 1 CNY = ${(1 / exchangeRates.CNY).toFixed(4)} USD`;
    }
  };

  // Price formatting function with currency conversion
  const formatPrice = (price: number): string => {
    // Convert price based on selected currency (base price in USD)
    let convertedPrice = price;
    let symbol = '$';
    
    switch (currency) {
      case 'CNY':
        convertedPrice = price * exchangeRates.CNY;
        symbol = '¥';
        break;
      case 'EUR':
        convertedPrice = price * exchangeRates.EUR;
        symbol = '€';
        break;
      default:
        // USD - no conversion needed
        break;
    }
    
    return `${symbol}${convertedPrice.toFixed(2)}`;
  };

  // Return currency string for display
  const currencyDisplay = (): string => {
    return currency;
  };
  
  return (
    <LanguageContext.Provider value={{
      language: isChinaIP === false ? 'en' : language,
      setLanguage: overrideSetLanguage,
      currency: isChinaIP === false ? (currency === 'EUR' ? 'EUR' : 'USD') : currency,
      setCurrency: overrideSetCurrency,
      t,
      formatPrice,
      exchangeRateText: getExchangeRateText(),
      currentRate: exchangeRates,
      isChinaIP,
      currencySymbol,
      getCurrency: currencyDisplay
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for using the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === defaultContext) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};