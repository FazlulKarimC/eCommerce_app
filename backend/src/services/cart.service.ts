import { prisma } from '../config/database';
import { AddToCartInput } from '../validators/common.validator';
import { Prisma } from '@prisma/client';

// Type for cart with full includes
type CartWithItems = Prisma.CartGetPayload<{
    include: {
        items: {
            include: {
                variant: {
                    include: {
                        product: {
                            include: {
                                images: true;
                            };
                        };
                        optionValues: {
                            include: {
                                optionValue: {
                                    include: {
                                        option: true;
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
    };
}>;

// Type for cart item in the includes
type CartItemWithVariant = CartWithItems['items'][number];

export class CartService {
    /**
     * Get or create cart for customer or session
     */
    /**
     * Get or create cart for user (via userId) or session
     */
    async getOrCreateCart(userId?: string, sessionId?: string) {
        if (!userId && !sessionId) {
            throw new Error('Either userId or sessionId is required');
        }

        let customerId: string | undefined;

        // If userId provided, resolve/create Customer
        if (userId) {
            let customer = await prisma.customer.findUnique({
                where: { userId },
            });

            if (!customer) {
                customer = await prisma.customer.create({
                    data: { userId },
                });
            }
            customerId = customer.id;
        }

        let cart = await prisma.cart.findFirst({
            where: customerId
                ? { customerId }
                : { sessionId },
            include: this.getCartInclude(),
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: {
                    customerId,
                    sessionId: customerId ? undefined : sessionId, // Only set sessionId if no customer (or if allowed to have both?)
                    // Schema allows both? Cart.customerId unique, Cart.sessionId unique.
                    // A cart usually belongs to EITHER customer OR session.
                    // But if we merge, we might clear sessionId.
                    // For now, if customerId is present, we create a customer cart.
                    expiresAt: sessionId ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : null,
                },
                include: this.getCartInclude(),
            });
        }

        return this.formatCart(cart);
    }

    /**
     * Add item to cart - uses atomic transaction to prevent race conditions
     */
    async addItem(cartId: string, input: AddToCartInput) {
        // Transaction for atomic operations only
        await prisma.$transaction(async (tx) => {
            // Validate variant exists and is available
            const variant = await tx.productVariant.findUnique({
                where: { id: input.variantId },
                include: { product: true },
            });

            if (!variant || variant.product.deletedAt || variant.product.status !== 'ACTIVE') {
                throw new Error('Product variant not found or unavailable');
            }

            // Atomic upsert with quantity increment
            const existingItem = await tx.cartItem.findUnique({
                where: {
                    cartId_variantId: { cartId, variantId: input.variantId },
                },
            });

            let resultItem;
            if (existingItem) {
                // Update quantity atomically
                resultItem = await tx.cartItem.update({
                    where: { id: existingItem.id },
                    data: { quantity: { increment: input.quantity } },
                });
            } else {
                // Create new item
                resultItem = await tx.cartItem.create({
                    data: {
                        cartId,
                        variantId: input.variantId,
                        quantity: input.quantity,
                    },
                });
            }

            // Validate inventory AFTER the atomic update (within same transaction)
            if (resultItem.quantity > variant.inventoryQty) {
                throw new Error(`Insufficient inventory. Only ${variant.inventoryQty} available.`);
            }

            // Update cart timestamp
            await tx.cart.update({
                where: { id: cartId },
                data: { updatedAt: new Date() },
            });
        });

        // Fetch and return updated cart OUTSIDE the transaction
        // This avoids the heavy include causing transaction timeout
        return this.getCart(cartId);
    }

    /**
     * Update cart item quantity
     */
    async updateItemQuantity(cartId: string, itemId: string, quantity: number) {
        const item = await prisma.cartItem.findFirst({
            where: { id: itemId, cartId },
            include: { variant: true },
        });

        if (!item) {
            throw new Error('Cart item not found');
        }

        if (quantity === 0) {
            await prisma.cartItem.delete({ where: { id: itemId } });
        } else {
            if (quantity > item.variant.inventoryQty) {
                throw new Error('Insufficient inventory');
            }

            await prisma.cartItem.update({
                where: { id: itemId },
                data: { quantity },
            });
        }

        return this.getCart(cartId);
    }

    /**
     * Remove item from cart
     */
    async removeItem(cartId: string, itemId: string) {
        await prisma.cartItem.deleteMany({
            where: { id: itemId, cartId },
        });

        return this.getCart(cartId);
    }

    /**
     * Clear cart
     */
    async clearCart(cartId: string) {
        await prisma.cartItem.deleteMany({
            where: { cartId },
        });

        return this.getCart(cartId);
    }

    /**
     * Get cart by ID
     */
    async getCart(cartId: string) {
        const cart = await prisma.cart.findUnique({
            where: { id: cartId },
            include: this.getCartInclude(),
        });

        if (!cart) {
            throw new Error('Cart not found');
        }

        return this.formatCart(cart);
    }

    /**
     * Merge guest cart into customer cart on login
     * Uses batch operations and proper inventory validation
     */
    async mergeCart(sessionId: string, userId: string) {
        const guestCart = await prisma.cart.findUnique({
            where: { sessionId },
            include: { items: true },
        });

        if (!guestCart || guestCart.items.length === 0) {
            return this.getOrCreateCart(userId);
        }

        return await prisma.$transaction(async (tx) => {
            // Resolve Customer
            let customer = await tx.customer.findUnique({ where: { userId } });
            if (!customer) {
                customer = await tx.customer.create({ data: { userId } });
            }
            const customerId = customer.id;

            // Get or create customer cart
            let customerCart = await tx.cart.findUnique({
                where: { customerId },
            });

            if (!customerCart) {
                customerCart = await tx.cart.create({
                    data: { customerId },
                });
            }

            // Collect all variant IDs from guest cart
            const variantIds = guestCart.items.map(item => item.variantId);

            // Batch fetch: existing items in customer cart AND variant details for inventory check
            const [existingItems, variants] = await Promise.all([
                tx.cartItem.findMany({
                    where: { cartId: customerCart.id, variantId: { in: variantIds } },
                }),
                tx.productVariant.findMany({
                    where: { id: { in: variantIds } },
                    include: { product: true },
                }),
            ]);

            // Create lookup maps
            const existingItemMap = new Map(existingItems.map(item => [item.variantId, item]));
            const variantMap = new Map(variants.map(v => [v.id, v]));

            // Prepare batch operations with inventory validation
            const updateOperations: { id: string; quantity: number }[] = [];
            const createData: { cartId: string; variantId: string; quantity: number }[] = [];

            for (const guestItem of guestCart.items) {
                const variant = variantMap.get(guestItem.variantId);

                // Validate variant exists and product is active
                if (!variant || variant.product.deletedAt || variant.product.status !== 'ACTIVE') {
                    // Skip unavailable products (or throw if you prefer strict behavior)
                    continue;
                }

                const existingItem = existingItemMap.get(guestItem.variantId);
                const existingQty = existingItem?.quantity || 0;
                const newQuantity = existingQty + guestItem.quantity;

                // Validate inventory - cap at available if exceeds
                const finalQuantity = Math.min(newQuantity, variant.inventoryQty);

                if (finalQuantity <= 0) {
                    continue; // Skip if no inventory
                }

                if (existingItem) {
                    // Only update if quantity actually changes
                    if (finalQuantity !== existingQty) {
                        updateOperations.push({ id: existingItem.id, quantity: finalQuantity });
                    }
                } else {
                    createData.push({
                        cartId: customerCart.id,
                        variantId: guestItem.variantId,
                        quantity: finalQuantity,
                    });
                }
            }

            // Execute batch updates (Prisma doesn't have updateMany with different values, so we batch manual updates)
            if (updateOperations.length > 0) {
                await Promise.all(
                    updateOperations.map(op =>
                        tx.cartItem.update({
                            where: { id: op.id },
                            data: { quantity: op.quantity },
                        })
                    )
                );
            }

            // Execute batch creates
            if (createData.length > 0) {
                await tx.cartItem.createMany({
                    data: createData,
                    skipDuplicates: true,
                });
            }

            // Delete guest cart
            await tx.cart.delete({ where: { id: guestCart.id } });

            // Return merged cart
            const mergedCart = await tx.cart.findUnique({
                where: { id: customerCart.id },
                include: this.getCartInclude(),
            });

            return this.formatCart(mergedCart!);
        });
    }

    private getCartInclude() {
        return {
            items: {
                include: {
                    variant: {
                        include: {
                            product: {
                                include: {
                                    images: { take: 1, orderBy: { position: 'asc' as const } },
                                },
                            },
                            optionValues: {
                                include: {
                                    optionValue: { include: { option: true } },
                                },
                            },
                        },
                    },
                },
            },
        };
    }

    private formatCart(cart: CartWithItems) {
        const items = cart.items.map((item: CartItemWithVariant) => ({
            id: item.id,
            variantId: item.variantId,
            quantity: item.quantity,
            product: {
                id: item.variant.product.id,
                title: item.variant.product.title,
                slug: item.variant.product.slug,
                image: item.variant.product.images[0]?.url || null,
            },
            variant: {
                id: item.variant.id,
                title: item.variant.title,
                sku: item.variant.sku,
                price: parseFloat(item.variant.price.toString()),
                compareAtPrice: item.variant.compareAtPrice ? parseFloat(item.variant.compareAtPrice.toString()) : null,
                inventoryQty: item.variant.inventoryQty,
                options: item.variant.optionValues.map((ov) => ({
                    name: ov.optionValue.option.name,
                    value: ov.optionValue.value,
                })),
            },
            lineTotal: parseFloat(item.variant.price.toString()) * item.quantity,
        }));

        const subtotal = items.reduce((sum: number, item) => sum + item.lineTotal, 0);

        return {
            id: cart.id,
            items,
            itemCount: items.reduce((sum: number, item) => sum + item.quantity, 0),
            subtotal,
        };
    }
}

export const cartService = new CartService();

