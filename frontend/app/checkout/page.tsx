'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { LoadingButton } from '@/components/ui/loading-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ArrowLeft, CreditCard, Loader2, ShoppingCart } from 'lucide-react';
import { PageLoader } from '@/components/ui/page-loader';
import { OrderSuccessScreen } from '@/components/ui/order-success-screen';
import { useCart } from '@/lib/cart-context';
import { checkoutFormSchema, CheckoutForm } from '@/lib/validations';
import { CartItem, ProductSelection } from '@/lib/types';
import api from '@/lib/axios';
import { useNavigationLoading } from '@/lib/hooks/useNavigationLoading';

export default function CheckoutPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

  const router = useRouter();
  const { selectedProduct, cartItems, clearCart, getCartTotal } = useCart();
  const { loadingStates, navigateWithLoading } = useNavigationLoading();

  const form = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
    },
  });

  // Determine if we're checking out from cart or direct buy
  const isCartCheckout = cartItems.length > 0;
  const checkoutItems = isCartCheckout ? cartItems : (selectedProduct ? [selectedProduct] : []);

  // Use effect for redirection instead of doing it during render
  useEffect(() => {
    if (checkoutItems.length === 0 && !isProcessingOrder) {
      setIsRedirecting(true);
      router.push('/');
    }
  }, [checkoutItems.length, router, isProcessingOrder]);


  // Show order success screen
  if (orderSuccess) {
    return (
      <OrderSuccessScreen 
        orderNumber={orderSuccess} 
        onComplete={() => {
          router.push(`/thank-you/${orderSuccess}`);
        }}
      />
    );
  }

  // Show loading state while redirecting
  if (isRedirecting) {
    return <PageLoader message="Redirecting..." />;
  }

  // Calculate totals
  const subtotal = isCartCheckout 
    ? getCartTotal()
    : (selectedProduct ? selectedProduct.price * selectedProduct.quantity : 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  const onSubmit = async (data: CheckoutForm) => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Step 1: Create Customer
      const customerResponse = await api.post('/api/customers', {
        name: data.fullName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode
      });

      console.log('Customer created:', customerResponse.data);

      // Get customer ID from response
      // Handle both possible response structures
      const customerId = customerResponse.data.customer?.id || 
                         customerResponse.data.id || 
                         customerResponse.data.customerId;

      if (!customerId) {
        console.error('API Response:', JSON.stringify(customerResponse.data, null, 2));
        throw new Error('Customer ID not returned from API');
      }

      // Transform items to the required format matching the Zod schema
      const transformItemsForOrder = (items: (CartItem | ProductSelection)[]) => {
        return items.map(item => {
          // Ensure productId is a number
          const productId = parseInt(item.productId);
          if (isNaN(productId)) {
            throw new Error(`Invalid productId: ${item.productId}`);
          }

          return {
            productId: productId,
            title: item.productName,
            description: '', // Description is not available in CartItem or ProductSelection
            price: item.price,
            image: 'image' in item ? item.image : 'https://placehold.co/400',
            selectedVariants: {
              size: item.selectedSize || '',
              color: item.selectedColor || ''
            },
            quantity: item.quantity
          };
        });
      };

      // Log the items before transformation for debugging
      console.log('Items before transformation:', isCartCheckout ? cartItems : (selectedProduct ? [selectedProduct] : []));

      // Transform the items
      const transformedItems = transformItemsForOrder(
        isCartCheckout ? cartItems : (selectedProduct ? [selectedProduct] : [])
      );

      // Log the transformed items for debugging
      console.log('Transformed items:', transformedItems);

      // Step 2: Create Order (only if customer creation succeeds)
      const orderResponse = await api.post('/api/orders', {
        customerId: customerId,
        items: transformedItems,
        cardNumber: data.cardNumber,
        // cvv removed as it's not in the schema
        total: total,
        subTotal: subtotal // Changed from subtotal to subTotal to match schema
      });

      console.log('Order created:', orderResponse.data);

      // Log the full order response for debugging
      console.log('Full order response structure:', JSON.stringify(orderResponse.data, null, 2));

      const orderResult = orderResponse.data;
      const orderNumber = orderResult.orderNumber;

      console.log('Order number extracted:', orderNumber);

      if (orderNumber) {
        // Set processing flag to prevent redirect to landing page
        setIsProcessingOrder(true);

        // Clear cart and show success screen
        clearCart();
        setOrderSuccess(orderNumber);
      } else {
        console.error('No order number found in response:', orderResult);
        const errorMessage = orderResult.error || 'Failed to process order';
        toast.error(errorMessage);
        setSubmitError(errorMessage);
      }
    } catch (error: any) {
      // Reset processing flag on error
      setIsProcessingOrder(false);
      console.error('Checkout error:', error);

      // Log detailed error information for easier debugging
      if (error.response) {
        console.error('API Error Response:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
      }

      // Provide more detailed error messages to the user via toast
      if (error.response?.status === 400) {
        // Handle 400 Bad Request errors with more specific messages
        if (error.response.data?.details && Array.isArray(error.response.data.details)) {
          // Handle Zod validation errors
          const details = error.response.data.details;
          const firstError = details[0];

          // Create a user-friendly error message
          let errorMessage = 'Validation error: ';

          if (firstError.path && firstError.path.length > 0) {
            const fieldName = firstError.path[firstError.path.length - 1];
            errorMessage += `Invalid ${fieldName}`;

            if (firstError.message) {
              errorMessage += ` - ${firstError.message}`;
            }
          } else {
            errorMessage += firstError.message || 'Please check your information';
          }

          toast.error(errorMessage);
          console.error('Validation errors:', details);
        } else {
          // Handle other 400 errors
          const errorMessage = error.response.data?.error || 
                              error.response.data?.message || 
                              'Invalid order data. Please check your information.';
          toast.error(errorMessage);
        }
      } else if (error.message && error.message.includes('Customer ID not returned')) {
        toast.warning('Customer created successfully, but the system could not process the ID. Please try again.');
      } else if (error.message && error.message.includes('Network Error')) {
        toast.error('Network connection error. Please check your internet connection and try again.');
      } else if (error.response?.status === 500) {
        toast.error('Server error. Our team has been notified. Please try again later.');
      } else if (error.message) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }

      // Still set submitError for the form error display
      if (error.response?.data?.message) {
        setSubmitError(`API Error: ${error.response.data.message}`);
      } else if (error.message) {
        setSubmitError(error.message);
      } else {
        setSubmitError('Network error. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCardNumber = (value: string) => {
    // Remove all non-digits and limit to 16 characters
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits;
  };

  const formatExpiryDate = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');

    // Add slash after 2 digits
    if (digits.length >= 2) {
      return digits.slice(0, 2) + '/' + digits.slice(2, 4);
    }
    return digits;
  };


  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <LoadingButton
            variant="ghost"
            loading={loadingStates[isCartCheckout ? '/cart' : '/']}
            onClick={() => {
              setIsRedirecting(true);
              navigateWithLoading(isCartCheckout ? '/cart' : '/', isCartCheckout ? '/cart' : '/');
            }}
            loadingText={isCartCheckout ? 'Going back to cart...' : 'Going back to products...'}
            className="mb-4 cursor-pointer transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {isCartCheckout ? 'Back to Cart' : 'Back to Products'}
          </LoadingButton>
          <h1 className="heading-1">Checkout</h1>
          <p className="body-small mt-2">Complete your purchase securely</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Customer Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="heading-3">Customer Information</CardTitle>
                    <CardDescription className="body-small">
                      Please provide your contact and shipping details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="john@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="+1 (555) 123-4567" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main Street" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="New York" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input placeholder="NY" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ZIP Code</FormLabel>
                            <FormControl>
                              <Input placeholder="10001" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="heading-3 flex items-center">
                      <CreditCard className="mr-2 h-5 w-5" />
                      Payment Information
                    </CardTitle>
                    <CardDescription className="body-small">
                      Enter your payment details. For testing: use card ending in 1 (approved), 2 (declined), or 3 (error)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="cardNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Card Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="1234567890123456"
                              {...field}
                              onChange={(e) => {
                                const formatted = formatCardNumber(e.target.value);
                                field.onChange(formatted);
                              }}
                              maxLength={16}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="expiryDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expiry Date</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="MM/YY"
                                {...field}
                                onChange={(e) => {
                                  const formatted = formatExpiryDate(e.target.value);
                                  field.onChange(formatted);
                                }}
                                maxLength={5}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="cvv"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CVV</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="123"
                                {...field}
                                onChange={(e) => {
                                  const digits = e.target.value.replace(/\D/g, '').slice(0, 3);
                                  field.onChange(digits);
                                }}
                                maxLength={3}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 cursor-pointer transition-colors"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Complete Purchase - $${total.toFixed(2)}`
                  )}
                </Button>
              </form>
            </Form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="heading-3">Order Summary</CardTitle>
                <CardDescription className="body-small">
                  {checkoutItems.length} {checkoutItems.length === 1 ? 'item' : 'items'} in your order
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Product List */}
                <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                  {checkoutItems.map((item, index) => (
                    <div key={`item-${index}-${item.productId}`} className="flex items-center space-x-4 pb-3 border-b">
                      {/* Product Image */}
                      <div className="relative w-16 h-16 bg-white flex-shrink-0 checkout-thumbnail">
                        {('image' in item && typeof item.image === 'string' && item.image) ? (
                          <Image
                            src={item.image}
                            alt={item.productName || 'Product Image'}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <ShoppingCart className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm text-foreground">{item.productName}</h3>
                        <p className="caption">
                          {item.selectedColor} • {item.selectedSize}
                        </p>
                        <div className="flex justify-between items-center mt-1">
                          <p className="caption">Qty: {item.quantity}</p>
                          <p className="font-medium text-primary tracking-tight">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Totals */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="body-small">Subtotal</span>
                    <span className="body-large">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="body-small">Tax (8%)</span>
                    <span className="body-large">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span className="body-large font-semibold">Total</span>
                    <span className="text-primary font-bold tracking-tight">${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
