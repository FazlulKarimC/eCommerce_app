// Product Types
export interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
  position: number;
}

export interface ProductOption {
  id: string;
  name: string;
  position: number;
  values: ProductOptionValue[];
}

export interface ProductOptionValue {
  id: string;
  value: string;
  position: number;
}

export interface ProductVariant {
  id: string;
  title: string;
  sku: string | null;
  barcode: string | null;
  price: number;
  compareAtPrice: number | null;
  costPrice: number | null;
  inventoryQty: number;
  weight: number | null;
  weightUnit: string;
  position: number;
  optionValues: Array<{
    optionValue: {
      id: string;
      value: string;
      option: { name: string };
    };
  }>;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string | null;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  featured: boolean;
  vendor: string | null;
  productType: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  variants: ProductVariant[];
  options: ProductOption[];
  images: ProductImage[];
  tags: Array<{ tag: { id: string; name: string } }>;
  collections: Array<{ collection: Collection }>;
  categories: Array<{ category: Category }>;
}

export interface ProductListItem {
  id: string;
  title: string;
  slug: string;
  status: string;
  featured: boolean;
  variants: ProductVariant[];
  images: ProductImage[];
  _count?: { reviews: number };
}

// Collection Types
export interface Collection {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image: string | null;
  featured: boolean;
  sortOrder: string;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: string;
  publishedAt: string | null;
  products?: ProductListItem[];
  _count?: { products: number };
}

// Category Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parentId: string | null;
  position: number;
  parent?: Category;
  children?: Category[];
  products?: ProductListItem[];
  _count?: { products: number };
}

// Order Types
export interface OrderItem {
  id: string;
  productTitle: string;
  variantTitle: string | null;
  sku: string | null;
  quantity: number;
  price: number;
  originalPrice: number;
  imageUrl: string | null;
}

export interface Payment {
  id: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  provider: string;
  transactionId: string | null;
  cardLast4: string | null;
  cardBrand: string | null;
  createdAt: string;
}

export interface Fulfillment {
  id: string;
  status: string;
  carrier: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  estimatedDelivery: string | null;
}

export interface Order {
  id: string;
  orderNumber: string;
  email: string;
  phone: string | null;
  status: 'PENDING' | 'PROCESSING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
  financialStatus: string;
  fulfillmentStatus: string;
  subtotal: number;
  discount: number;
  shippingCost: number;
  tax: number;
  total: number;
  notes: string | null;
  customerNotes: string | null;
  cancelReason: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  payments: Payment[];
  fulfillments: Fulfillment[];
  shippingAddress: Address | null;
  discountCode: DiscountCode | null;
}

// Address Types
export interface Address {
  id: string;
  label: string | null;
  firstName: string;
  lastName: string;
  company: string | null;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string | null;
  isDefault: boolean;
}

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'STAFF' | 'CUSTOMER';
  avatarUrl: string | null;
  emailVerified: boolean;
  createdAt: string;
  customer?: {
    id: string;
    phone: string | null;
    addresses: Address[];
  };
}

// Review Types
export interface Review {
  id: string;
  productId: string;
  rating: number;
  title: string | null;
  content: string | null;
  approved: boolean;
  helpful: number;
  createdAt: string;
  reviewer: string;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Array<{ rating: number; count: number }>;
}

// Discount Types
export interface DiscountCode {
  id: string;
  code: string;
  title: string | null;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING';
  value: number;
  minOrderAmount: number | null;
  maxUses: number | null;
  usedCount: number;
  usesPerCustomer: number | null;
  startsAt: string | null;
  endsAt: string | null;
  active: boolean;
}

// Pagination Types
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: Pagination;
}

// Checkout Types
export interface CheckoutFormData {
  email: string;
  phone?: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    company?: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
  };
  paymentInfo: {
    cardNumber: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
    cardholderName: string;
  };
  discountCode?: string;
  customerNotes?: string;
  saveAddress?: boolean;
  createAccount?: boolean;
  password?: string;
}

// Store Settings
export interface StoreSettings {
  id: string;
  name: string;
  description: string | null;
  logo: string | null;
  favicon: string | null;
  primaryColor: string;
  secondaryColor: string;
  currency: string;
  currencySymbol: string;
  defaultTaxRate: number;
  shippingRate: number;
  freeShippingThreshold: number | null;
  email: string | null;
  phone: string | null;
  address: string | null;
}