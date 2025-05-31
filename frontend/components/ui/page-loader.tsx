import { Loader2 } from 'lucide-react';

interface PageLoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const PageLoader = ({ 
  message = "Loading...", 
  size = 'md' 
}: PageLoaderProps) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12', 
    lg: 'h-16 w-16'
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className={`animate-spin ${sizeClasses[size]} text-primary mx-auto mb-4`} />
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};