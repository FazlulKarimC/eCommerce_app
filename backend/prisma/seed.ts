import { PrismaClient, UserRole, ProductStatus, DiscountType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ==================== UNSPLASH IMAGE URLS ====================
const images = {
    // Men's T-Shirts
    mensTshirt1: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
    mensTshirt2: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800',
    mensTshirt3: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800',
    // Men's Hoodies
    mensHoodie1: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800',
    mensHoodie2: 'https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=800',
    // Men's Pants
    mensPants1: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800',
    mensPants2: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800',
    // Men's Shirts
    mensShirt1: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800',
    mensShirt2: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3c0e?w=800',
    // Men's Jackets
    mensJacket1: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
    mensJacket2: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800',
    // Women's T-Shirts
    womensTshirt1: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800',
    womensTshirt2: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800',
    // Women's Dresses
    womensDress1: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800',
    womensDress2: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800',
    // Women's Tops
    womensTop1: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800',
    womensTop2: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800',
    // Women's Jackets
    womensJacket1: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=800',
    womensJacket2: 'https://images.unsplash.com/photo-1544642899-f0d6e5f6ed6f?w=800',
    // Women's Skirts
    womensSkirt1: 'https://images.unsplash.com/photo-1583496661160-fb5886a0uj5q?w=800',
    womensSkirt2: 'https://images.unsplash.com/photo-1592301933927-35b597393c0a?w=800',
    // Bags
    bag1: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800',
    bag2: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
    bag3: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800',
    // Hats
    hat1: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800',
    hat2: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800',
    // Sunglasses
    sunglasses1: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800',
    sunglasses2: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800',
    // Belts
    belt1: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800',
    // Watches
    watch1: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800',
    watch2: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800',
    // Sneakers
    sneaker1: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
    sneaker2: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800',
    sneaker3: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800',
    // Boots
    boots1: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800',
    boots2: 'https://images.unsplash.com/photo-1605812860427-4024433a70fd?w=800',
    // Sandals
    sandals1: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=800',
    // Activewear
    gymWear1: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
    gymWear2: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800',
    yoga1: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800',
    yoga2: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=800',
    running1: 'https://images.unsplash.com/photo-1539794830467-1f1755804d13?w=800',
    // Jewelry
    necklace1: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800',
    necklace2: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
    bracelet1: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800',
    bracelet2: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800',
    ring1: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800',
    // Collections
    newArrivals: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
    bestSellers: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800',
    sale: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800',
    sustainable: 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=800',
};

// ==================== REVIEWER NAMES ====================
const reviewerNames = [
    'Alex Johnson', 'Sarah Miller', 'Michael Chen', 'Emily Davis', 'James Wilson',
    'Olivia Brown', 'William Taylor', 'Sophia Anderson', 'David Martinez', 'Emma Garcia',
    'Daniel Lee', 'Ava Rodriguez', 'Matthew Harris', 'Isabella Clark', 'Christopher Lewis',
    'Mia Walker', 'Andrew Hall', 'Charlotte Young', 'Joshua Allen', 'Amelia King',
];

// ==================== REVIEW TEMPLATES ====================
const reviewTemplates = [
    { rating: 5, title: 'Absolutely love it!', content: 'This exceeded all my expectations. The quality is outstanding and it fits perfectly. Will definitely buy more!' },
    { rating: 5, title: 'Perfect purchase', content: 'Exactly what I was looking for. Great quality, fast shipping, and looks even better in person.' },
    { rating: 5, title: 'Highly recommend', content: 'Best purchase I\'ve made in a while. The attention to detail is impressive.' },
    { rating: 4, title: 'Very satisfied', content: 'Great product overall. Minor issue with sizing but customer service was helpful.' },
    { rating: 4, title: 'Good quality', content: 'Nice material and well-made. Shipping took a bit longer than expected but worth the wait.' },
    { rating: 4, title: 'Would buy again', content: 'Happy with my purchase. Color is slightly different from photos but still looks great.' },
    { rating: 4, title: 'Solid choice', content: 'Good value for money. Comfortable and stylish. Minor stitching issue but nothing major.' },
    { rating: 3, title: 'It\'s okay', content: 'Product is decent but not as described. Runs a bit small, recommend sizing up.' },
    { rating: 3, title: 'Average', content: 'Quality is acceptable for the price. Nothing special but does the job.' },
    { rating: 5, title: 'Amazing quality!', content: 'The craftsmanship is exceptional. You can tell this is made with care.' },
];

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
    await prisma.metafield.deleteMany();
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

    // ==================== STORE SETTINGS ====================
    console.log('Creating store settings...');
    await prisma.storeSettings.create({
        data: {
            id: 'default',
            name: 'BRUTALIST STORE',
            description: 'Modern fashion with an edge',
            primaryColor: '#FF3333',
            secondaryColor: '#FACC15',
            currency: 'USD',
            currencySymbol: '$',
            defaultTaxRate: 8.5,
            shippingRate: 9.99,
            freeShippingThreshold: 75,
            email: 'hello@brutaliststore.com',
            phone: '+1 (555) 123-4567',
        },
    });

    // ==================== POLICY PAGES ====================
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

    // ==================== USERS ====================
    console.log('Creating users...');
    const adminPassword = await bcrypt.hash('Admin123!', 12);
    const admin = await prisma.user.create({
        data: {
            email: 'admin@brutal.com',
            passwordHash: adminPassword,
            name: 'Admin User',
            role: UserRole.ADMIN,
            emailVerified: true,
        },
    });
    await prisma.account.create({
        data: {
            userId: admin.id,
            accountId: admin.id,
            providerId: 'credential',
            password: adminPassword,
        },
    });

    const staffPassword = await bcrypt.hash('Staff123!', 12);
    const staff = await prisma.user.create({
        data: {
            email: 'staff@brutal.com',
            passwordHash: staffPassword,
            name: 'Staff User',
            role: UserRole.STAFF,
            emailVerified: true,
        },
    });
    await prisma.account.create({
        data: {
            userId: staff.id,
            accountId: staff.id,
            providerId: 'credential',
            password: staffPassword,
        },
    });

    const customerPassword = await bcrypt.hash('Customer123!', 12);
    const customerUser = await prisma.user.create({
        data: {
            email: 'customer@brutal.com',
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
    await prisma.account.create({
        data: {
            userId: customerUser.id,
            accountId: customerUser.id,
            providerId: 'credential',
            password: customerPassword,
        },
    });

    // ==================== CATEGORIES ====================
    console.log('Creating categories...');

    // Parent categories
    const menCategory = await prisma.category.create({
        data: { name: 'Men', slug: 'men', description: 'Men\'s clothing and accessories', position: 0 },
    });
    const womenCategory = await prisma.category.create({
        data: { name: 'Women', slug: 'women', description: 'Women\'s clothing and accessories', position: 1 },
    });
    const accessoriesCategory = await prisma.category.create({
        data: { name: 'Accessories', slug: 'accessories', description: 'Bags, hats, and more', position: 2 },
    });
    const footwearCategory = await prisma.category.create({
        data: { name: 'Footwear', slug: 'footwear', description: 'Shoes, sneakers, and boots', position: 3 },
    });
    const activewearCategory = await prisma.category.create({
        data: { name: 'Activewear', slug: 'activewear', description: 'Sports and workout clothing', position: 4 },
    });
    const jewelryCategory = await prisma.category.create({
        data: { name: 'Jewelry', slug: 'jewelry', description: 'Necklaces, bracelets, and rings', position: 5 },
    });

    // Subcategories
    const subcategories = await prisma.category.createMany({
        data: [
            // Men's subcategories
            { name: 'T-Shirts', slug: 'mens-tshirts', parentId: menCategory.id, position: 0 },
            { name: 'Hoodies', slug: 'mens-hoodies', parentId: menCategory.id, position: 1 },
            { name: 'Pants', slug: 'mens-pants', parentId: menCategory.id, position: 2 },
            { name: 'Shirts', slug: 'mens-shirts', parentId: menCategory.id, position: 3 },
            { name: 'Jackets', slug: 'mens-jackets', parentId: menCategory.id, position: 4 },
            // Women's subcategories
            { name: 'T-Shirts', slug: 'womens-tshirts', parentId: womenCategory.id, position: 0 },
            { name: 'Dresses', slug: 'womens-dresses', parentId: womenCategory.id, position: 1 },
            { name: 'Tops', slug: 'womens-tops', parentId: womenCategory.id, position: 2 },
            { name: 'Jackets', slug: 'womens-jackets', parentId: womenCategory.id, position: 3 },
            { name: 'Skirts', slug: 'womens-skirts', parentId: womenCategory.id, position: 4 },
            // Accessories subcategories
            { name: 'Bags', slug: 'bags', parentId: accessoriesCategory.id, position: 0 },
            { name: 'Hats', slug: 'hats', parentId: accessoriesCategory.id, position: 1 },
            { name: 'Sunglasses', slug: 'sunglasses', parentId: accessoriesCategory.id, position: 2 },
            { name: 'Belts', slug: 'belts', parentId: accessoriesCategory.id, position: 3 },
            { name: 'Watches', slug: 'watches', parentId: accessoriesCategory.id, position: 4 },
            // Footwear subcategories
            { name: 'Sneakers', slug: 'sneakers', parentId: footwearCategory.id, position: 0 },
            { name: 'Boots', slug: 'boots', parentId: footwearCategory.id, position: 1 },
            { name: 'Sandals', slug: 'sandals', parentId: footwearCategory.id, position: 2 },
            // Activewear subcategories
            { name: 'Gym Wear', slug: 'gym-wear', parentId: activewearCategory.id, position: 0 },
            { name: 'Yoga', slug: 'yoga', parentId: activewearCategory.id, position: 1 },
            { name: 'Running', slug: 'running', parentId: activewearCategory.id, position: 2 },
            // Jewelry subcategories
            { name: 'Necklaces', slug: 'necklaces', parentId: jewelryCategory.id, position: 0 },
            { name: 'Bracelets', slug: 'bracelets', parentId: jewelryCategory.id, position: 1 },
            { name: 'Rings', slug: 'rings', parentId: jewelryCategory.id, position: 2 },
        ],
    });

    // ==================== TAGS ====================
    console.log('Creating tags...');
    const tags = await Promise.all([
        prisma.tag.create({ data: { name: 'New Arrival' } }),
        prisma.tag.create({ data: { name: 'Best Seller' } }),
        prisma.tag.create({ data: { name: 'Sale' } }),
        prisma.tag.create({ data: { name: 'Organic' } }),
        prisma.tag.create({ data: { name: 'Sustainable' } }),
        prisma.tag.create({ data: { name: 'Limited Edition' } }),
        prisma.tag.create({ data: { name: 'Premium' } }),
    ]);

    // ==================== COLLECTIONS ====================
    console.log('Creating collections...');
    const newArrivalsCollection = await prisma.collection.create({
        data: {
            title: 'New Arrivals',
            slug: 'new-arrivals',
            description: 'Fresh drops for the bold',
            featured: true,
            publishedAt: new Date(),
            image: images.newArrivals,
        },
    });

    const bestSellersCollection = await prisma.collection.create({
        data: {
            title: 'Best Sellers',
            slug: 'best-sellers',
            description: 'Our most popular pieces',
            featured: true,
            publishedAt: new Date(),
            image: images.bestSellers,
        },
    });

    const saleCollection = await prisma.collection.create({
        data: {
            title: 'Sale',
            slug: 'sale',
            description: 'Up to 50% off selected items',
            featured: true,
            publishedAt: new Date(),
            image: images.sale,
        },
    });

    const sustainableCollection = await prisma.collection.create({
        data: {
            title: 'Sustainable Edit',
            slug: 'sustainable',
            description: 'Fashion that cares for the planet',
            featured: false,
            publishedAt: new Date(),
            image: images.sustainable,
        },
    });

    // ==================== PRODUCTS ====================
    console.log('Creating products...');

    const productsData = [
        // ===== MEN'S PRODUCTS =====
        {
            title: 'Bold Statement Tee',
            slug: 'bold-statement-tee',
            description: 'Make a statement with this oversized organic cotton t-shirt. Featuring our signature bold graphics and comfortable relaxed fit. Perfect for everyday wear.',
            shortDescription: 'Oversized organic cotton tee',
            status: ProductStatus.ACTIVE,
            featured: true,
            vendor: 'Brutalist Originals',
            productType: 'T-Shirt',
            images: [images.mensTshirt1, images.mensTshirt2],
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
            title: 'Classic Crew Tee',
            slug: 'classic-crew-tee',
            description: 'A timeless classic that never goes out of style. Soft cotton blend with a relaxed fit for all-day comfort.',
            shortDescription: 'Essential cotton crew neck',
            status: ProductStatus.ACTIVE,
            featured: false,
            vendor: 'Brutalist Basics',
            productType: 'T-Shirt',
            images: [images.mensTshirt3, images.mensTshirt1],
            options: [
                { name: 'Color', values: ['Navy', 'Gray', 'Black', 'White'] },
                { name: 'Size', values: ['S', 'M', 'L', 'XL'] },
            ],
            basePrice: 35.99,
            categoryId: menCategory.id,
            tags: [tags[1].id],
            collections: [bestSellersCollection.id],
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
            images: [images.mensHoodie1, images.mensHoodie2],
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
            title: 'Slim Fit Chinos',
            slug: 'slim-fit-chinos',
            description: 'Modern slim fit chinos crafted from premium stretch cotton. Perfect for both casual and smart-casual occasions.',
            shortDescription: 'Premium stretch cotton chinos',
            status: ProductStatus.ACTIVE,
            featured: false,
            vendor: 'Brutalist Essentials',
            productType: 'Pants',
            images: [images.mensPants1, images.mensPants2],
            options: [
                { name: 'Color', values: ['Khaki', 'Navy', 'Black', 'Olive'] },
                { name: 'Size', values: ['30', '32', '34', '36', '38'] },
            ],
            basePrice: 79.99,
            categoryId: menCategory.id,
            tags: [tags[6].id],
            collections: [bestSellersCollection.id],
        },
        {
            title: 'Oxford Button-Down',
            slug: 'oxford-button-down',
            description: 'Classic oxford shirt with a modern fit. Perfect for the office or a night out. Made from breathable cotton.',
            shortDescription: 'Classic modern oxford shirt',
            status: ProductStatus.ACTIVE,
            featured: false,
            vendor: 'Brutalist Essentials',
            productType: 'Shirt',
            images: [images.mensShirt1, images.mensShirt2],
            options: [
                { name: 'Color', values: ['White', 'Light Blue', 'Pink'] },
                { name: 'Size', values: ['S', 'M', 'L', 'XL'] },
            ],
            basePrice: 69.99,
            categoryId: menCategory.id,
            tags: [tags[6].id],
            collections: [],
        },
        {
            title: 'Leather Bomber Jacket',
            slug: 'leather-bomber-jacket',
            description: 'Premium genuine leather bomber jacket with satin lining. A timeless piece that gets better with age.',
            shortDescription: 'Genuine leather bomber',
            status: ProductStatus.ACTIVE,
            featured: true,
            vendor: 'Brutalist Premium',
            productType: 'Jacket',
            images: [images.mensJacket1, images.mensJacket2],
            options: [
                { name: 'Color', values: ['Black', 'Brown'] },
                { name: 'Size', values: ['S', 'M', 'L', 'XL'] },
            ],
            basePrice: 299.99,
            compareAtPrice: 399.99,
            categoryId: menCategory.id,
            tags: [tags[2].id, tags[5].id, tags[6].id],
            collections: [saleCollection.id],
        },

        // ===== WOMEN'S PRODUCTS =====
        {
            title: 'Minimal Crop Top',
            slug: 'minimal-crop-top',
            description: 'Clean lines meet comfort in this essential crop top. Made from soft organic cotton with a flattering cropped silhouette.',
            shortDescription: 'Organic cotton crop top',
            status: ProductStatus.ACTIVE,
            featured: true,
            vendor: 'Brutalist Originals',
            productType: 'Top',
            images: [images.womensTshirt1, images.womensTshirt2],
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
            title: 'Everyday Basic Tee',
            slug: 'everyday-basic-tee',
            description: 'Your go-to everyday tee. Soft, breathable, and perfectly fitted. A wardrobe essential.',
            shortDescription: 'Essential fitted cotton tee',
            status: ProductStatus.ACTIVE,
            featured: false,
            vendor: 'Brutalist Basics',
            productType: 'T-Shirt',
            images: [images.womensTshirt2, images.womensTshirt1],
            options: [
                { name: 'Color', values: ['White', 'Black', 'Blush', 'Gray'] },
                { name: 'Size', values: ['XS', 'S', 'M', 'L', 'XL'] },
            ],
            basePrice: 29.99,
            categoryId: womenCategory.id,
            tags: [tags[1].id],
            collections: [bestSellersCollection.id],
        },
        {
            title: 'Flowy Midi Dress',
            slug: 'flowy-midi-dress',
            description: 'Elegant midi dress with a flattering A-line silhouette. Perfect for any occasion from brunch to evening events.',
            shortDescription: 'Elegant A-line midi dress',
            status: ProductStatus.ACTIVE,
            featured: true,
            vendor: 'Brutalist Originals',
            productType: 'Dress',
            images: [images.womensDress1, images.womensDress2],
            options: [
                { name: 'Color', values: ['Black', 'Navy', 'Burgundy', 'Emerald'] },
                { name: 'Size', values: ['XS', 'S', 'M', 'L'] },
            ],
            basePrice: 89.99,
            categoryId: womenCategory.id,
            tags: [tags[0].id, tags[6].id],
            collections: [newArrivalsCollection.id],
        },
        {
            title: 'Silk Blouse',
            slug: 'silk-blouse',
            description: 'Luxurious silk blouse with a relaxed fit. Effortlessly elegant for both work and weekend.',
            shortDescription: 'Luxurious relaxed silk blouse',
            status: ProductStatus.ACTIVE,
            featured: false,
            vendor: 'Brutalist Premium',
            productType: 'Top',
            images: [images.womensTop1, images.womensTop2],
            options: [
                { name: 'Color', values: ['Ivory', 'Blush', 'Black'] },
                { name: 'Size', values: ['XS', 'S', 'M', 'L'] },
            ],
            basePrice: 119.99,
            categoryId: womenCategory.id,
            tags: [tags[6].id],
            collections: [],
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
            images: [images.womensJacket1, images.womensJacket2],
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
            title: 'Pleated Midi Skirt',
            slug: 'pleated-midi-skirt',
            description: 'Elegant pleated midi skirt with elastic waistband. Flows beautifully and pairs with everything.',
            shortDescription: 'Elegant pleated midi skirt',
            status: ProductStatus.ACTIVE,
            featured: false,
            vendor: 'Brutalist Originals',
            productType: 'Skirt',
            images: [images.womensSkirt1, images.womensSkirt2],
            options: [
                { name: 'Color', values: ['Black', 'Cream', 'Forest Green'] },
                { name: 'Size', values: ['XS', 'S', 'M', 'L'] },
            ],
            basePrice: 69.99,
            categoryId: womenCategory.id,
            tags: [tags[0].id],
            collections: [newArrivalsCollection.id],
        },

        // ===== ACCESSORIES =====
        {
            title: 'Canvas Tote Bag',
            slug: 'canvas-tote-bag',
            description: 'Durable canvas tote with bold graphics. Perfect for everyday carry. Features interior pocket and reinforced handles.',
            shortDescription: 'Durable canvas tote',
            status: ProductStatus.ACTIVE,
            featured: false,
            vendor: 'Brutalist Accessories',
            productType: 'Bag',
            images: [images.bag1, images.bag2],
            options: [
                { name: 'Color', values: ['Natural', 'Black'] },
            ],
            basePrice: 34.99,
            categoryId: accessoriesCategory.id,
            tags: [tags[4].id],
            collections: [sustainableCollection.id],
        },
        {
            title: 'Leather Crossbody Bag',
            slug: 'leather-crossbody-bag',
            description: 'Compact leather crossbody bag with adjustable strap. Features multiple compartments for organization.',
            shortDescription: 'Compact leather crossbody',
            status: ProductStatus.ACTIVE,
            featured: true,
            vendor: 'Brutalist Accessories',
            productType: 'Bag',
            images: [images.bag3, images.bag2],
            options: [
                { name: 'Color', values: ['Black', 'Tan', 'Burgundy'] },
            ],
            basePrice: 89.99,
            categoryId: accessoriesCategory.id,
            tags: [tags[0].id, tags[6].id],
            collections: [newArrivalsCollection.id],
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
            images: [images.hat1, images.hat2],
            options: [
                { name: 'Color', values: ['Black', 'White', 'Tan'] },
                { name: 'Size', values: ['S/M', 'L/XL'] },
            ],
            basePrice: 29.99,
            categoryId: accessoriesCategory.id,
            tags: [tags[0].id],
            collections: [newArrivalsCollection.id],
        },
        {
            title: 'Retro Sunglasses',
            slug: 'retro-sunglasses',
            description: 'Bold retro-style sunglasses with UV400 protection. Acetate frame with polarized lenses.',
            shortDescription: 'Bold retro acetate frames',
            status: ProductStatus.ACTIVE,
            featured: false,
            vendor: 'Brutalist Accessories',
            productType: 'Sunglasses',
            images: [images.sunglasses1, images.sunglasses2],
            options: [
                { name: 'Color', values: ['Black', 'Tortoise', 'Clear'] },
            ],
            basePrice: 59.99,
            categoryId: accessoriesCategory.id,
            tags: [tags[1].id],
            collections: [bestSellersCollection.id],
        },
        {
            title: 'Leather Belt',
            slug: 'leather-belt',
            description: 'Classic leather belt with brushed metal buckle. Full grain leather that ages beautifully.',
            shortDescription: 'Classic full grain leather belt',
            status: ProductStatus.ACTIVE,
            featured: false,
            vendor: 'Brutalist Accessories',
            productType: 'Belt',
            images: [images.belt1],
            options: [
                { name: 'Color', values: ['Black', 'Brown'] },
                { name: 'Size', values: ['S', 'M', 'L', 'XL'] },
            ],
            basePrice: 49.99,
            categoryId: accessoriesCategory.id,
            tags: [tags[6].id],
            collections: [],
        },
        {
            title: 'Minimalist Watch',
            slug: 'minimalist-watch',
            description: 'Clean, minimalist watch with Japanese quartz movement. Stainless steel case with genuine leather strap.',
            shortDescription: 'Japanese quartz minimalist watch',
            status: ProductStatus.ACTIVE,
            featured: true,
            vendor: 'Brutalist Premium',
            productType: 'Watch',
            images: [images.watch1, images.watch2],
            options: [
                { name: 'Color', values: ['Black/Silver', 'Brown/Gold', 'Black/Rose Gold'] },
            ],
            basePrice: 149.99,
            categoryId: accessoriesCategory.id,
            tags: [tags[5].id, tags[6].id],
            collections: [],
        },

        // ===== FOOTWEAR =====
        {
            title: 'Classic Sneakers',
            slug: 'classic-sneakers',
            description: 'Timeless low-top sneakers with premium leather upper. EVA midsole for all-day comfort.',
            shortDescription: 'Premium leather low-tops',
            status: ProductStatus.ACTIVE,
            featured: true,
            vendor: 'Brutalist Footwear',
            productType: 'Sneakers',
            images: [images.sneaker1, images.sneaker2],
            options: [
                { name: 'Color', values: ['White', 'Black', 'Navy'] },
                { name: 'Size', values: ['7', '8', '9', '10', '11', '12'] },
            ],
            basePrice: 119.99,
            categoryId: footwearCategory.id,
            tags: [tags[1].id, tags[6].id],
            collections: [bestSellersCollection.id],
        },
        {
            title: 'Running Sneakers',
            slug: 'running-sneakers',
            description: 'Lightweight running sneakers with responsive cushioning. Breathable mesh upper with reflective details.',
            shortDescription: 'Lightweight performance runners',
            status: ProductStatus.ACTIVE,
            featured: false,
            vendor: 'Brutalist Active',
            productType: 'Sneakers',
            images: [images.sneaker3, images.sneaker2],
            options: [
                { name: 'Color', values: ['Black/White', 'Gray/Orange', 'Navy/Red'] },
                { name: 'Size', values: ['7', '8', '9', '10', '11', '12'] },
            ],
            basePrice: 139.99,
            compareAtPrice: 169.99,
            categoryId: footwearCategory.id,
            tags: [tags[2].id],
            collections: [saleCollection.id],
        },
        {
            title: 'Chelsea Boots',
            slug: 'chelsea-boots',
            description: 'Classic Chelsea boots with elastic side panels. Premium suede upper with durable rubber sole.',
            shortDescription: 'Classic suede Chelsea boots',
            status: ProductStatus.ACTIVE,
            featured: true,
            vendor: 'Brutalist Footwear',
            productType: 'Boots',
            images: [images.boots1, images.boots2],
            options: [
                { name: 'Color', values: ['Black', 'Tan', 'Gray'] },
                { name: 'Size', values: ['7', '8', '9', '10', '11', '12'] },
            ],
            basePrice: 179.99,
            categoryId: footwearCategory.id,
            tags: [tags[0].id, tags[6].id],
            collections: [newArrivalsCollection.id],
        },
        {
            title: 'Leather Sandals',
            slug: 'leather-sandals',
            description: 'Comfortable leather sandals with cushioned footbed. Perfect for summer days and casual outings.',
            shortDescription: 'Comfortable leather sandals',
            status: ProductStatus.ACTIVE,
            featured: false,
            vendor: 'Brutalist Footwear',
            productType: 'Sandals',
            images: [images.sandals1],
            options: [
                { name: 'Color', values: ['Tan', 'Black'] },
                { name: 'Size', values: ['7', '8', '9', '10', '11', '12'] },
            ],
            basePrice: 69.99,
            categoryId: footwearCategory.id,
            tags: [],
            collections: [],
        },

        // ===== ACTIVEWEAR =====
        {
            title: 'Performance Tank',
            slug: 'performance-tank',
            description: 'High-performance tank top with moisture-wicking fabric. Designed for intense workouts.',
            shortDescription: 'Moisture-wicking gym tank',
            status: ProductStatus.ACTIVE,
            featured: false,
            vendor: 'Brutalist Active',
            productType: 'Gym Wear',
            images: [images.gymWear1, images.gymWear2],
            options: [
                { name: 'Color', values: ['Black', 'White', 'Navy', 'Red'] },
                { name: 'Size', values: ['S', 'M', 'L', 'XL'] },
            ],
            basePrice: 34.99,
            categoryId: activewearCategory.id,
            tags: [tags[0].id],
            collections: [newArrivalsCollection.id],
        },
        {
            title: 'Yoga Leggings',
            slug: 'yoga-leggings',
            description: 'Ultra-soft yoga leggings with four-way stretch. High waist design for support and flattering fit.',
            shortDescription: 'Four-way stretch yoga leggings',
            status: ProductStatus.ACTIVE,
            featured: true,
            vendor: 'Brutalist Active',
            productType: 'Yoga',
            images: [images.yoga1, images.yoga2],
            options: [
                { name: 'Color', values: ['Black', 'Sage', 'Dusty Rose', 'Navy'] },
                { name: 'Size', values: ['XS', 'S', 'M', 'L', 'XL'] },
            ],
            basePrice: 64.99,
            categoryId: activewearCategory.id,
            tags: [tags[1].id, tags[4].id],
            collections: [bestSellersCollection.id, sustainableCollection.id],
        },
        {
            title: 'Running Shorts',
            slug: 'running-shorts',
            description: 'Lightweight running shorts with built-in liner. Quick-dry fabric with side pockets.',
            shortDescription: 'Lightweight quick-dry shorts',
            status: ProductStatus.ACTIVE,
            featured: false,
            vendor: 'Brutalist Active',
            productType: 'Running',
            images: [images.running1, images.gymWear1],
            options: [
                { name: 'Color', values: ['Black', 'Gray', 'Blue'] },
                { name: 'Size', values: ['S', 'M', 'L', 'XL'] },
            ],
            basePrice: 44.99,
            categoryId: activewearCategory.id,
            tags: [],
            collections: [],
        },

        // ===== JEWELRY =====
        {
            title: 'Layered Gold Necklace',
            slug: 'layered-gold-necklace',
            description: 'Delicate layered necklace with 18k gold plating. Features two chains with minimalist pendants.',
            shortDescription: '18k gold plated layered necklace',
            status: ProductStatus.ACTIVE,
            featured: true,
            vendor: 'Brutalist Jewelry',
            productType: 'Necklace',
            images: [images.necklace1, images.necklace2],
            options: [
                { name: 'Material', values: ['Gold', 'Silver', 'Rose Gold'] },
            ],
            basePrice: 49.99,
            categoryId: jewelryCategory.id,
            tags: [tags[0].id, tags[5].id],
            collections: [newArrivalsCollection.id],
        },
        {
            title: 'Chain Link Bracelet',
            slug: 'chain-link-bracelet',
            description: 'Bold chain link bracelet with toggle clasp. Stainless steel with polished finish.',
            shortDescription: 'Bold stainless steel chain bracelet',
            status: ProductStatus.ACTIVE,
            featured: false,
            vendor: 'Brutalist Jewelry',
            productType: 'Bracelet',
            images: [images.bracelet1, images.bracelet2],
            options: [
                { name: 'Material', values: ['Silver', 'Gold'] },
                { name: 'Size', values: ['S', 'M', 'L'] },
            ],
            basePrice: 39.99,
            categoryId: jewelryCategory.id,
            tags: [tags[1].id],
            collections: [bestSellersCollection.id],
        },
        {
            title: 'Minimalist Ring Set',
            slug: 'minimalist-ring-set',
            description: 'Set of 5 minimalist stacking rings. Mix of thin bands and textured designs.',
            shortDescription: '5-piece minimalist ring set',
            status: ProductStatus.ACTIVE,
            featured: false,
            vendor: 'Brutalist Jewelry',
            productType: 'Ring',
            images: [images.ring1],
            options: [
                { name: 'Material', values: ['Gold', 'Silver', 'Rose Gold'] },
                { name: 'Size', values: ['5', '6', '7', '8', '9'] },
            ],
            basePrice: 34.99,
            compareAtPrice: 44.99,
            categoryId: jewelryCategory.id,
            tags: [tags[2].id],
            collections: [saleCollection.id],
        },
    ];

    // Create products with variants, options, images
    const createdProducts: { id: string; categoryId: string }[] = [];

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

        createdProducts.push({ id: product.id, categoryId: productData.categoryId });

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
            for (const value of options[0].values) {
                await prisma.productVariant.create({
                    data: {
                        productId: product.id,
                        title: value,
                        sku: `${product.slug}-${value.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-')}`,
                        price: productData.basePrice,
                        compareAtPrice: productData.compareAtPrice,
                        inventoryQty: Math.floor(Math.random() * 50) + 10,
                    },
                });
            }
        } else if (options.length === 2) {
            let position = 0;
            for (const value1 of options[0].values) {
                for (const value2 of options[1].values) {
                    await prisma.productVariant.create({
                        data: {
                            productId: product.id,
                            title: `${value1} / ${value2}`,
                            sku: `${product.slug}-${value1.toLowerCase()}-${value2.toLowerCase()}`.replace(/\s+/g, '-').replace(/\//g, '-'),
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

    console.log(`Created ${createdProducts.length} products`);

    // ==================== REVIEWS ====================
    console.log('Creating reviews...');

    let reviewCount = 0;
    for (const product of createdProducts) {
        // Random number of reviews per product (0-3)
        const numReviews = Math.floor(Math.random() * 4);

        for (let i = 0; i < numReviews; i++) {
            const template = reviewTemplates[Math.floor(Math.random() * reviewTemplates.length)];
            const reviewerName = reviewerNames[Math.floor(Math.random() * reviewerNames.length)];

            // Create a temporary customer for the review
            const reviewerUser = await prisma.user.create({
                data: {
                    email: `reviewer${reviewCount}@example.com`,
                    name: reviewerName,
                    role: UserRole.CUSTOMER,
                    emailVerified: true,
                    customer: {
                        create: {},
                    },
                },
                include: { customer: true },
            });

            if (reviewerUser.customer) {
                await prisma.review.create({
                    data: {
                        productId: product.id,
                        customerId: reviewerUser.customer.id,
                        rating: template.rating,
                        title: template.title,
                        content: template.content,
                        approved: Math.random() > 0.1, // 90% approved
                        helpful: Math.floor(Math.random() * 20),
                    },
                });
                reviewCount++;
            }
        }
    }

    console.log(`Created ${reviewCount} reviews`);

    // ==================== DISCOUNT CODES ====================
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
            {
                code: 'BRUTALIST25',
                title: '25% Off Everything',
                type: DiscountType.PERCENTAGE,
                value: 25,
                maxUses: 100,
                active: true,
            },
        ],
    });

    console.log(`
✅ Database seeded successfully!

Test accounts:
- Admin: admin@brutal.com / Admin123!
- Staff: staff@brutal.com / Staff123!
- Customer: customer@brutal.com / Customer123!

Products: ${createdProducts.length} products created
Reviews: ${reviewCount} reviews created
Categories: 6 parent categories with ${subcategories.count} subcategories

Discount codes:
- WELCOME10 (10% off)
- SAVE20 ($20 off orders over $100)
- FREESHIP (Free shipping on orders over $50)
- BRUTALIST25 (25% off everything, limited to 100 uses)
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
