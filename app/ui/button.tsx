import clsx from 'clsx';
import { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  primaryColor?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { 
      children, 
      className, 
      variant = 'primary', 
      size = 'md', 
      isLoading = false,
      disabled,
      primaryColor,
      ...rest 
    }, 
    ref
  ) => {
    const baseClasses = clsx(
      'flex items-center justify-center rounded-lg font-medium transition-colors',
      'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
      'aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
      {
        // Variants
        'bg-blue-500 text-white hover:bg-blue-400 active:bg-blue-600 focus-visible:outline-blue-500': 
          variant === 'primary' && !primaryColor,
        'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300 focus-visible:outline-gray-500': 
          variant === 'secondary',
        'border border-gray-300 bg-transparent hover:bg-gray-50 active:bg-gray-100 focus-visible:outline-gray-500': 
          variant === 'outline',
        'bg-transparent hover:bg-gray-100 active:bg-gray-200 focus-visible:outline-gray-500': 
          variant === 'ghost',
        
        // Sizes
        'h-8 px-3 text-sm': size === 'sm',
        'h-10 px-4 text-sm': size === 'md',
        'h-12 px-6 text-base': size === 'lg',
        
        // Loading state
        'pointer-events-none': isLoading,
      },
      className
    );

    return (
      <button
        ref={ref}
        className={baseClasses}
        disabled={disabled || isLoading}
        aria-disabled={disabled || isLoading}
        style={primaryColor ? { backgroundColor: primaryColor } : undefined}
        {...rest}
      >
        {isLoading && (
          <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';