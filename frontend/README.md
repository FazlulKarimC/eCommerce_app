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


## Tech Stack

- **Frontend**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Form Handling**: React Hook Form with Zod validation
- **State Management**: React Context
- **Email**: Simulated email notifications (Mailtrap.io sandbox mode)


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


## Form Validations

### Customer Information
- Full name (min 2 characters)
- Valid email format
- Phone number format validation
- Address (min 5 characters)
- City, State (min 2 characters)
- ZIP code format (12345 or 12345-6789)

### Payment Information
- Card number (exactly 1 digits)
- Expiry date (MM/YY format, future date)
- CVV (exactly 3 digits)


## Testing Scenarios

### Successful Purchase
1. Use card number ending in 1 (e.g., `1`)
2. Fill valid customer information
3. Complete checkout → See success confirmation

### Declined Payment
1. Use card number ending in 2 (e.g., `2`)
2. Complete checkout → See declined message

### Payment Error
1. Use card number ending in 3 (e.g., `3`)
2. Complete checkout → See payment failure message

