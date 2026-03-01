'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  glow?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      glow = false,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'relative inline-flex items-center justify-center font-semibold font-display transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-xl overflow-hidden';

    const variants = {
      primary: 'bg-[#E8AC41] text-white hover:bg-[#D19830] active:bg-[#B8871F] focus-visible:ring-[#E8AC41] shadow-lg shadow-[#E8AC41]/20 hover:shadow-xl hover:shadow-[#E8AC41]/25 hover:-translate-y-0.5',
      secondary: 'bg-slate-100 text-[#0c2340] hover:bg-slate-200 active:bg-slate-300 focus-visible:ring-slate-400',
      outline: 'border-2 border-[#0c2340] bg-transparent text-[#0c2340] hover:bg-[#0c2340] hover:text-white focus-visible:ring-[#0c2340]',
      ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-[#0c2340] focus-visible:ring-slate-400',
      danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-600 shadow-lg shadow-red-600/20',
      gradient: 'bg-[#E8AC41] text-white hover:bg-[#D19830] shadow-lg shadow-[#E8AC41]/20 hover:shadow-xl hover:shadow-[#E8AC41]/25 hover:-translate-y-0.5',
    };

    const sizes = {
      sm: 'h-9 px-4 text-sm gap-1.5',
      md: 'h-11 px-5 text-sm gap-2',
      lg: 'h-12 px-6 text-base gap-2',
      xl: 'h-14 px-8 text-base gap-3',
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          glow && 'btn-glow',
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
