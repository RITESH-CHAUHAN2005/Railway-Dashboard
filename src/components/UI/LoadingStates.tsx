import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Train, RefreshCw, Wifi } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <RefreshCw className={`animate-spin text-primary ${sizeClasses[size]} ${className}`} />
  );
};

export const TrainLoadingSkeleton: React.FC = () => (
  <div className="railway-card p-4 space-y-3">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <div>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
    <div className="grid grid-cols-3 gap-2">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
    </div>
  </div>
);

export const DashboardLoadingSkeleton: React.FC = () => (
  <div className="p-6 space-y-6">
    {/* Header skeleton */}
    <div className="flex items-center justify-between">
      <div>
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
      </div>
    </div>

    {/* Main content skeleton */}
    <div className="grid grid-cols-12 gap-6">
      {/* Train status section */}
      <div className="col-span-5 space-y-4">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-10 w-full" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <TrainLoadingSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* AI recommendations */}
      <div className="col-span-4">
        <div className="railway-card p-6 space-y-4">
          <Skeleton className="h-6 w-40" />
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance metrics */}
      <div className="col-span-3">
        <div className="railway-card p-6 space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center space-y-2">
                <Skeleton className="h-8 w-12 mx-auto" />
                <Skeleton className="h-3 w-16 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Map skeleton */}
      <div className="col-span-12 mt-6">
        <div className="railway-card p-6">
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </div>
    </div>
  </div>
);

interface ConnectionStatusProps {
  isConnected: boolean;
  isReconnecting?: boolean;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ 
  isConnected, 
  isReconnecting = false 
}) => {
  if (isConnected && !isReconnecting) {
    return (
      <div className="flex items-center gap-2 text-status-ontime">
        <Wifi className="h-4 w-4" />
        <span className="text-sm">Connected</span>
      </div>
    );
  }

  if (isReconnecting) {
    return (
      <div className="flex items-center gap-2 text-status-warning">
        <LoadingSpinner size="sm" />
        <span className="text-sm">Reconnecting...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-status-delayed">
      <Wifi className="h-4 w-4" />
      <span className="text-sm">Disconnected</span>
    </div>
  );
};

interface TrainLoadingProps {
  message?: string;
}

export const TrainLoading: React.FC<TrainLoadingProps> = ({ 
  message = "Loading train data..." 
}) => (
  <div className="flex flex-col items-center justify-center py-12 space-y-4">
    <div className="relative">
      <Train className="h-12 w-12 text-primary animate-pulse" />
      <div className="absolute -bottom-2 -right-2">
        <LoadingSpinner size="sm" />
      </div>
    </div>
    <div className="text-center">
      <h3 className="text-lg font-medium text-foreground">{message}</h3>
      <p className="text-sm text-muted-foreground">
        Fetching real-time railway data...
      </p>
    </div>
  </div>
);

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Something went wrong",
  message = "Failed to load data. Please try again.",
  onRetry
}) => (
  <div className="flex flex-col items-center justify-center py-12 space-y-4">
    <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center">
      <Train className="h-8 w-8 text-destructive" />
    </div>
    <div className="text-center">
      <h3 className="text-lg font-medium text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      )}
    </div>
  </div>
);