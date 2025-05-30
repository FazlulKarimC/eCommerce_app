import { NextRequest, NextResponse } from 'next/server';
import { Order, TransactionStatus } from '@/lib/types';
import { checkoutFormSchema, productSelectionSchema } from '@/lib/validations';

// Mock orders storage (in a real app, this would be a database)
let mockOrders: Order[] = [];

function generateOrderNumber(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${timestamp}-${random}`;
}

function simulateTransaction(cardNumber: string): TransactionStatus {
  const lastDigit = cardNumber.slice(-1);
  
  switch (lastDigit) {
    case '1':
      return 'approved';
    case '2':
      return 'declined';
    case '3':
      return 'error';
    default:
      return 'approved'; // Default to approved for other cases
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const customerAndPayment = checkoutFormSchema.parse(body.customerInfo);
    const productSelection = productSelectionSchema.parse(body.productSelection);
    
    // Simulate transaction processing
    const transactionStatus = simulateTransaction(customerAndPayment.cardNumber);
    
    // Calculate total
    const total = productSelection.quantity * body.productSelection.price;
    
    // Create order
    const order: Order = {
      id: Math.random().toString(36).substr(2, 9),
      orderNumber: generateOrderNumber(),
      customerInfo: {
        fullName: customerAndPayment.fullName,
        email: customerAndPayment.email,
        phone: customerAndPayment.phone,
        address: customerAndPayment.address,
        city: customerAndPayment.city,
        state: customerAndPayment.state,
        zipCode: customerAndPayment.zipCode,
      },
      productDetails: {
        productId: productSelection.productId,
        productName: body.productSelection.productName,
        selectedColor: productSelection.selectedColor,
        selectedSize: productSelection.selectedSize,
        quantity: productSelection.quantity,
        price: body.productSelection.price,
      },
      paymentInfo: {
        cardNumber: customerAndPayment.cardNumber.replace(/\d(?=\d{4})/g, '*'), // Mask card number
        expiryDate: customerAndPayment.expiryDate,
        cvv: '***', // Mask CVV
      },
      transactionStatus,
      total,
      createdAt: new Date().toISOString(),
    };
    
    // Store order
    mockOrders.push(order);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return NextResponse.json({
      success: true,
      data: {
        orderNumber: order.orderNumber,
        transactionStatus: order.transactionStatus,
        total: order.total
      }
    });
    
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get('orderNumber');
    
    if (!orderNumber) {
      return NextResponse.json(
        { success: false, error: 'Order number is required' },
        { status: 400 }
      );
    }
    
    const order = mockOrders.find(o => o.orderNumber === orderNumber);
    
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: order
    });
    
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}
