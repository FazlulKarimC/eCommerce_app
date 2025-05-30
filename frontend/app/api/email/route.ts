import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { Order } from '@/lib/types';

// Email templates
const getEmailTemplate = (order: Order, type: 'success' | 'declined' | 'error') => {
  const baseStyle = `
    font-family: Arial, sans-serif;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f9f9f9;
  `;

  const cardStyle = `
    background: white;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  `;

  switch (type) {
    case 'success':
      return {
        subject: `Order Confirmation - ${order.orderNumber}`,
        html: `
          <div style="${baseStyle}">
            <div style="${cardStyle}">
              <h1 style="color: #22c55e; margin-bottom: 20px;">✅ Order Confirmed!</h1>
              <p>Dear ${order.customerInfo.fullName},</p>
              <p>Thank you for your order! Your payment has been successfully processed.</p>
              
              <div style="background: #f3f4f6; padding: 20px; border-radius: 6px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Order Details</h3>
                <p><strong>Order Number:</strong> ${order.orderNumber}</p>
                <p><strong>Product:</strong> ${order.productDetails.productName}</p>
                <p><strong>Color:</strong> ${order.productDetails.selectedColor}</p>
                <p><strong>Size:</strong> ${order.productDetails.selectedSize}</p>
                <p><strong>Quantity:</strong> ${order.productDetails.quantity}</p>
                <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
              </div>
              
              <div style="background: #f3f4f6; padding: 20px; border-radius: 6px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Shipping Address</h3>
                <p>${order.customerInfo.address}<br>
                ${order.customerInfo.city}, ${order.customerInfo.state} ${order.customerInfo.zipCode}</p>
              </div>
              
              <p>We'll send you a shipping confirmation once your order is on its way.</p>
              <p>Thank you for shopping with us!</p>
            </div>
          </div>
        `
      };

    case 'declined':
      return {
        subject: `Payment Declined - Order ${order.orderNumber}`,
        html: `
          <div style="${baseStyle}">
            <div style="${cardStyle}">
              <h1 style="color: #ef4444; margin-bottom: 20px;">❌ Payment Declined</h1>
              <p>Dear ${order.customerInfo.fullName},</p>
              <p>We're sorry, but your payment for order ${order.orderNumber} was declined.</p>
              
              <div style="background: #fef2f2; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #ef4444;">
                <h3 style="margin-top: 0; color: #dc2626;">What happened?</h3>
                <p>Your payment method was declined by your bank or card issuer.</p>
              </div>
              
              <div style="background: #f3f4f6; padding: 20px; border-radius: 6px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Next Steps</h3>
                <ul>
                  <li>Check that your card details are correct</li>
                  <li>Ensure you have sufficient funds</li>
                  <li>Contact your bank if the issue persists</li>
                  <li>Try a different payment method</li>
                </ul>
              </div>
              
              <p>Please try placing your order again or contact our support team for assistance.</p>
            </div>
          </div>
        `
      };

    case 'error':
      return {
        subject: `Payment Error - Order ${order.orderNumber}`,
        html: `
          <div style="${baseStyle}">
            <div style="${cardStyle}">
              <h1 style="color: #f59e0b; margin-bottom: 20px;">⚠️ Payment Processing Error</h1>
              <p>Dear ${order.customerInfo.fullName},</p>
              <p>We encountered a technical issue while processing your payment for order ${order.orderNumber}.</p>
              
              <div style="background: #fffbeb; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                <h3 style="margin-top: 0; color: #d97706;">Technical Issue</h3>
                <p>Our payment gateway experienced a temporary error. Your card was not charged.</p>
              </div>
              
              <div style="background: #f3f4f6; padding: 20px; border-radius: 6px; margin: 20px 0;">
                <h3 style="margin-top: 0;">What to do next</h3>
                <p>Please try placing your order again in a few minutes. If the problem persists, contact our support team.</p>
              </div>
              
              <p>We apologize for the inconvenience and appreciate your patience.</p>
            </div>
          </div>
        `
      };

    default:
      throw new Error('Invalid email type');
  }
};

export async function POST(request: NextRequest) {
  try {
    const { order, type } = await request.json();

    // In a real application, you would use actual Mailtrap credentials
    // For demo purposes, we'll simulate the email sending
    const emailTemplate = getEmailTemplate(order, type);
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Log the email that would be sent (for demo purposes)
    console.log('Email would be sent:', {
      to: order.customerInfo.email,
      subject: emailTemplate.subject,
      type: type
    });

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully'
    });

  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
