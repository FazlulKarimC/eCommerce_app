'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertTriangle, ArrowLeft, Home } from 'lucide-react';
import { Order } from '@/lib/types';

interface ThankYouPageProps {
  params: {
    orderNumber: string;
  };
}

export default function ThankYouPage({ params }: ThankYouPageProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const router = useRouter();

  useEffect(() => {
    fetchOrder();
  }, [params.orderNumber]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders?orderNumber=${params.orderNumber}`);
      const data = await response.json();

      if (data.success) {
        setOrder(data.data);
      } else {
        setError(data.error || 'Order not found');
      }
    } catch (err) {
      setError('Failed to load order details');
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
            <p className="text-gray-600 mb-6">{error || 'The order you\'re looking for could not be found.'}</p>
            <Button onClick={() => router.push('/')} className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Return to Store
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusInfo = getStatusMessage(order.transactionStatus);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Status Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            {getStatusIcon(order.transactionStatus)}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{statusInfo.title}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">{statusInfo.message}</p>
        </div>

        {/* Status Alert */}
        <div className={`${statusInfo.bgColor} ${statusInfo.borderColor} border rounded-lg p-4 mb-8`}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {getStatusIcon(order.transactionStatus)}
            </div>
            <div className="ml-4">
              <h3 className={`text-lg font-medium ${statusInfo.textColor}`}>
                Order #{order.orderNumber}
              </h3>
              <p className={`mt-1 ${statusInfo.textColor}`}>
                {order.transactionStatus === 'approved' 
                  ? 'Your order is being prepared for shipment.'
                  : order.transactionStatus === 'declined'
                  ? 'Please update your payment method and try again.'
                  : 'Our team has been notified and will resolve this issue.'
                }
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
              <CardDescription>Order #{order.orderNumber}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4 pb-4 border-b">
                <div className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0"></div>
                <div className="flex-1">
                  <h3 className="font-semibold">{order.productDetails.productName}</h3>
                  <p className="text-sm text-gray-600">
                    Color: {order.productDetails.selectedColor}
                  </p>
                  <p className="text-sm text-gray-600">
                    Size: {order.productDetails.selectedSize}
                  </p>
                  <p className="text-sm text-gray-600">
                    Quantity: {order.productDetails.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${order.total.toFixed(2)}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${(order.productDetails.price * order.productDetails.quantity).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${(order.total - (order.productDetails.price * order.productDetails.quantity)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600">
                  Order placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm text-gray-700">Contact Details</h4>
                  <p className="text-sm">{order.customerInfo.fullName}</p>
                  <p className="text-sm text-gray-600">{order.customerInfo.email}</p>
                  <p className="text-sm text-gray-600">{order.customerInfo.phone}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-gray-700">Shipping Address</h4>
                  <p className="text-sm">{order.customerInfo.address}</p>
                  <p className="text-sm text-gray-600">
                    {order.customerInfo.city}, {order.customerInfo.state} {order.customerInfo.zipCode}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="text-gray-600">Card:</span> {order.paymentInfo.cardNumber}
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-600">Expires:</span> {order.paymentInfo.expiryDate}
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-600">Status:</span> 
                    <span className={`ml-1 capitalize ${
                      order.transactionStatus === 'approved' ? 'text-green-600' :
                      order.transactionStatus === 'declined' ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      {order.transactionStatus}
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="outline"
            onClick={() => router.push('/')}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Button>
          
          {order.transactionStatus !== 'approved' && (
            <Button
              onClick={() => router.push('/checkout')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Try Again
            </Button>
          )}
        </div>

        {/* Additional Information */}
        {order.transactionStatus === 'approved' && (
          <div className="mt-8 text-center">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">What's Next?</h3>
                <p className="text-gray-600 mb-4">
                  You'll receive an email confirmation shortly with your order details and tracking information once your item ships.
                </p>
                <p className="text-sm text-gray-500">
                  Questions? Contact our support team at support@example.com
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
