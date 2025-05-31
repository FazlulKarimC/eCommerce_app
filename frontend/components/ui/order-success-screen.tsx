'use client';

import { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';
import ReactConfetti from 'react-confetti';

interface OrderSuccessScreenProps {
  orderNumber: string;
  onComplete: () => void;
}

export const OrderSuccessScreen = ({ orderNumber, onComplete }: OrderSuccessScreenProps) => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });
  const [showConfetti, setShowConfetti] = useState(true);

  // Update window size for confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Set initial size
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Auto-redirect after animation
    const timer = setTimeout(() => {
      setShowConfetti(false);
      // Give time for confetti to fade out
      setTimeout(onComplete, 500);
    }, 3000);

    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [onComplete]);

  // Check if user prefers reduced motion
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center z-50 animate-fade-in">
      {showConfetti && !prefersReducedMotion && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={true}
          numberOfPieces={200}
          gravity={0.15}
          colors={['#ffffff', '#f9fafb', '#d1fae5', '#10b981', '#059669']}
        />
      )}

      <div className="text-center text-white px-4">
        {/* Animated Checkmark */}
        <div className="mb-8">
          <CheckCircle className="h-24 w-24 mx-auto animate-bounce text-white" />
        </div>

        {/* Success Message */}
        <h1 className="text-4xl font-bold mb-4 animate-fade-in-up">
          Order Successful!
        </h1>

        {/* Order Number */}
        <p className="text-xl opacity-90 animate-fade-in-up-delay">
          Order #{orderNumber}
        </p>

        {/* Subtext */}
        <p className="mt-6 text-white/80 max-w-md mx-auto animate-fade-in-up-delay-2">
          Thank you for your purchase! We're preparing your order and will redirect you to the confirmation page shortly.
        </p>
      </div>
    </div>
  );
};