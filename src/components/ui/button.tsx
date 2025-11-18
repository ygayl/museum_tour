import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'default', ...props }, ref) => {
    // Base styles
    const baseStyles =
      'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-museum-terracotta-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

    // Variant styles
    const variantStyles = {
      default:
        'bg-museum-terracotta-500 text-white hover:bg-museum-terracotta-600 active:bg-museum-terracotta-700 shadow-md hover:shadow-lg',
      outline:
        'border border-museum-terracotta-500 text-museum-terracotta-600 bg-transparent hover:bg-museum-terracotta-50 active:bg-museum-terracotta-100',
      ghost:
        'text-museum-primary-700 hover:bg-museum-neutral-100 hover:text-museum-primary-900',
      secondary:
        'bg-museum-neutral-200 text-museum-primary-900 hover:bg-museum-neutral-300 active:bg-museum-neutral-400',
    };

    // Size styles
    const sizeStyles = {
      default: 'h-10 px-6 py-2 text-base',
      sm: 'h-8 px-4 py-1.5 text-sm',
      lg: 'h-12 px-8 py-3 text-lg',
      icon: 'h-10 w-10 p-0',
    };

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

    return <button className={combinedClassName} ref={ref} {...props} />;
  }
);

Button.displayName = 'Button';

export { Button };
