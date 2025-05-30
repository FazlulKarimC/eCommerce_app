import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();
const router = Router();

const orderSchema = z.object({
  customerId: z.number(),
  cardNumber: z.string().min(1).max(1),
  productId: z.number(),
  productTitle: z.string().min(1),
  selectedVariants: z.any(), // Accept any, will be stringified
  quantity: z.number().min(1),
  subtotal: z.number(),
  total: z.number(),
});

// POST /api/orders - Create order + simulate transaction
router.post('/', async (req, res) => {
  const parse = orderSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ error: 'Invalid input', details: parse.error.errors });
    return;
  }
  try {
    const {
      customerId,
      cardNumber,
      productId,
      productTitle,
      selectedVariants,
      quantity,
      subtotal,
      total,
    } = parse.data;
    const statusOptions = ['approved', 'declined', 'failed'];
    const status = statusOptions[Number(cardNumber.slice(-1)) % statusOptions.length];
    const orderNumber = `ORD-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000000)}`;
    const order = await prisma.order.create({
      data: {
        orderNumber,
        status,
        customerId,
        cardNumber,
        productId,
        productTitle,
        selectedVariants: JSON.stringify(selectedVariants),
        quantity,
        subtotal,
        total,
      },
    });
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create order' });
  }
});

// GET /api/orders/:orderNumber - Get order for thank-you page
router.get('/:orderNumber', async (req: Request<{ orderNumber: string }>, res: Response) => {
  try {
    const { orderNumber } = req.params;
    const order = await prisma.order.findUnique({ where: { orderNumber } });
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

export default router;
