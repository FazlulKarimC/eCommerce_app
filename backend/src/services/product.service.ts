import { prisma } from '../config/database';
import { generateSlug, generateUniqueSlug } from '../utils/helpers';
import { CreateProductInput, UpdateProductInput, ProductQueryInput } from '../validators/product.validator';
import { ProductStatus, Prisma } from '@prisma/client';

export class ProductService {
    /**
     * Create a new product with variants and options
     */
    async create(input: CreateProductInput) {
        const slug = input.slug || generateSlug(input.title);

        // Check if slug exists
        const existingSlug = await prisma.product.findUnique({ where: { slug } });
        const finalSlug = existingSlug ? generateUniqueSlug(input.title) : slug;

        return prisma.$transaction(async (tx) => {
            // Create product
            const product = await tx.product.create({
                data: {
                    title: input.title,
                    slug: finalSlug,
                    description: input.description,
                    shortDescription: input.shortDescription,
                    status: input.status as ProductStatus,
                    featured: input.featured,
                    vendor: input.vendor,
                    productType: input.productType,
                    seoTitle: input.seoTitle,
                    seoDescription: input.seoDescription,
                },
            });

            // Create options if provided
            if (input.options && input.options.length > 0) {
                for (let i = 0; i < input.options.length; i++) {
                    const option = input.options[i];
                    const createdOption = await tx.productOption.create({
                        data: {
                            productId: product.id,
                            name: option.name,
                            position: i,
                        },
                    });

                    // Create option values
                    for (let j = 0; j < option.values.length; j++) {
                        await tx.productOptionValue.create({
                            data: {
                                optionId: createdOption.id,
                                value: option.values[j],
                                position: j,
                            },
                        });
                    }
                }
            }

            // Create variants
            for (let i = 0; i < input.variants.length; i++) {
                const variant = input.variants[i];
                await tx.productVariant.create({
                    data: {
                        productId: product.id,
                        title: variant.title || 'Default',
                        sku: variant.sku,
                        barcode: variant.barcode,
                        price: variant.price,
                        compareAtPrice: variant.compareAtPrice,
                        costPrice: variant.costPrice,
                        inventoryQty: variant.inventoryQty,
                        weight: variant.weight,
                        weightUnit: variant.weightUnit,
                        position: i,
                    },
                });
            }

            // Create images if provided
            if (input.images && input.images.length > 0) {
                for (let i = 0; i < input.images.length; i++) {
                    await tx.productImage.create({
                        data: {
                            productId: product.id,
                            url: input.images[i].url,
                            alt: input.images[i].alt,
                            position: input.images[i].position ?? i,
                        },
                    });
                }
            }

            // Create tags if provided
            if (input.tags && input.tags.length > 0) {
                for (const tagName of input.tags) {
                    const tag = await tx.tag.upsert({
                        where: { name: tagName },
                        create: { name: tagName },
                        update: {},
                    });
                    await tx.productTag.create({
                        data: { productId: product.id, tagId: tag.id },
                    });
                }
            }

            // Add to categories if provided
            if (input.categoryIds && input.categoryIds.length > 0) {
                for (const categoryId of input.categoryIds) {
                    await tx.productCategory.create({
                        data: { productId: product.id, categoryId },
                    });
                }
            }

            // Add to collections if provided
            if (input.collectionIds && input.collectionIds.length > 0) {
                for (const collectionId of input.collectionIds) {
                    await tx.collectionProduct.create({
                        data: { productId: product.id, collectionId },
                    });
                }
            }

            // Return the full product using the transaction client (not global prisma)
            // to maintain transaction isolation
            const fullProduct = await tx.product.findUnique({
                where: { id: product.id, deletedAt: null },
                include: this.getFullInclude(),
            });

            if (!fullProduct) throw new Error('Product not found after creation');
            return fullProduct;
        });
    }

