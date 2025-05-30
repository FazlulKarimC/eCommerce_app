import { NextResponse } from 'next/server';
import { Product } from '@/lib/types';
import api from '@/lib/axios';

// Mock product data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    description: 'High-quality wireless headphones with active noise cancellation, premium sound quality, and 30-hour battery life. Perfect for music lovers and professionals who demand the best audio experience.',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center',
    variants: {
      colors: ['Black', 'White', 'Silver', 'Blue'],
      sizes: ['One Size']
    },
    inventory: 50
  }
];

export async function GET() {
  try {
    // Simulate API delay
    const response = await api.get('/api/products'); 
    
    return NextResponse.json({
      success: true,
      data: response
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
