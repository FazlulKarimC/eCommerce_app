import { Router } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

const customerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  zipCode: z.string().min(1),
});

// POST /api/customers - Create new customer
router.post('/', async (req, res) => {
  const parse = customerSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ error: 'Invalid input', details: parse.error.errors });
    return;
  }
  try {
    // Try to update if email exists, else create
    const existing = await prisma.customer.findUnique({ where: { email: parse.data.email } });
    let customer;
    if (existing) {
      customer = await prisma.customer.update({
        where: { email: parse.data.email },
        data: parse.data,
      });
      res.status(200).json({ message: 'Customer updated', customer });
      return;

    } else {
      customer = await prisma.customer.create({
        data: parse.data,
      });
      res.status(201).json({ message: 'Customer created', customer });
      return;
    }
  } catch (error: any) {
    res.status(400).json({ error: 'Failed to create customer' });
  }
});

export default router;
