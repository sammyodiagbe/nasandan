import { Car } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function Logo({ className, size = 'md', showText = true }: LogoProps) {
  const sizes = {
    sm: { icon: 'h-6 w-6', text: 'text-lg' },
    md: { icon: 'h-8 w-8', text: 'text-xl' },
    lg: { icon: 'h-10 w-10', text: 'text-2xl' },
  };

  return (
    <Link href="/" className={cn('flex items-center gap-2', className)}>
      <div className="bg-blue-600 text-white p-2 rounded-lg">
        <Car className={sizes[size].icon} />
      </div>
      {showText && (
        <span className={cn('font-bold text-gray-900', sizes[size].text)}>
          Nasandan<span className="text-blue-600">Rentals</span>
        </span>
      )}
    </Link>
  );
}
