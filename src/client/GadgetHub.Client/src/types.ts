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
  {
    id: 'P1009',
    name: 'Zenith Wireless Earbuds',
    tagline: 'Crystal-clear audio with 30hr battery life',
    priceMin: 65,
    priceMax: 75,
    category: 'Audio',
    image:
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'P1010',
    name: 'Nova Smart Display',
    tagline: '10-inch touch display with voice assistant',
    priceMin: 180,
    priceMax: 195,
    category: 'Home',
    image:
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'P1011',
    name: 'Titan Fitness Tracker',
    tagline: 'Advanced health metrics and GPS tracking',
    priceMin: 95,
    priceMax: 110,
    category: 'Wearables',
    image:
      'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'P1012',
    name: 'Echo Mechanical Keyboard',
    tagline: 'RGB backlit with hot-swappable switches',
    priceMin: 120,
    priceMax: 135,
    category: 'Accessories',
    image:
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'P1013',
    name: 'Vortex Gaming Mouse',
    tagline: '16000 DPI sensor with programmable buttons',
    priceMin: 55,
    priceMax: 65,
    category: 'Accessories',
    image:
      'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'P1014',
    name: 'Aether Smart Thermostat',
    tagline: 'AI-powered climate control saves 25% energy',
    priceMin: 140,
    priceMax: 155,
    category: 'Home',
    image:
      'https://images.unsplash.com/photo-1545269865-cbf461f3eb4a?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'P1015',
    name: 'Pixel Action Camera',
    tagline: '4K60 waterproof with image stabilization',
    priceMin: 280,
    priceMax: 310,
    category: 'Cameras',
    image:
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'P1016',
    name: 'Solaris Solar Panel Kit',
    tagline: '100W foldable panel for outdoor charging',
    priceMin: 220,
    priceMax: 245,
    category: 'Power',
    image:
      'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'P1017',
    name: 'Nebula VR Headset',
    tagline: 'Immersive 120Hz display with hand tracking',
    priceMin: 450,
    priceMax: 490,
    category: 'Gaming',
    image:
      'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'P1018',
    name: 'Flux Wireless Charger',
    tagline: '3-in-1 charging pad for phone, watch, earbuds',
    priceMin: 48,
    priceMax: 58,
    category: 'Power',
    image:
      'https://images.unsplash.com/photo-1591290621749-b3bde7657ecd?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'P1019',
    name: 'Apex Smart Lock',
    tagline: 'Fingerprint and app-controlled door lock',
    priceMin: 175,
    priceMax: 195,
    category: 'Home',
    image:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'P1020',
    name: 'Cirrus Air Purifier',
    tagline: 'HEPA filter with real-time air quality display',
    priceMin: 160,
    priceMax: 180,
    category: 'Home',
    image:
      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'P1021',
    name: 'Stratos Robot Vacuum',
    tagline: 'LiDAR navigation with auto-empty dock',
    priceMin: 380,
    priceMax: 420,
    category: 'Home',
    image:
      'https://images.unsplash.com/photo-1576857535152-c0eda20f7bf3?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'P1022',
    name: 'Prism LED Desk Lamp',
    tagline: 'Adjustable color temp with wireless charging base',
    priceMin: 65,
    priceMax: 78,
    category: 'Home',
    image:
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'P1023',
    name: 'Bolt USB-C Hub',
    tagline: '7-in-1 hub with 100W pass-through charging',
    priceMin: 42,
    priceMax: 52,
    category: 'Accessories',
    image:
      'https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'P1024',
    name: 'Horizon Portable Monitor',
    tagline: '15.6-inch 1080p USB-C display',
    priceMin: 210,
    priceMax: 235,
    category: 'Accessories',
    image:
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80',
  },
]
