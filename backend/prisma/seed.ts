import { PrismaClient, UserRole, ProductStatus, DiscountType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // Clear existing data
    console.log('Clearing existing data...');
    await prisma.wishlistItem.deleteMany();
    await prisma.review.deleteMany();
    await prisma.fulfillment.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.variantOptionValue.deleteMany();
    await prisma.productOptionValue.deleteMany();
    await prisma.productOption.deleteMany();
    await prisma.productImage.deleteMany();
    await prisma.productVariant.deleteMany();
    await prisma.collectionProduct.deleteMany();
    await prisma.productCategory.deleteMany();
    await prisma.productTag.deleteMany();
    await prisma.product.deleteMany();
    await prisma.collection.deleteMany();
    await prisma.category.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.discountCode.deleteMany();
    await prisma.address.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.verification.deleteMany();
    await prisma.account.deleteMany();
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();
    await prisma.storeSettings.deleteMany();
    await prisma.policyPage.deleteMany();

    // Create store settings
    console.log('Creating store settings...');
    await prisma.storeSettings.create({
        data: {
            id: 'default',
            name: 'BRUTALIST STORE',
            description: 'Modern fashion with an edge',
            primaryColor: '#FF3333',
            secondaryColor: '#FFDD00',
            currency: 'USD',
            currencySymbol: '$',
            defaultTaxRate: 8.5,
            shippingRate: 9.99,
            freeShippingThreshold: 75,
            email: 'hello@brutaliststore.com',
            phone: '+1 (555) 123-4567',
        },
    });

    // Create policy pages
    console.log('Creating policy pages...');
    await prisma.policyPage.createMany({
        data: [
            {
                slug: 'privacy',
                title: 'Privacy Policy',
                content: '# Privacy Policy\n\nYour privacy is important to us. This policy explains how we collect, use, and protect your information.',
            },
            {
                slug: 'terms',
                title: 'Terms of Service',
                content: '# Terms of Service\n\nBy using our website, you agree to these terms and conditions.',
            },
            {
                slug: 'shipping',
                title: 'Shipping & Returns',
                content: '# Shipping & Returns\n\nFree shipping on orders over $75. Returns accepted within 30 days.',
            },
        ],
    });

    // Create admin user
    console.log('Creating admin user...');
    const adminPassword = await bcrypt.hash('Admin123!', 12);
    const admin = await prisma.user.create({
        data: {
            email: 'admin@brutaliststore.com',
            passwordHash: adminPassword,
            name: 'Admin User',
            role: UserRole.ADMIN,
            emailVerified: true,
        },
    });
    // Create Better Auth Account for admin
    await prisma.account.create({
        data: {
            userId: admin.id,
            accountId: admin.id,
            providerId: 'credential',
            password: adminPassword,
        },
    });

    // Create staff user
    const staffPassword = await bcrypt.hash('Staff123!', 12);
    const staff = await prisma.user.create({
        data: {
            email: 'staff@brutaliststore.com',
            passwordHash: staffPassword,
            name: 'Staff User',
            role: UserRole.STAFF,
            emailVerified: true,
        },
    });
    // Create Better Auth Account for staff
    await prisma.account.create({
        data: {
            userId: staff.id,
            accountId: staff.id,
            providerId: 'credential',
            password: staffPassword,
        },
    });

    // Create customer user
    const customerPassword = await bcrypt.hash('Customer123!', 12);
    const customerUser = await prisma.user.create({
        data: {
            email: 'customer@example.com',
            passwordHash: customerPassword,
            name: 'Jane Doe',
            role: UserRole.CUSTOMER,
            emailVerified: true,
            customer: {
                create: {
                    phone: '+1 (555) 987-6543',
                    addresses: {
                        create: {
                            label: 'Home',
                            firstName: 'Jane',
                            lastName: 'Doe',
                            line1: '123 Main Street',
                            line2: 'Apt 4B',
                            city: 'New York',
                            state: 'NY',
                            postalCode: '10001',
                            country: 'US',
                            phone: '+1 (555) 987-6543',
                            isDefault: true,
                        },
                    },
                },
            },
        },
        include: { customer: true },
    });
    // Create Better Auth Account for customer
    await prisma.account.create({
        data: {
            userId: customerUser.id,
            accountId: customerUser.id,
            providerId: 'credential',
            password: customerPassword,
        },
    });

    // Create categories
    console.log('Creating categories...');
    const menCategory = await prisma.category.create({
        data: {
            name: 'Men',
            slug: 'men',
            description: 'Mens clothing and accessories',
            position: 0,
        },
    });

    const womenCategory = await prisma.category.create({
        data: {
            name: 'Women',
            slug: 'women',
            description: 'Womens clothing and accessories',
            position: 1,
        },
    });

    const accessoriesCategory = await prisma.category.create({
        data: {
            name: 'Accessories',
            slug: 'accessories',
            description: 'Bags, hats, and more',
            position: 2,
        },
    });

    // Create subcategories
    await prisma.category.createMany({
        data: [
            { name: 'T-Shirts', slug: 'mens-tshirts', parentId: menCategory.id, position: 0 },
            { name: 'Hoodies', slug: 'mens-hoodies', parentId: menCategory.id, position: 1 },
            { name: 'Pants', slug: 'mens-pants', parentId: menCategory.id, position: 2 },
            { name: 'T-Shirts', slug: 'womens-tshirts', parentId: womenCategory.id, position: 0 },
            { name: 'Dresses', slug: 'womens-dresses', parentId: womenCategory.id, position: 1 },
            { name: 'Jackets', slug: 'womens-jackets', parentId: womenCategory.id, position: 2 },
        ],
    });

    // Create tags
    console.log('Creating tags...');
    const tags = await Promise.all([
        prisma.tag.create({ data: { name: 'New Arrival' } }),
        prisma.tag.create({ data: { name: 'Best Seller' } }),
        prisma.tag.create({ data: { name: 'Sale' } }),
        prisma.tag.create({ data: { name: 'Organic' } }),
        prisma.tag.create({ data: { name: 'Sustainable' } }),
    ]);

    // Create collections
    console.log('Creating collections...');
    const newArrivalsCollection = await prisma.collection.create({
        data: {
            title: 'New Arrivals',
            slug: 'new-arrivals',
            description: 'Fresh drops for the bold',
            featured: true,
            publishedAt: new Date(),
            image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
        },
    });

    const bestSellersCollection = await prisma.collection.create({
        data: {
            title: 'Best Sellers',
            slug: 'best-sellers',
            description: 'Our most popular pieces',
            featured: true,
            publishedAt: new Date(),
            image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800',
        },
    });

    const saleCollection = await prisma.collection.create({
        data: {
            title: 'Sale',
            slug: 'sale',
            description: 'Up to 50% off selected items',
            featured: true,
            publishedAt: new Date(),
            image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800',
        },
    });

    const sustainableCollection = await prisma.collection.create({
        data: {
            title: 'Sustainable Edit',
            slug: 'sustainable',
            description: 'Fashion that cares for the planet',
            featured: false,
            publishedAt: new Date(),
            image: 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=800',
        },
    });

    // Create products
    console.log('Creating products...');

    const productsData = [
        {
            title: 'Bold Statement Tee',
            slug: 'bold-statement-tee',
            description: 'Make a statement with this oversized organic cotton t-shirt. Featuring our signature bold graphics and comfortable relaxed fit. Perfect for everyday wear.',
            shortDescription: 'Oversized organic cotton tee',
            status: ProductStatus.ACTIVE,
            featured: true,
            vendor: 'Brutalist Originals',
            productType: 'T-Shirt',
            images: [
                'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
                'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800',
            ],
            options: [
                { name: 'Color', values: ['Black', 'White', 'Red', 'Yellow'] },
                { name: 'Size', values: ['S', 'M', 'L', 'XL', '2XL'] },
            ],
            basePrice: 49.99,
            categoryId: menCategory.id,
            tags: [tags[0].id, tags[1].id],
            collections: [newArrivalsCollection.id, bestSellersCollection.id],
        },
        {
            title: 'Graphic Hoodie',
            slug: 'graphic-hoodie',
            description: 'Premium heavyweight hoodie with bold graphic print. Features a relaxed fit, kangaroo pocket, and brushed fleece interior for ultimate comfort.',
            shortDescription: 'Premium heavyweight hoodie',
            status: ProductStatus.ACTIVE,
            featured: true,
            vendor: 'Brutalist Originals',
            productType: 'Hoodie',
            images: [
                'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800',
                'https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=800',
            ],
            options: [
                { name: 'Color', values: ['Black', 'Gray', 'Navy'] },
                { name: 'Size', values: ['S', 'M', 'L', 'XL'] },
            ],
            basePrice: 89.99,
            compareAtPrice: 120.00,
            categoryId: menCategory.id,
            tags: [tags[1].id, tags[2].id],
            collections: [bestSellersCollection.id, saleCollection.id],
        },
        {
            title: 'Minimal Crop Top',
            slug: 'minimal-crop-top',
            description: 'Clean lines meet comfort in this essential crop top. Made from soft organic cotton with a flattering cropped silhouette.',
            shortDescription: 'Organic cotton crop top',
            status: ProductStatus.ACTIVE,
            featured: true,
            vendor: 'Brutalist Originals',
            productType: 'Top',
            images: [
                'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800',
                'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800',
            ],
            options: [
                { name: 'Color', values: ['White', 'Black', 'Sage'] },
                { name: 'Size', values: ['XS', 'S', 'M', 'L'] },
            ],
            basePrice: 39.99,
            categoryId: womenCategory.id,
            tags: [tags[0].id, tags[3].id, tags[4].id],
            collections: [newArrivalsCollection.id, sustainableCollection.id],
        },
        {
            title: 'Oversized Denim Jacket',
            slug: 'oversized-denim-jacket',
            description: 'Classic denim jacket with an oversized fit. Features distressed details, brass buttons, and multiple pockets.',
            shortDescription: 'Classic oversized denim',
            status: ProductStatus.ACTIVE,
            featured: true,
            vendor: 'Brutalist Denim',
            productType: 'Jacket',
            images: [
                'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=800',
                'https://images.unsplash.com/photo-1544642899-f0d6e5f6ed6f?w=800',
            ],
            options: [
                { name: 'Color', values: ['Light Wash', 'Dark Wash', 'Black'] },
                { name: 'Size', values: ['S', 'M', 'L', 'XL'] },
            ],
            basePrice: 129.99,
            compareAtPrice: 165.00,
            categoryId: womenCategory.id,
            tags: [tags[1].id, tags[2].id],
            collections: [bestSellersCollection.id, saleCollection.id],
        },
        {
            title: 'Canvas Tote Bag',
            slug: 'canvas-tote-bag',
            description: 'Durable canvas tote with bold graphics. Perfect for everyday carry. Features interior pocket and reinforced handles.',
            shortDescription: 'Durable canvas tote',
            status: ProductStatus.ACTIVE,
            featured: false,
            vendor: 'Brutalist Accessories',
            productType: 'Bag',
            images: [
                'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800',
            ],
            options: [
                { name: 'Color', values: ['Natural', 'Black'] },
            ],
            basePrice: 34.99,
            categoryId: accessoriesCategory.id,
            tags: [tags[4].id],
            collections: [sustainableCollection.id],
        },
        {
            title: 'Bucket Hat',
            slug: 'bucket-hat',
            description: 'Retro-inspired bucket hat with modern edge. Made from durable cotton canvas with embroidered logo.',
            shortDescription: 'Retro cotton bucket hat',
            status: ProductStatus.ACTIVE,
            featured: false,
            vendor: 'Brutalist Accessories',
            productType: 'Hat',
            images: [
                'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800',
            ],
            options: [
                { name: 'Color', values: ['Black', 'White', 'Tan'] },
                { name: 'Size', values: ['S/M', 'L/XL'] },
            ],
            basePrice: 29.99,
            categoryId: accessoriesCategory.id,
            tags: [tags[0].id],
            collections: [newArrivalsCollection.id],
        },
    ];

    for (const productData of productsData) {
        // Create product
        const product = await prisma.product.create({
            data: {
                title: productData.title,
                slug: productData.slug,
                description: productData.description,
                shortDescription: productData.shortDescription,
                status: productData.status,
                featured: productData.featured,
                vendor: productData.vendor,
                productType: productData.productType,
                publishedAt: new Date(),
            },
        });

        // Create images
        for (let i = 0; i < productData.images.length; i++) {
            await prisma.productImage.create({
                data: {
                    productId: product.id,
                    url: productData.images[i],
                    alt: `${product.title} - Image ${i + 1}`,
                    position: i,
                },
            });
        }

        // Create options and option values
        const optionValueIds: Record<string, Record<string, string>> = {};

        for (let i = 0; i < productData.options.length; i++) {
            const option = productData.options[i];
            const createdOption = await prisma.productOption.create({
                data: {
                    productId: product.id,
                    name: option.name,
                    position: i,
                },
            });

            optionValueIds[option.name] = {};

            for (let j = 0; j < option.values.length; j++) {
                const createdValue = await prisma.productOptionValue.create({
                    data: {
                        optionId: createdOption.id,
                        value: option.values[j],
                        position: j,
                    },
                });
                optionValueIds[option.name][option.values[j]] = createdValue.id;
            }
        }

        // Create variants for each combination
        const options = productData.options;
        if (options.length === 1) {
            // Single option (e.g., just color)
            for (const value of options[0].values) {
                await prisma.productVariant.create({
                    data: {
                        productId: product.id,
                        title: value,
                        sku: `${product.slug}-${value.toLowerCase().replace(/\s/g, '-')}`,
                        price: productData.basePrice,
                        compareAtPrice: productData.compareAtPrice,
                        inventoryQty: Math.floor(Math.random() * 50) + 10,
                    },
                });
            }
        } else if (options.length === 2) {
            // Two options (e.g., color + size)
            let position = 0;
            for (const value1 of options[0].values) {
                for (const value2 of options[1].values) {
                    await prisma.productVariant.create({
                        data: {
                            productId: product.id,
                            title: `${value1} / ${value2}`,
                            sku: `${product.slug}-${value1.toLowerCase()}-${value2.toLowerCase()}`.replace(/\s/g, '-'),
                            price: productData.basePrice,
                            compareAtPrice: productData.compareAtPrice,
                            inventoryQty: Math.floor(Math.random() * 30) + 5,
                            position: position++,
                        },
                    });
                }
            }
        }

        // Add to category
        await prisma.productCategory.create({
            data: {
                productId: product.id,
                categoryId: productData.categoryId,
            },
        });

        // Add tags
        for (const tagId of productData.tags) {
            await prisma.productTag.create({
                data: {
                    productId: product.id,
                    tagId,
                },
            });
        }

        // Add to collections
        for (const collectionId of productData.collections) {
            await prisma.collectionProduct.create({
                data: {
                    productId: product.id,
                    collectionId,
                },
            });
        }
    }

    // Create discount codes
    console.log('Creating discount codes...');
    await prisma.discountCode.createMany({
        data: [
            {
                code: 'WELCOME10',
                title: 'Welcome Discount',
                type: DiscountType.PERCENTAGE,
                value: 10,
                active: true,
            },
            {
                code: 'SAVE20',
                title: '$20 Off Orders Over $100',
                type: DiscountType.FIXED_AMOUNT,
                value: 20,
                minOrderAmount: 100,
                active: true,
            },
            {
                code: 'FREESHIP',
                title: 'Free Shipping',
                type: DiscountType.FREE_SHIPPING,
                value: 0,
                minOrderAmount: 50,
                active: true,
            },
        ],
    });

    console.log(`
✅ Database seeded successfully!

Test accounts:
- Admin: admin@brutaliststore.com / Admin123!
- Staff: staff@brutaliststore.com / Staff123!
- Customer: customer@example.com / Customer123!

Discount codes:
- WELCOME10 (10% off)
- SAVE20 ($20 off orders over $100)
- FREESHIP (Free shipping on orders over $50)
  `);
}

main()
    .catch((e) => {
        console.error('Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
