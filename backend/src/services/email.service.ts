import { Resend } from 'resend';

// Initialize Resend with API key (will be undefined if not set)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Store name for emails
const STORE_NAME = process.env.STORE_NAME || 'Our Store';
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@resend.dev'; // Use resend.dev for testing

interface OrderEmailData {
  orderNumber: string;
  email: string;
  customerName: string;
  items: Array<{
    productTitle: string;
    variantTitle?: string | null;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  discount: number;
  shippingCost: number;
  tax: number;
  total: number;
  shippingAddress?: {
    firstName: string;
    lastName: string;
    line1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  } | null;
}

interface ShippingEmailData {
  orderNumber: string;
  email: string;
  customerName: string;
  carrier?: string | null;
  trackingNumber?: string | null;
  trackingUrl?: string | null;
  estimatedDelivery?: string | null;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

/**
 * Escape HTML entities to prevent XSS attacks
 * Handles null/undefined by returning empty string
 */
function escapeHtml(text: string | null | undefined): string {
  if (text == null) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Safely format a date string, returning null if invalid
 */
function formatDateSafe(dateString: string | null | undefined): string | null {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (!isFinite(date.getTime())) return null;
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmation(data: OrderEmailData): Promise<boolean> {
  if (!resend) {
    console.log('[EMAIL] Resend not configured - skipping order confirmation email');
    console.log('[EMAIL] Would send to:', data.email);
    return false;
  }

  const itemsHtml = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e5e5;">
          ${escapeHtml(item.productTitle)}${item.variantTitle ? ` - ${escapeHtml(item.variantTitle)}` : ''}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; text-align: right;">
          ${formatCurrency(item.price * item.quantity)}
        </td>
      </tr>
    `
    )
    .join('');

  const addressHtml = data.shippingAddress
    ? `
    <div style="margin-top: 24px; padding: 16px; background: #f5f5f5; border-radius: 8px;">
      <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: bold; text-transform: uppercase; color: #666;">
        Shipping Address
      </h3>
      <p style="margin: 0; line-height: 1.6;">
        ${data.shippingAddress.firstName} ${data.shippingAddress.lastName}<br>
        ${data.shippingAddress.line1}<br>
        ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.postalCode}<br>
        ${data.shippingAddress.country}
      </p>
    </div>
  `
    : '';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      
      <!-- Header -->
      <div style="background: #000; color: #fff; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -1px;">
          ${STORE_NAME}
        </h1>
      </div>
      
      <!-- Content -->
      <div style="background: #fff; padding: 32px; border: 2px solid #000; border-top: none; border-radius: 0 0 8px 8px;">
        <h2 style="margin: 0 0 8px 0; font-size: 28px; font-weight: 900;">
          Order Confirmed! 🎉
        </h2>
        <p style="margin: 0 0 24px 0; color: #666;">
          Thank you for your order, ${data.customerName}!
        </p>
        
        <div style="background: #FFEB3B; padding: 16px; border: 2px solid #000; border-radius: 8px; margin-bottom: 24px;">
          <p style="margin: 0; font-weight: bold;">
            Order #${data.orderNumber}
          </p>
        </div>
        
        <!-- Order Items -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <thead>
            <tr style="background: #f5f5f5;">
              <th style="padding: 12px; text-align: left; font-weight: bold; border-bottom: 2px solid #000;">Item</th>
              <th style="padding: 12px; text-align: center; font-weight: bold; border-bottom: 2px solid #000;">Qty</th>
              <th style="padding: 12px; text-align: right; font-weight: bold; border-bottom: 2px solid #000;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        
        <!-- Totals -->
        <div style="border-top: 2px solid #000; padding-top: 16px;">
          <table style="width: 100%;">
            <tr>
              <td style="padding: 4px 0;">Subtotal</td>
              <td style="padding: 4px 0; text-align: right;">${formatCurrency(data.subtotal)}</td>
            </tr>
            ${data.discount > 0 ? `
            <tr style="color: #16a34a;">
              <td style="padding: 4px 0;">Discount</td>
              <td style="padding: 4px 0; text-align: right;">-${formatCurrency(data.discount)}</td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 4px 0;">Shipping</td>
              <td style="padding: 4px 0; text-align: right;">${data.shippingCost === 0 ? 'FREE' : formatCurrency(data.shippingCost)}</td>
            </tr>
            ${data.tax > 0 ? `
            <tr>
              <td style="padding: 4px 0;">Tax</td>
              <td style="padding: 4px 0; text-align: right;">${formatCurrency(data.tax)}</td>
            </tr>
            ` : ''}
            <tr style="font-weight: bold; font-size: 18px;">
              <td style="padding: 12px 0; border-top: 2px solid #000;">Total</td>
              <td style="padding: 12px 0; border-top: 2px solid #000; text-align: right;">${formatCurrency(data.total)}</td>
            </tr>
          </table>
        </div>
        
        ${addressHtml}
        
        <p style="margin-top: 24px; color: #666; font-size: 14px;">
          We'll send you another email when your order ships.
        </p>
      </div>
      
      <!-- Footer -->
      <div style="text-align: center; padding: 24px; color: #666; font-size: 12px;">
        <p style="margin: 0;">
          © ${new Date().getFullYear()} ${STORE_NAME}. All rights reserved.
        </p>
      </div>
      
    </body>
    </html>
  `;

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: `Order Confirmed - #${data.orderNumber}`,
      html,
    });

