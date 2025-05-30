# eCommerce Checkout Flow Simulation

A complete 3-page eCommerce checkout flow built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui components.

## Features

### 🛍️ Landing Page
- Product showcase with high-quality images
- Variant selection (color, size)
- Quantity selector with +/- controls
- Dynamic price calculation
- Responsive design

### 💳 Checkout Page
- Comprehensive customer information form
- Payment details with real-time validation
- Dynamic order summary
- Transaction simulation based on card number
- Form validation with error handling

### ✅ Thank You Page
- Order confirmation with full details
- Transaction status display (approved/declined/error)
- Customer and payment information
- Order summary and next steps

## Transaction Simulation

The payment simulation works based on the last digit of the card number:

- **Card ending in 1**: ✅ Approved Transaction
- **Card ending in 2**: ❌ Declined Transaction  
- **Card ending in 3**: ⚠️ Gateway Error/Failure

Example test cards:
- `1234567890123451` → Approved
- `1234567890123452` → Declined
- `1234567890123453` → Error

## Tech Stack

- **Frontend**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Form Handling**: React Hook Form with Zod validation
- **State Management**: React Context
- **Email**: Simulated email notifications (Mailtrap.io ready)

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── products/route.ts      # Product data API
│   │   ├── orders/route.ts        # Order processing API
│   │   └── email/route.ts         # Email notification API
│   ├── checkout/page.tsx          # Checkout form page
│   ├── thank-you/[orderNumber]/   # Order confirmation page
│   ├── layout.tsx                 # Root layout with providers
│   └── page.tsx                   # Landing page
├── lib/
│   ├── types.ts                   # TypeScript interfaces
│   ├── validations.ts             # Zod validation schemas
│   ├── cart-context.tsx           # Cart state management
│   └── utils.ts                   # Utility functions
└── components/ui/                 # shadcn/ui components
```

## Installation & Setup

### Prerequisites
- Node.js 18.18.0 or higher
- npm or yarn

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecommerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## Usage Flow

1. **Landing Page**: Select product variants and quantity, click "Buy Now"
2. **Checkout Page**: Fill in customer and payment information
3. **Thank You Page**: View order confirmation and status

## API Endpoints

- `GET /api/products` - Fetch product data
- `POST /api/orders` - Create new order
- `GET /api/orders?orderNumber=XXX` - Fetch order details
- `POST /api/email` - Send email notifications

## Form Validations

### Customer Information
- Full name (min 2 characters)
- Valid email format
- Phone number format validation
- Address (min 5 characters)
- City, State (min 2 characters)
- ZIP code format (12345 or 12345-6789)

### Payment Information
- Card number (exactly 16 digits)
- Expiry date (MM/YY format, future date)
- CVV (exactly 3 digits)

## Email Integration

The application is ready for Mailtrap.io integration. Email templates are included for:
- ✅ Successful orders
- ❌ Declined payments
- ⚠️ Payment errors

To enable actual email sending:
1. Create a Mailtrap.io account
2. Add your SMTP credentials to environment variables
3. Uncomment the nodemailer configuration in `/api/email/route.ts`

## Environment Variables

Create a `.env.local` file for production:

```env
# Mailtrap SMTP Configuration
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_username
SMTP_PASS=your_password

# Database (if using real database)
DATABASE_URL=your_database_url
```

## Testing Scenarios

### Successful Purchase
1. Use card number ending in 1 (e.g., `1234567890123451`)
2. Fill valid customer information
3. Complete checkout → See success confirmation

### Declined Payment
1. Use card number ending in 2 (e.g., `1234567890123452`)
2. Complete checkout → See declined message

### Payment Error
1. Use card number ending in 3 (e.g., `1234567890123453`)
2. Complete checkout → See error message

## Deployment

The application is ready for deployment on:
- Vercel (recommended for Next.js)
- Netlify
- Railway
- Any Node.js hosting platform

## Future Enhancements

- Real database integration (PostgreSQL/MongoDB)
- User authentication
- Order history
- Inventory management
- Real payment gateway integration
- Admin dashboard
- Product catalog with multiple items

## License

MIT License - feel free to use this project for learning and development.
