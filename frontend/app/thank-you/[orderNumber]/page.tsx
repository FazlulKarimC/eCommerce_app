'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { LoadingButton } from '@/components/ui/loading-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  ArrowLeft, 
  Home, 
  Package, 
  Truck, 
  CreditCard, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  ShoppingBag 
} from 'lucide-react';
import { PageLoader } from '@/components/ui/page-loader';
import { Order, OrderItem } from '@/lib/types';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { useNavigationLoading } from '@/lib/hooks/useNavigationLoading';

interface ThankYouPageProps {
  params: Promise<{
    orderNumber: string;
  }>;
}

export default function ThankYouPage({ params }: ThankYouPageProps) {
  // Unwrap the params Promise
  const resolvedParams = use(params);
  const orderNumber = resolvedParams.orderNumber;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const router = useRouter();
  const { loadingStates, navigateWithLoading } = useNavigationLoading();

  useEffect(() => {
    fetchOrder();
  }, [orderNumber]);

  const fetchOrder = async () => {
    try {
      setLoading(true);

      // Use the external API endpoint
      const response = await api.get(`https://ecommerce-app-backend-rq2y.onrender.com/api/orders/${orderNumber}`);

      // API returns the order directly, not wrapped in a success/data object
      setOrder(response.data);

    } catch (err: any) {
      console.error('Error fetching order:', err);

      // Handle specific error cases
      if (err.response?.status === 404) {
        setError('Order not found');
        toast.error('Order not found. Please check the order number and try again.');
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
        toast.error(err.response.data.error);
      } else if (err.message) {
        setError(`Error: ${err.message}`);
        toast.error(`Failed to load order: ${err.message}`);
      } else {
        setError('Failed to load order details');
        toast.error('Failed to load order details. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-16 w-16 text-green-500" />;
      case 'declined':
        return <XCircle className="h-16 w-16 text-red-500" />;
      case 'error':
        return <AlertTriangle className="h-16 w-16 text-yellow-500" />;
      default:
        return <CheckCircle className="h-16 w-16 text-green-500" />;
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'approved':
        return {
          title: 'Order Confirmed!',
          message: 'Thank you for your purchase. Your order has been successfully processed and you will receive a confirmation email shortly.',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800'
        };
      case 'declined':
        return {
          title: 'Payment Declined',
          message: 'We\'re sorry, but your payment was declined. Please check your payment details and try again.',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800'
        };
      case 'error':
        return {
          title: 'Payment Error',
          message: 'We encountered a technical issue while processing your payment. Please try again or contact support.',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800'
        };
      default:
        return {
          title: 'Order Processed',
          message: 'Your order has been processed.',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-800'
        };
    }
  };

  // Calculate order totals
  const calculateTotals = (items: OrderItem[]) => {
    const itemsTotal = items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
    return {
      itemsTotal,
      tax: order?.total ? order.total - order.subTotal : 0,
    };
  };

  if (loading) {
    return <PageLoader message="Loading order details..." />;
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="pt-6 text-center">
            <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Order Not Found</h1>
            <p className="text-muted-foreground mb-6">{error || 'The order you\'re looking for could not be found.'}</p>
            <LoadingButton 
              loading={loadingStates['/']}
              onClick={() => navigateWithLoading('/')}
              loadingText="Returning to store..."
              className="w-full"
            >
              <Home className="mr-2 h-4 w-4" />
              Return to Store
            </LoadingButton>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusInfo = getStatusMessage(order.status);
  const { itemsTotal, tax } = calculateTotals(order.items);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Status Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            {getStatusIcon(order.status)}
          </div>
          <h1 className="heading-1 mb-2">{statusInfo.title}</h1>
          <p className="body-large max-w-2xl mx-auto text-muted-foreground">{statusInfo.message}</p>
        </div>

        {/* Order Number and Date */}
        <Card className={`${statusInfo.bgColor} ${statusInfo.borderColor} border mb-8`}>
          <CardContent className="pt-6 pb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="flex-shrink-0">
                  {getStatusIcon(order.status)}
                </div>
                <div className="ml-4">
                  <h3 className={`heading-3 ${statusInfo.textColor}`}>
                    Order #{order.orderNumber}
                  </h3>
                  <p className={`body-small mt-1 ${statusInfo.textColor}`}>
                    {order.status === 'approved' 
                      ? 'Your order is being prepared for shipment.'
                      : order.status === 'declined'
                      ? 'Please update your payment method and try again.'
                      : 'Our team has been notified and will resolve this issue.'
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                <span className="body-small text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <Clock className="h-4 w-4 text-muted-foreground ml-4 mr-2" />
                <span className="body-small text-muted-foreground">
                  {new Date(order.createdAt).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <ShoppingBag className="h-5 w-5 mr-2 text-primary" />
                  <CardTitle>Order Details</CardTitle>
                </div>
                <CardDescription>
                  {order.items.length} {order.items.length === 1 ? 'item' : 'items'} in your order
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Items List */}
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={`${item.productId}-${index}`} className="flex items-start space-x-4 pb-4 border-b">
                      {/* Product Image */}
                      <div className="relative w-20 h-20 bg-white rounded-md flex-shrink-0 border overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{item.title}</h3>
                        <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-1">
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Color:</span> {item.selectedVariants.color}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Size:</span> {item.selectedVariants.size}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Quantity:</span> {item.quantity}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Price:</span> ${item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <p className="font-semibold text-primary">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${order.subTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                    <span>Total</span>
                    <span className="text-primary">${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/30 border-t">
                <div className="w-full flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Package className="h-4 w-4 mr-2" />
                    <span>Estimated delivery: 3-5 business days</span>
                  </div>
                  <div className="flex items-center">
                    <Truck className="h-4 w-4 mr-2" />
                    <span>Standard Shipping</span>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* Customer Information */}
          <div className="space-y-6">
            {/* Customer Details */}
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-primary" />
                  <CardTitle>Customer</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.customer ? (
                  <>
                    <div className="flex items-start space-x-3">
                      <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">{order.customer.name}</p>
                        <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <p className="text-sm">{order.customer.phone}</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm">{order.customer.address}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.customer.city}, {order.customer.state} {order.customer.zipCode}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">Customer information not available</p>
                )}
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-primary" />
                  <CardTitle>Payment</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Card Number</span>
                    <span className="font-medium">
                      •••• •••• •••• {order.cardNumber.slice(-1)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <span className={`font-medium capitalize px-2 py-1 rounded-full text-xs ${
                      order.status === 'approved' ? 'bg-green-100 text-green-800' :
                      order.status === 'declined' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <LoadingButton
            variant="outline"
            loading={loadingStates['/']}
            onClick={() => navigateWithLoading('/')}
            loadingText="Continuing..."
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </LoadingButton>

          {order.status !== 'approved' && (
            <LoadingButton
              loading={loadingStates['/checkout']}
              onClick={() => navigateWithLoading('/checkout')}
              loadingText="Redirecting..."
              className="bg-primary hover:bg-primary/90"
            >
              Try Again
            </LoadingButton>
          )}
        </div>

        {/* Additional Information */}
        {order.status === 'approved' && (
          <div className="mt-8">
            <Card className="shadow-sm">
              <CardContent className="pt-6">
                <h3 className="heading-3 mb-4 text-center">What's Next?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <Mail className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h4 className="font-semibold mb-1">Email Confirmation</h4>
                    <p className="text-sm text-muted-foreground">
                      You'll receive an email with your order details shortly.
                    </p>
                  </div>
                  <div>
                    <Package className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h4 className="font-semibold mb-1">Order Processing</h4>
                    <p className="text-sm text-muted-foreground">
                      Your order is being prepared for shipment.
                    </p>
                  </div>
                  <div>
                    <Truck className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h4 className="font-semibold mb-1">Shipping</h4>
                    <p className="text-sm text-muted-foreground">
                      Estimated delivery in 3-5 business days.
                    </p>
                  </div>
                </div>
                <div className="text-center mt-6 pt-6 border-t">
                  <p className="text-sm text-muted-foreground">
                    Questions? Contact our support team at support@example.com
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
