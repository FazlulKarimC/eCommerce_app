import { forwardRef } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LoadingButtonProps extends React.ComponentProps<"button">, 
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
  spinnerClassName?: string;
}

const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ 
    loading = false, 
    loadingText, 
    children, 
    disabled, 
    className,
    spinnerClassName,
    ...props 
  }, ref) => {
    return (
      <Button 
        ref={ref}
        disabled={loading || disabled} 
        className={cn(className)}
        {...props}
      >
        {loading && (
          <Loader2 
            className={cn(
              "mr-2 h-4 w-4 animate-spin", 
              spinnerClassName
            )} 
          />
        )}
        {loading && loadingText ? loadingText : children}
      </Button>
    );
  }
);

LoadingButton.displayName = 'LoadingButton';

export { LoadingButton };