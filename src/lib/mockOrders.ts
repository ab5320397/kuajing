import React from 'react';
import { Product } from '@/contexts/CartContext';

// 定义物流状态类型
export type LogisticsStatus = 'pending' | 'transit' | 'delivered' | 'failed' | 'returning' | 'returned';

// 定义物流信息类型
export interface LogisticsInfo {
  id: string;
  provider: 'yanwen' | '4px' | 'dhl' | 'other';
  providerName: string;
  trackingNumber: string;
  status: LogisticsStatus;
  trackingEvents?: Array<{
    timestamp: string;
    location: string;
    description: string;
  }>;
  estimatedDelivery?: string;
}

// 定义订单状态类型
export type OrderStatus = 'pending_payment' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

// 定义订单项类型
export interface OrderItem extends Product {
  quantity: number;
}

// 定义订单类型
export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  buyerName: string;
  buyerEmail: string;
  shippingAddress: string;
  logisticsInfo?: LogisticsInfo;
}

// 模拟订单数据
export const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD20250801001',
    items: [
      {
        id: 1,
        name: "无线蓝牙耳机",
        price: 299.99,
        memberPrice: 279.99,
        image: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Wireless%20Bluetooth%20Headphones%20white%20color%20modern%20design&sign=887f8b500e0ec295d55b75fe66dd661d",
        description: "高品质无线蓝牙耳机，提供卓越音质和长达30小时的电池续航。",
        category: "电子产品",
        rating: 4.8,
        stock: 150,
        quantity: 2
      }
    ],
    totalAmount: 599.98,
    status: 'paid',
    createdAt: '2025-08-01T10:30:00Z',
    updatedAt: '2025-08-01T10:30:00Z',
    buyerName: '张三',
    buyerEmail: 'zhang@example.com',
    shippingAddress: '北京市朝阳区建国路88号'
  },
  {
    id: '2',
    orderNumber: 'ORD20250802002',
    items: [
      {
        id: 2,
        name: "智能手表",
        price: 199.99,
        memberPrice: 189.99,
        image: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Smart%20Watch%20black%20color%20fitness%20tracker&sign=14b69ec91df11e68d34a10091b6f942a",
        description: "多功能智能手表，支持心率监测、睡眠追踪、运动模式等多种健康功能。",
        category: "电子产品",
        rating: 4.6,
        stock: 200,
        quantity: 1
      },
      {
        id: 6,
        name: "无线充电器",
        price: 49.99,
        memberPrice: 47.99,
        image: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Wireless%20Charger%20fast%20charging%20qi%20certified&sign=6d2c3271b9cda74c306b17159f7ebd40",
        description: "快速无线充电器，支持15W快充。兼容所有Qi认证设备。",
        category: "电子产品",
        rating: 4.3,
        stock: 180,
        quantity: 1
      }
    ],
    totalAmount: 249.98,
    status: 'shipped',
    createdAt: '2025-08-02T14:20:00Z',
    updatedAt: '2025-08-03T09:15:00Z',
    buyerName: '李四',
    buyerEmail: 'li@example.com',
    shippingAddress: '上海市浦东新区陆家嘴环路1000号',
    logisticsInfo: {
      id: 'logi123',
      provider: 'yanwen',
      providerName: '燕文物流',
      trackingNumber: 'YW20250803001',
      status: 'transit',
      estimatedDelivery: '2025-08-10',
      trackingEvents: [
        {
          timestamp: '2025-08-03T09:15:00Z',
          location: '上海',
          description: '包裹已揽收'
        },
        {
          timestamp: '2025-08-03T14:30:00Z',
          location: '上海',
          description: '包裹已发出'
        },
        {
          timestamp: '2025-08-04T10:20:00Z',
          location: '广州',
          description: '包裹到达中转中心'
        }
      ]
    }
  },
  {
    id: '3',
    orderNumber: 'ORD20250805003',
    items: [
      {
        id: 5,
        name: "高清监控摄像头",
        price: 149.99,
        memberPrice: 139.99,
        image: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=HD%20Security%20Camera%20night%20vision%20wifi&sign=b8b3d3a692866599c512fdd4ac356f6f",
        description: "1080P高清监控摄像头，支持夜视功能和移动侦测。",
        category: "智能家居",
        rating: 4.4,
        stock: 95,
        quantity: 1
      }
    ],
    totalAmount: 149.99,
    status: 'delivered',
    createdAt: '2025-08-05T11:45:00Z',
    updatedAt: '2025-08-12T16:30:00Z',
    buyerName: '王五',
    buyerEmail: 'wang@example.com',
    shippingAddress: '广东省深圳市福田区深南大道1000号',
    logisticsInfo: {
      id: 'logi124',
      provider: 'dhl',
      providerName: 'DHL',
      trackingNumber: 'DHL20250805001',
      status: 'delivered',
      estimatedDelivery: '2025-08-12',
      trackingEvents: [
        {
          timestamp: '2025-08-05T14:20:00Z',
          location: '深圳',
          description: '包裹已揽收'
        },
        {
          timestamp: '2025-08-06T08:10:00Z',
          location: '香港',
          description: '包裹已发出'
        },
        {
          timestamp: '2025-08-10T15:30:00Z',
          location: '深圳',
          description: '包裹到达目的地'
        },
        {
          timestamp: '2025-08-12T16:30:00Z',
          location: '深圳',
          description: '包裹已送达'
        }
      ]
    }
  }
];