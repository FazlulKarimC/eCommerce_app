import { Customer, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { CustomerType } from '../validators/customer';

async function createCustomer(data: CustomerType) {
    try {
    // Try to update if email exists, else create
    const existing = await prisma.customer.findUnique({ where: { email: data.email } });
    let customer;
    if (existing) {
      customer = await prisma.customer.update({
        where: { email: data.email },
        data: data,
      });
      return { message: 'Customer updated', customer };

    } else {
      customer = await prisma.customer.create({
        data: data,
      });
      return { message: 'Customer created', customer };
      
    }
  } catch (error: any) {
    return { error: 'Failed to create customer' };
  }
}
export default createCustomer;