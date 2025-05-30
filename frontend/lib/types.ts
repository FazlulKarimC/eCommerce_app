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

export interface Order {
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