    /**
     * Update a product
     */
    async update(id: string, input: UpdateProductInput) {
        const product = await prisma.product.findUnique({ where: { id } });
        if (!product) throw new Error('Product not found');

        // Handle slug update
        let finalSlug = product.slug;
        if (input.slug && input.slug !== product.slug) {
            const existingSlug = await prisma.product.findUnique({ where: { slug: input.slug } });
            if (existingSlug && existingSlug.id !== id) {
                finalSlug = generateUniqueSlug(input.slug);
            } else {
                finalSlug = input.slug;
            }
        }

        return prisma.product.update({
            where: { id },
            data: {
                title: input.title,
                slug: finalSlug,
                description: input.description,
                shortDescription: input.shortDescription,
                status: input.status as ProductStatus,
                featured: input.featured,
                vendor: input.vendor,
                productType: input.productType,
                seoTitle: input.seoTitle,
                seoDescription: input.seoDescription,
                updatedAt: new Date(),
            },
            include: this.getFullInclude(),
        });
    }

    /**
     * Find product by ID
     */
    async findById(id: string) {
        const product = await prisma.product.findUnique({
            where: { id, deletedAt: null },
            include: this.getFullInclude(),
        });

        if (!product) throw new Error('Product not found');
        return product;
    }

    /**
     * Find product by slug
     */
    async findBySlug(slug: string) {
        const product = await prisma.product.findUnique({
            where: { slug, deletedAt: null, status: 'ACTIVE' },
            include: this.getFullInclude(),
        });

        if (!product) throw new Error('Product not found');
        return product;
    }

    /**
     * List products with filters and pagination
     */
    async findMany(query: ProductQueryInput) {
        const {
            page = 1,
            limit = 20,
            search,
            status,
            category,
            collection,
            tag,
            minPrice,
            maxPrice,
            sort = 'createdAt',
            order = 'desc',
            featured,
        } = query;

        const where: Prisma.ProductWhereInput = {
            deletedAt: null,
            status: status || 'ACTIVE', // Default to ACTIVE for storefront
            ...(featured !== undefined && { featured }),
            ...(search && {
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                ],
            }),
            ...(category && {
                categories: {
                    some: { category: { slug: category } },
                },
            }),
            ...(collection && {
                collections: {
                    some: { collection: { slug: collection } },
                },
            }),
            ...(tag && {
                tags: {
                    some: { tag: { name: tag } },
                },
            }),
            ...((minPrice !== undefined || maxPrice !== undefined) && {
                variants: {
                    some: {
                        price: {
                            ...(minPrice !== undefined && { gte: minPrice }),
                            ...(maxPrice !== undefined && { lte: maxPrice }),
                        },
                    },
                },
            }),
        };

        // Handle special sort cases
        // Price sorting requires special handling since price is on variants relation
        const isPriceSort = sort === 'price';

        let orderBy: Prisma.ProductOrderByWithRelationInput | Prisma.ProductOrderByWithRelationInput[];

        if (sort === 'featured') {
            // Featured products first, then by createdAt
            orderBy = [
                { featured: 'desc' },
                { createdAt: 'desc' },
            ];
        } else if (!isPriceSort) {
            // Standard field sorting (title, createdAt, updatedAt)
            orderBy = { [sort]: order };
        } else {
            // For price sort, we'll sort by createdAt first, then re-sort in memory
            orderBy = { createdAt: 'desc' };
        }

