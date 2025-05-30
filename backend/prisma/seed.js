const { PrismaClient } = require('../src/generated/prisma');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Clear existing data
  await prisma.order.deleteMany({});
  await prisma.customer.deleteMany({});
  await prisma.product.deleteMany({});

  console.log('🧹 Cleared existing data');

  // Create Products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        title: 'Converse Chuck Taylor All Star II Hi',
        description: 'Classic high-top sneakers with modern comfort. Features premium canvas upper, padded collar, and improved traction outsole.',
        price: 89.99,
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop',
        inventory: 50,
        variants: JSON.stringify([
          {
            type: 'color',
            options: ['Black', 'White', 'Red', 'Navy Blue']
          },
          {
            type: 'size',
            options: ['US 6', 'US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12']
          }
        ])
      }
    }),

    prisma.product.create({
      data: {
        title: 'Nike Air Max 270',
        description: 'Lifestyle sneakers featuring the largest Max Air unit yet. Delivers unrivaled, all-day comfort with a bold design.',
        price: 129.99,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
        inventory: 35,
        variants: JSON.stringify([
          {
            type: 'color',
            options: ['Black/White', 'Triple White', 'Grey/Orange', 'Navy/Red']
          },
          {
            type: 'size',
            options: ['US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12']
          }
        ])
      }
    }),

    prisma.product.create({
      data: {
        title: 'Adidas Ultraboost 22',
        description: 'Revolutionary running shoes with responsive BOOST midsole and Primeknit upper for ultimate comfort and performance.',
        price: 159.99,
        image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&h=500&fit=crop',
        inventory: 28,
        variants: JSON.stringify([
          {
            type: 'color',
            options: ['Core Black', 'Cloud White', 'Grey Six', 'Solar Red']
          },
          {
            type: 'size',
            options: ['US 6.5', 'US 7.5', 'US 8.5', 'US 9.5', 'US 10.5', 'US 11.5']
          }
        ])
      }
    }),

    prisma.product.create({
      data: {
        title: 'Classic Denim Jacket',
        description: 'Timeless denim jacket made from premium cotton. Perfect for layering with vintage-inspired styling.',
        price: 79.99,
        image: 'https://images.unsplash.com/photo-1614699745279-2c61bd9d46b5?w=500&h=500&fit=crop',
        inventory: 42,
        variants: JSON.stringify([
          {
            type: 'color',
            options: ['Light Blue', 'Dark Blue', 'Black', 'Light Wash']
          },
          {
            type: 'size',
            options: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
          }
        ])
      }
    }),

    prisma.product.create({
      data: {
        title: 'Premium Wireless Headphones',
        description: 'High-quality over-ear headphones with active noise cancellation, 30-hour battery life, and premium sound quality.',
        price: 249.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
        inventory: 15,
        variants: JSON.stringify([
          {
            type: 'color',
            options: ['Matte Black', 'Silver', 'Rose Gold', 'Midnight Blue']
          },
          {
            type: 'connectivity',
            options: ['Wireless Only', 'Wireless + Wired']
          }
        ])
      }
    })
  ]);

  console.log('✅ Created products');

  // Create Customers
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '+1-555-0101',
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001'
      }
    }),

    prisma.customer.create({
      data: {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        phone: '+1-555-0102',
        address: '456 Oak Avenue',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210'
      }
    }),

    prisma.customer.create({
      data: {
        name: 'Mike Chen',
        email: 'mike.chen@example.com',
        phone: '+1-555-0103',
        address: '789 Pine Road',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601'
      }
    }),

    prisma.customer.create({
      data: {
        name: 'Emily Davis',
        email: 'emily.davis@example.com',
        phone: '+1-555-0104',
        address: '321 Elm Street',
        city: 'Miami',
        state: 'FL',
        zipCode: '33101'
      }
    })
  ]);

  console.log('✅ Created customers');

  // Create Sample Orders
  const orders = await Promise.all([
    // Approved Order
    prisma.order.create({
      data: {
        orderNumber: 'ORD-2025-001',
        status: 'approved',
        customerId: customers[0].id,
        cardNumber: '1',
        productId: products[0].id,
        productTitle: products[0].title,
        selectedVariants: JSON.stringify({
          color: 'Black',
          size: 'US 9'
        }),
        quantity: 1,
        subtotal: 89.99,
        total: 89.99
      }
    }),

    // Declined Order
    prisma.order.create({
      data: {
        orderNumber: 'ORD-2025-002',
        status: 'declined',
        customerId: customers[1].id,
        cardNumber: '2',
        productId: products[1].id,
        productTitle: products[1].title,
        selectedVariants: JSON.stringify({
          color: 'Triple White',
          size: 'US 8'
        }),
        quantity: 2,
        subtotal: 259.98,
        total: 259.98
      }
    }),

    // Failed Order
    prisma.order.create({
      data: {
        orderNumber: 'ORD-2025-003',
        status: 'failed',
        customerId: customers[2].id,
        cardNumber: '3',
        productId: products[2].id,
        productTitle: products[2].title,
        selectedVariants: JSON.stringify({
          color: 'Core Black',
          size: 'US 10.5'
        }),
        quantity: 1,
        subtotal: 159.99,
        total: 159.99
      }
    }),

    // Another Approved Order
    prisma.order.create({
      data: {
        orderNumber: 'ORD-2025-004',
        status: 'approved',
        customerId: customers[3].id,
        cardNumber: '1',
        productId: products[3].id,
        productTitle: products[3].title,
        selectedVariants: JSON.stringify({
          color: 'Light Blue',
          size: 'M'
        }),
        quantity: 1,
        subtotal: 79.99,
        total: 79.99
      }
    })
  ]);

  console.log('✅ Created orders');

  console.log('🎉 Seed completed successfully!');
  console.log(`📊 Created: ${products.length} products, ${customers.length} customers, ${orders.length} orders`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });