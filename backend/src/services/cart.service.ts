import { prisma } from '../config/database';
import { AddToCartInput } from '../validators/common.validator';

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
     * Add item to cart
     */
    async addItem(cartId: string, input: AddToCartInput) {
        const variant = await prisma.productVariant.findUnique({
            where: { id: input.variantId },
            include: { product: true },
        });

        if (!variant || variant.product.deletedAt || variant.product.status !== 'ACTIVE') {
            throw new Error('Product variant not found or unavailable');
        }

        if (variant.inventoryQty < input.quantity) {
            throw new Error('Insufficient inventory');
        }

        // Check if item already in cart
        const existingItem = await prisma.cartItem.findUnique({
            where: {
                cartId_variantId: { cartId, variantId: input.variantId },
            },
        });

        if (existingItem) {
            // Update quantity
            const newQuantity = existingItem.quantity + input.quantity;
            if (newQuantity > variant.inventoryQty) {
                throw new Error('Insufficient inventory');
            }

            await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: newQuantity },
            });
        } else {
            // Add new item
            await prisma.cartItem.create({
                data: {
                    cartId,
                    variantId: input.variantId,
                    quantity: input.quantity,
                },
            });
        }

        // Update cart timestamp
        await prisma.cart.update({
            where: { id: cartId },
            data: { updatedAt: new Date() },
        });

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
     */
    async mergeCart(sessionId: string, userId: string) {
        const guestCart = await prisma.cart.findUnique({
            where: { sessionId },
            include: { items: true },
        });

        if (!guestCart || guestCart.items.length === 0) {
            return this.getOrCreateCart(userId);
        }

        // Resolve Customer
        let customer = await prisma.customer.findUnique({ where: { userId } });
        if (!customer) {
            customer = await prisma.customer.create({ data: { userId } });
        }
        const customerId = customer.id;

        // Get or create customer cart
        let customerCart = await prisma.cart.findUnique({
            where: { customerId },
        });

        if (!customerCart) {
            customerCart = await prisma.cart.create({
                data: { customerId },
            });
        }

        // Merge items
        for (const item of guestCart.items) {
            const existingItem = await prisma.cartItem.findUnique({
                where: {
                    cartId_variantId: { cartId: customerCart.id, variantId: item.variantId },
                },
            });

            if (existingItem) {
                await prisma.cartItem.update({
                    where: { id: existingItem.id },
                    data: { quantity: existingItem.quantity + item.quantity },
                });
            } else {
                await prisma.cartItem.create({
                    data: {
                        cartId: customerCart.id,
                        variantId: item.variantId,
                        quantity: item.quantity,
                    },
                });
            }
        }

        // Delete guest cart
        await prisma.cart.delete({ where: { id: guestCart.id } });

        return this.getCart(customerCart.id);
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

    private formatCart(cart: any) {
        const items = cart.items.map((item: any) => ({
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
                price: parseFloat(item.variant.price),
                compareAtPrice: item.variant.compareAtPrice ? parseFloat(item.variant.compareAtPrice) : null,
                inventoryQty: item.variant.inventoryQty,
                options: item.variant.optionValues.map((ov: any) => ({
                    name: ov.optionValue.option.name,
                    value: ov.optionValue.value,
                })),
            },
            lineTotal: parseFloat(item.variant.price) * item.quantity,
        }));

        const subtotal = items.reduce((sum: number, item: any) => sum + item.lineTotal, 0);

        return {
            id: cart.id,
            items,
            itemCount: items.reduce((sum: number, item: any) => sum + item.quantity, 0),
            subtotal,
        };
    }
}

export const cartService = new CartService();