        if (isPriceSort) {
            // For price sorting, we need to fetch matching products and sort in memory
            // This is less efficient but gives correct results for relation-based sorting
            // 
            // IMPORTANT: To prevent memory issues, we apply a hard cap.
            // Long-term fix: Add a denormalized minVariantPrice field on Product table
            // and update it via triggers/hooks when variants change.
            const MAX_PRICE_SORT_PRODUCTS = 1000;

            const [allProducts, totalCount] = await Promise.all([
                prisma.product.findMany({
                    where,
                    include: {
                        variants: { orderBy: { position: 'asc' }, take: 1 },
                        images: { where: { deletedAt: null }, orderBy: { position: 'asc' }, take: 1 },
                        collections: { include: { collection: true } },
                        categories: { include: { category: true } },
                        _count: { select: { reviews: true } },
                    },
                    take: MAX_PRICE_SORT_PRODUCTS, // Hard cap to prevent OOM
                }),
                prisma.product.count({ where }),
            ]);

            // Warn if results may be incomplete due to cap
            const cappedResults = totalCount > MAX_PRICE_SORT_PRODUCTS;

            // Sort by first variant price
            const sortedProducts = allProducts.sort((a, b) => {
                const priceA = a.variants[0]?.price?.toNumber?.() ?? a.variants[0]?.price ?? 0;
                const priceB = b.variants[0]?.price?.toNumber?.() ?? b.variants[0]?.price ?? 0;
                return order === 'asc' ? priceA - priceB : priceB - priceA;
            });

            // Apply pagination
            const paginatedProducts = sortedProducts.slice((page - 1) * limit, page * limit);
            const effectiveTotal = cappedResults ? MAX_PRICE_SORT_PRODUCTS : allProducts.length;

            return {
                products: paginatedProducts,
                pagination: {
                    page,
                    limit,
                    total: effectiveTotal,
                    totalPages: Math.ceil(effectiveTotal / limit),
                },
                // Flag to indicate results may be incomplete when sorting by price
                ...(cappedResults && {
                    warning: `Price sorting is limited to ${MAX_PRICE_SORT_PRODUCTS} products for performance. Some results may not be shown.`,
                }),
            };
        }

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                include: {
                    variants: { orderBy: { position: 'asc' }, take: 1 },
                    images: { where: { deletedAt: null }, orderBy: { position: 'asc' }, take: 1 },
                    collections: { include: { collection: true } },
                    categories: { include: { category: true } },
                    _count: { select: { reviews: true } },
                },
                orderBy,
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.product.count({ where }),
        ]);

        return {
            products,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    /**
     * Soft delete a product
     */
    async delete(id: string) {
        await prisma.product.update({
            where: { id },
            data: { deletedAt: new Date(), status: 'ARCHIVED' },
        });
    }

    /**
     * Hard delete a product (admin only)
     */
    async hardDelete(id: string) {
        await prisma.product.delete({ where: { id } });
    }

    /**
     * Update variant inventory
     */
    async updateInventory(variantId: string, quantity: number) {
        return prisma.productVariant.update({
            where: { id: variantId },
            data: { inventoryQty: quantity },
        });
    }

    /**
     * Adjust variant inventory (add/subtract)
     */
    async adjustInventory(variantId: string, adjustment: number) {
        return prisma.productVariant.update({
            where: { id: variantId },
            data: { inventoryQty: { increment: adjustment } },
        });
    }

    /**
     * Get product reviews
     */
    async getReviews(productId: string, page = 1, limit = 10) {
        const [reviews, total, avgRating, distribution] = await Promise.all([
            prisma.review.findMany({
                where: { productId, approved: true },
                include: {
                    customer: {
                        include: {
                            user: { select: { name: true } },
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.review.count({ where: { productId, approved: true } }),
            prisma.review.aggregate({
                where: { productId, approved: true },
                _avg: { rating: true },
            }),
            prisma.review.groupBy({
                by: ['rating'],
                where: { productId, approved: true },
                _count: { rating: true },
            }),
        ]);

        // Format distribution
        const ratingDistribution = Array.from({ length: 5 }, (_, i) => {
            const rating = 5 - i;
            const item = distribution.find((d) => d.rating === rating);
            return { rating, count: item?._count.rating || 0 };
        });

        return {
            reviews,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
            stats: {
                averageRating: avgRating._avg.rating || 0,
                totalReviews: total,
                ratingDistribution,
            },
        };
    }

    private getFullInclude(): Prisma.ProductInclude {
        return {
            variants: {
                orderBy: { position: 'asc' },
                include: {
                    optionValues: {
                        include: {
                            optionValue: { include: { option: true } },
                        },
                    },
                },
            },
            options: {
                orderBy: { position: 'asc' },
                include: { values: { orderBy: { position: 'asc' } } },
            },
            images: { where: { deletedAt: null }, orderBy: { position: 'asc' } },
            tags: { include: { tag: true } },
            collections: { include: { collection: true } },
            categories: { include: { category: true } },
        };
    }
}

export const productService = new ProductService();
