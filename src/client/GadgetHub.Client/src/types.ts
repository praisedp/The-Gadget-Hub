export type OrderItem = {
  productId: string
  quantity: number
}

export type Allocation = {
  productId: string
  distributor: string
  quantity: number
  unitPrice: number
  deliveryDays: number
}

export type DistributorOrder = {
  distributor: string
  distributorOrderId: string
  deliveryDays: number
}

export type Shortfall = {
  productId: string
  requested: number
  availableTotal: number
  missing: number
}

export type OrderSuccessResponse = {
  orderId: string
  status: string
  finalEstimatedDeliveryDays: number
  allocations: Allocation[]
  distributorOrders: DistributorOrder[]
}

export type Product = {
  id: string
  name: string
  tagline: string
  priceMin: number
  priceMax: number
  image: string
  category: string
}

export const productCatalog: Product[] = [
  {
    id: 'P1001',
    name: 'Aurora Smart Watch',
    tagline: '7-day battery and health tracking',
    priceMin: 120,
    priceMax: 130,
    category: 'Wearables',
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'P1002',
    name: 'Hush Pro ANC Headphones',
    tagline: 'Immersive sound with hybrid noise canceling',
    priceMin: 85,
    priceMax: 95,
    category: 'Audio',
    image:
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'P1003',
    name: 'Pulse Bluetooth Speaker',
    tagline: 'Room-filling 360° audio in a compact body',
    priceMin: 75,
    priceMax: 80,
    category: 'Audio',
    image:
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'P1004',
    name: 'SkyLens 4K Drone',
    tagline: 'Stabilized aerial footage with 35min flight time',
    priceMin: 190,
    priceMax: 200,
    category: 'Drones',
    image:
      'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'P1005',
    name: 'Lumen E-Reader',
    tagline: 'Paper-like display with warm light and weeks of power',
    priceMin: 150,
    priceMax: 160,
    category: 'Reading',
    image:
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'P1006',
    name: 'Glide Electric Scooter',
    tagline: '40km range, foldable, urban commute ready',
    priceMin: 760,
    priceMax: 810,
    category: 'Mobility',
    image:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'P1007',
    name: 'Orbit Mini Projector',
    tagline: 'Pocket cinema with auto keystone',
    priceMin: 320,
    priceMax: 345,
    category: 'Home',
    image:
      'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'P1008',
    name: 'Nimbus Portable Charger',
    tagline: '20,000mAh GaN fast-charge power bank',
    priceMin: 110,
    priceMax: 118,
    category: 'Power',
    image:
      'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=1200&q=80',
  },
]
