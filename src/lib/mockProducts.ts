import React from 'react';
import { Product } from '@/contexts/CartContext';

// Luxury fashion products for the high-end clothing website
export const mockProducts: Product[] = [
  {
    id: 1,
    name: "高级定制西装",
    englishName: "Premium Custom Suit",
    price: 899.99,
    memberPrice: 849.99,
    images: [
      "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Luxury%20men%20suit%20black%20color%20high%20quality%20fabric&sign=f08ae0f6a36e5c168a9cefdec4e2888b",
      "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Luxury%20men%20suit%20closeup%20fabric%20texture&sign=7ac36e2cbf52767b732dc63e13774ade",
      "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Luxury%20men%20suit%20on%20mannequin%20detail%20view&sign=20fee433dda4e597d518232bd041441d",
      "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Luxury%20men%20suit%20craftsmanship%20tailoring&sign=88f249809e3297e804b4da5eb27b3fb8",
      "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Luxury%20men%20suit%20accessories%20tie%20pocket%20square&sign=145d69d6436e73c0e6c92af46922fc96"
    ],
    description: "意大利进口面料精心制作的高级定制西装，采用传统工艺与现代技术相结合的方式打造，确保完美贴合您的身形，展现无与伦比的优雅与自信。",
    englishDescription: "Premium custom suit crafted from imported Italian fabric, combining traditional craftsmanship with modern techniques to ensure a perfect fit that showcases unparalleled elegance and confidence.",
    category: "男装",
    englishCategory: "Men's Clothing",
    rating: 4.9,
    stock: 35,
    isActive: true,
    attributes: {
      material: "100%意大利羊毛",
      lining: "铜氨纤维",
      closure: "牛角纽扣",
      fit: "修身款",
      care: "专业干洗"
    },
    skuAttributes: [
      {
        name: "Size",
        values: ["38", "40", "42", "44", "46"]
      },
      {
        name: "Color",
        values: ["Black", "Navy", "Gray", "Brown"]
      }
    ],
    skus: [
      {
        id: "sku1",
        attributes: { "Size": "38", "Color": "Black" },
        price: 899.99,
        stock: 10
      },
      {
        id: "sku2",
        attributes: { "Size": "40", "Color": "Black" },
        price: 899.99,
        stock: 15
      },
      {
        id: "sku3",
        attributes: { "Size": "42", "Color": "Black" },
        price: 899.99,
        stock: 10
      },
      {
        id: "sku4",
        attributes: { "Size": "38", "Color": "Navy" },
        price: 899.99,
        stock: 5
      },
      {
        id: "sku5",
        attributes: { "Size": "40", "Color": "Navy" },
        price: 899.99,
        stock: 12
      },
      {
        id: "sku6",
        attributes: { "Size": "42", "Color": "Navy" },
        price: 899.99,
        stock: 18
      }
    ]
  },
  {
    id: 2,
    name: "高级女士晚礼服",
    englishName: "Premium Evening Gown",
    price: 1299.99,
    memberPrice: 1199.99,
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Luxury%20evening%20gown%20women%20elegant%20design&sign=79c40d795e49470bf2a4378c9acf2c72",
    description: "本季限量款高级女士晚礼服，采用奢华丝绸面料，手工缝制珠片装饰，完美展现女性优雅气质，是红毯与正式场合的理想选择。",
    englishDescription: "This season's limited edition premium evening gown crafted from luxurious silk fabric with hand-sewn bead embellishments, perfectly showcasing a woman's elegance and ideal for red carpet and formal occasions.",
    category: "女装",
    englishCategory: "Women's Clothing",
    rating: 4.8,
    stock: 25,
    attributes: {
      material: "100%真丝",
      lining: "真丝乔其纱",
      closure: "隐形拉链",
      details: "手工珠绣",
      care: "专业干洗"
    }
  },
  {
    id: 3,
    name: "意大利手工皮鞋",
    englishName: "Italian Handcrafted Leather Shoes",
    price: 799.99,
    memberPrice: 749.99,
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Luxury%20Italian%20leather%20shoes%20handcrafted%20brown&sign=a70f6fe9a355c13fe9c5f0245a634df1",
    description: "每一双鞋都经过意大利匠人手工打造，采用精选牛皮，鞋底采用固特异工艺，保证耐用性与舒适度兼具，是品味人士的必备之选。",
    englishDescription: "Each pair is handcrafted by Italian artisans using premium牛皮, with Goodyear welt construction for durability and comfort, making them a must-have for discerning gentlemen.",
    category: "鞋履",
    englishCategory: "Footwear",
    rating: 4.9,
    stock: 40,
    attributes: {
      material: "头层牛皮",
      sole: "真皮大底",
      construction: "固特异工艺",
      origin: "意大利制造",
      care: "专业护理"
    }
  },
  {
    id: 4,
    name: "真丝围巾",
    englishName: "Silk Scarf",
    price: 299.99,
    memberPrice: 279.99,
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Luxury%20silk%20scarf%20elegant%20pattern%20multicolor&sign=5799560cf058086dcb2424df367f4705",
    description: "100%桑蚕丝长围巾，精美的手绘图案，轻薄透气，柔软顺滑，为您的装扮增添一抹优雅与高贵。",
    englishDescription: "100% mulberry silk long scarf with exquisite hand-painted patterns, lightweight and breathable, soft and smooth, adding a touch of elegance and luxury to your outfit.",
    category: "配饰",
    englishCategory: "Accessories",
    rating: 4.7,
    stock: 60,
    attributes: {
      material: "100%桑蚕丝",
      size: "180x90cm",
      pattern: "手绘花卉",
      origin: "意大利设计",
      care: "冷水手洗"
    }
  },
  {
    id: 5,
    name: "高级羊绒大衣",
    englishName: "Premium Cashmere Coat",
    price: 1999.99,
    memberPrice: 1849.99,
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Luxury%20cashmere%20coat%20winter%20elegant%20women&sign=210c530d4e4f638ca2da10a51ab02593",
    description: "采用内蒙古高原顶级羊绒，轻盈保暖，柔软亲肤，经典剪裁设计，适合各种场合穿着，彰显高贵气质。",
    englishDescription: "Made from premium cashmere from the Inner Mongolian plateau, lightweight and warm, soft and skin-friendly, with classic tailoring design suitable for various occasions, showcasing noble temperament.",
    category: "女装",
    englishCategory: "Women's Clothing",
    rating: 4.9,
    stock: 20,
    attributes: {
      material: "100%纯羊绒",
      lining: "铜氨纤维",
      length: "中长款",
      fit: "宽松版型",
      care: "专业干洗"
    }
  },
  {
    id: 6,
    name: "高级真皮手包",
    englishName: "Premium Leather Handbag",
    price: 1499.99,
    memberPrice: 1399.99,
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Luxury%20leather%20handbag%20women%20designer%20black&sign=89353860ed852620307c31c4e5193411",
    description: "采用意大利进口牛皮，纯手工制作，内部结构合理，细节处理精致，是兼具实用性与美观性的高级配饰。",
    englishDescription: "Made from imported Italian cowhide, handcrafted with reasonable internal structure and exquisite detailing, it's a high-end accessory that combines practicality and beauty.",
    category: "配饰",
    englishCategory: "Accessories",
    rating: 4.8,
    stock: 30,
    attributes: {
      material: "意大利头层牛皮",
      lining: "纯棉里布",
      hardware: "镀金金属",
      capacity: "可容纳手机、钱包、化妆品",
      care: "专业护理"
    }
  },
  {
    id: 7,
    name: "定制衬衫",
    englishName: "Custom Dress Shirt",
    price: 399.99,
    memberPrice: 374.99,
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Luxury%20custom%20dress%20shirt%20men%20white%20cotton&sign=ebbb97088a4e4f622d28c95c8af55af5",
    description: "埃及长绒棉定制衬衫，采用温莎领设计，经典袖口，可根据个人尺寸量身定制，穿着舒适透气，尽显绅士风范。",
    englishDescription: "Egyptian cotton custom dress shirt with Windsor collar design and classic cuffs, can be tailored to personal measurements, comfortable and breathable to wear, showing gentlemanly style.",
    category: "男装",
    englishCategory: "Men's Clothing",
    rating: 4.7,
    stock: 50,
    attributes: {
      material: "埃及长绒棉",
      collar: "温莎领",
      cuffs: "圆角袖口",
      fit: "修身款",
      care: "机洗低温"
    }
  },
  {
    id: 8,
    name: "高级羊毛西装外套",
    englishName: "Premium Wool Blazer",
    price: 899.99,
    memberPrice: 849.99,
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Luxury%20wool%20blazer%20men%20navy%20blue%20casual%20formal&sign=61d26d733fa5992a5b88c6b9cbb690b2",
    description: "意大利进口羊毛西装外套，可商务可休闲，单排扣设计，胸袋装饰，后背开叉，是打造多变造型的必备单品。",
    englishDescription: "Imported Italian wool blazer, suitable for both business and casual occasions, with single-breasted design, chest pocket decoration, and back vent, it's a must-have item for creating versatile looks.",
    category: "男装",
    englishCategory: "Men's Clothing",
    rating: 4.8,
    stock: 35,
    attributes: {
      material: "100%意大利羊毛",
      lining: "铜氨纤维",
      closure: "牛角纽扣",
      pockets: "胸袋+侧袋",
      care: "专业干洗"
    }
  }
];