    if (error) {
      console.error('[EMAIL] Failed to send order confirmation:', error);
      return false;
    }

    console.log('[EMAIL] Order confirmation sent to:', data.email);
    return true;
  } catch (error) {
    console.error('[EMAIL] Error sending order confirmation:', error);
    return false;
  }
}

/**
 * Send shipping notification email
 */
export async function sendShippingNotification(data: ShippingEmailData): Promise<boolean> {
  if (!resend) {
    console.log('[EMAIL] Resend not configured - skipping shipping notification email');
    console.log('[EMAIL] Would send to:', data.email);
    return false;
  }

  const trackingHtml = data.trackingNumber
    ? `
    <div style="background: #FFEB3B; padding: 20px; border: 2px solid #000; border-radius: 8px; margin: 24px 0;">
      <h3 style="margin: 0 0 12px 0; font-weight: bold;">Tracking Information</h3>
      ${data.carrier ? `<p style="margin: 0 0 8px 0;"><strong>Carrier:</strong> ${data.carrier}</p>` : ''}
      <p style="margin: 0 0 8px 0;"><strong>Tracking Number:</strong> ${data.trackingNumber}</p>
      ${data.trackingUrl ? `
      <a href="${data.trackingUrl}" style="display: inline-block; margin-top: 12px; padding: 12px 24px; background: #000; color: #fff; text-decoration: none; font-weight: bold; border-radius: 8px;">
        Track Your Package →
      </a>
      ` : ''}
    </div>
  `
    : '';

  const formattedDeliveryDate = formatDateSafe(data.estimatedDelivery);
  const estimatedDeliveryHtml = formattedDeliveryDate
    ? `
    <p style="margin: 16px 0; padding: 16px; background: #f5f5f5; border-radius: 8px;">
      <strong>Estimated Delivery:</strong> ${formattedDeliveryDate}
    </p>
  `
    : '';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      
      <!-- Header -->
      <div style="background: #000; color: #fff; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -1px;">
          ${STORE_NAME}
        </h1>
      </div>
      
      <!-- Content -->
      <div style="background: #fff; padding: 32px; border: 2px solid #000; border-top: none; border-radius: 0 0 8px 8px;">
        <h2 style="margin: 0 0 8px 0; font-size: 28px; font-weight: 900;">
          Your Order Has Shipped! 📦
        </h2>
        <p style="margin: 0 0 24px 0; color: #666;">
          Great news, ${data.customerName}! Your order is on its way.
        </p>
        
        <div style="background: #f5f5f5; padding: 16px; border: 2px solid #000; border-radius: 8px;">
          <p style="margin: 0; font-weight: bold;">
            Order #${data.orderNumber}
          </p>
        </div>
        
        ${trackingHtml}
        ${estimatedDeliveryHtml}
        
        <p style="margin-top: 24px; color: #666; font-size: 14px;">
          If you have any questions about your order, please don't hesitate to contact us.
        </p>
      </div>
      
      <!-- Footer -->
      <div style="text-align: center; padding: 24px; color: #666; font-size: 12px;">
        <p style="margin: 0;">
          © ${new Date().getFullYear()} ${STORE_NAME}. All rights reserved.
        </p>
      </div>
      
    </body>
    </html>
  `;

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: `Your Order Has Shipped - #${data.orderNumber}`,
      html,
    });

    if (error) {
      console.error('[EMAIL] Failed to send shipping notification:', error);
      return false;
    }

    console.log('[EMAIL] Shipping notification sent to:', data.email);
    return true;
  } catch (error) {
    console.error('[EMAIL] Error sending shipping notification:', error);
    return false;
  }
}

export const emailService = {
  sendOrderConfirmation,
  sendShippingNotification,
};
