import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// --- Zod schemas ---
const itemSchema = z.object({
  productId: z.number(),
  title: z.string().min(1),
  description: z.string(),
  price: z.number().positive(),
  image: z.string().url(), // URL to the product image
  selectedVariants: z.record(z.string(), z.string()),
  quantity: z.number().min(1),
});



const orderSchema = z.object({
  customerId: z.number(),
  cardNumber: z.string().min(1),
  items: z.array(itemSchema).min(1),
  subTotal: z.number().nonnegative(),
  total: z.number().nonnegative(),
});

// --- POST /api/orders ---
// Create a new order and simulate a transaction
router.post('/', async (req, res) => {
  const parsed = orderSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid input', details: parsed.error.errors });
    return;
  }

  const { customerId, cardNumber, items, subTotal, total } = parsed.data;

  // Simple status simulation

  const lastDigit = Number(cardNumber.slice(-1));
  let status = ""

  if (lastDigit === 1) {
    status = 'approved';
  } else if (lastDigit === 2) {
    status = 'declined'; 
  } else if (lastDigit % 2 === 3) {
    status = 'failed'; 
  }

  if (status !== "approved") {
    // If not approved, simulate a failed transaction
    res.status(400).json({ error: `Transaction ${status}` });
    return;
  }

  // Unique order number
  const orderNumber = `ORD-${new Date().getFullYear()}-${Math.floor(Math.random() * 1_000_000)}`;

  try {
    const order = await prisma.order.create({
      data: {
        orderNumber,
        status,
        customerId,
        cardNumber,
        items,    // JSON column — Prisma will marshal it
        subTotal,
        total,
      },
    });

    res.status(201).json(order.orderNumber);
    console.log('Order created:', order);
    return;
    
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Failed to create order' });
    return;
  }
});

// --- GET /api/orders/:orderNumber ---
// Fetch an order for a thank-you page
router.get('/:orderNumber', async (req: Request<{ orderNumber: string }>, res: Response) => {
    const { orderNumber } = req.params;

    try {
      const order = await prisma.order.findUnique({
        where: { orderNumber },
        include: {
          customer: true,  // if you want customer details
        },
      });

      if (!order) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }
      res.json(order);
      return;
    } catch (err) {
      console.error('Error fetching order:', err);
      res.status(500).json({ error: 'Failed to fetch order' });
      return;
    }
  }
);

export default router;
