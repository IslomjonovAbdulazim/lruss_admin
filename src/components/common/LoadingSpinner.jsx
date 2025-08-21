import React from 'react';

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'primary', 
  text = null,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-error',
    white: 'text-white',
    gray: 'text-gray-500'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div 
        className={`
          animate-spin rounded-full border-2 border-current border-t-transparent
          ${sizeClasses[size]} 
          ${colorClasses[color]}
        `}
        role="status"
        aria-label="Yuklanmoqda"
      >
        <span className="sr-only">Yuklanmoqda...</span>
      </div>
      
      {text && (
        <p className={`mt-2 text-sm ${colorClasses[color]}`}>
          {text}
        </p>
      )}
    </div>
  );
};

// Skeleton loading component for content
export const SkeletonLoader = ({ 
  lines = 3, 
  showTitle = false,
  showButton = false,
  className = '' 
}) => {
  return (
    <div className={`animate-fade-in ${className}`}>
      {showTitle && (
        <div className="skeleton skeleton-title mb-4"></div>
      )}
      
      {Array.from({ length: lines }).map((_, index) => (
        <div 
          key={index}
          className="skeleton skeleton-text"
          style={{ 
            width: `${Math.random() * 40 + 60}%`,
            marginBottom: index === lines - 1 ? '0' : 'var(--space-2)' 
          }}
        ></div>
      ))}
      
      {showButton && (
        <div className="skeleton skeleton-button mt-4"></div>
      )}
    </div>
  );
};

// Card skeleton loader
export const CardSkeleton = ({ count = 1, className = '' }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={`card card-body ${className}`}>
          <SkeletonLoader lines={2} showTitle={true} showButton={true} />
        </div>
      ))}
    </>
  );
};

// Table skeleton loader
export const TableSkeleton = ({ 
  rows = 5, 
  columns = 4,
  showHeader = true,
  className = '' 
}) => {
  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      {showHeader && (
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <div className="flex gap-4">
            {Array.from({ length: columns }).map((_, index) => (
              <div 
                key={index}
                className="skeleton skeleton-text flex-1"
                style={{ height: '1rem' }}
              ></div>
            ))}
          </div>
        </div>
      )}
      
      <div className="divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="px-6 py-4">
            <div className="flex gap-4">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div 
                  key={colIndex}
                  className="skeleton skeleton-text flex-1"
                  style={{ 
                    height: '1rem',
                    width: colIndex === 0 ? '40%' : '100%'
                  }}
                ></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Full page loading overlay
export const LoadingOverlay = ({ 
  isVisible = true, 
  text = 'Yuklanmoqda...',
  backdrop = true 
}) => {
  if (!isVisible) return null;

  return (
    <div 
      className={`
        fixed inset-0 z-50 flex items-center justify-center
        ${backdrop ? 'bg-black bg-opacity-50 backdrop-blur-sm' : ''}
      `}
    >
      <div className="bg-white rounded-xl p-8 shadow-2xl max-w-sm w-full mx-4">
        <LoadingSpinner size="xl" color="primary" text={text} />
      </div>
    </div>
  );
};

export default LoadingSpinner;