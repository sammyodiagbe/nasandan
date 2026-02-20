'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, id, ...props }, ref) => {
    const checkboxId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <div className="relative">
            <input
              ref={ref}
              type="checkbox"
              id={checkboxId}
              className={cn(
                'peer h-4 w-4 rounded border border-gray-300 bg-white appearance-none',
                'checked:bg-blue-600 checked:border-blue-600',
                'focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0 focus:outline-none',
                'disabled:bg-gray-100 disabled:cursor-not-allowed',
                'transition-colors cursor-pointer',
                className
              )}
              {...props}
            />
            <Check className="absolute top-0.5 left-0.5 h-3 w-3 text-white pointer-events-none hidden peer-checked:block" />
          </div>
        </div>
        {(label || description) && (
          <div className="ml-3">
            {label && (
              <label
                htmlFor={checkboxId}
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                {label}
              </label>
            )}
            {description && (
              <p className="text-sm text-gray-500">{description}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };
