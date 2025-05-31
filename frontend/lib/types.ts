export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  variants: {
    colors: string[];
    sizes: string[];
  };
  inventory: number;
}

export interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface PaymentInfo {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

export interface ProductSelection {
  productId: string;
  productName: string;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
  price: number;
}

export interface CartItem extends ProductSelection {
  id: string; // unique identifier for cart item
  image: string; // product image
  addedAt: string; // timestamp when added to cart
}

export interface OrderItem {
  image: string;
  price: number;
  title: string;
  quantity: number;
  productId: number;
  description: string;
  selectedVariants: {
    size: string;
    color: string;
  };
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  createdAt: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  status: 'approved' | 'declined' | 'error';
  createdAt: string;
  customerId: number;
  cardNumber: string;
  items: OrderItem[];
  subTotal: number;
  total: number;
  customer?: Customer;
}

// Legacy Order interface for backward compatibility
export interface LegacyOrder {
  id: string;
  orderNumber: string;
  customerInfo: CustomerInfo;
  productDetails: ProductSelection;
  paymentInfo: PaymentInfo;
  transactionStatus: 'approved' | 'declined' | 'error';
  total: number;
  createdAt: string;
}

export type TransactionStatus = 'approved' | 'declined' | 'error';