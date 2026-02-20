import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BookingStep } from '@/lib/context';

interface BookingStepsProps {
  currentStep: BookingStep;
}

const steps = [
  { id: 'select-dates', label: 'Select Dates' },
  { id: 'customer-info', label: 'Your Info' },
  { id: 'review', label: 'Review' },
  { id: 'confirmation', label: 'Confirmation' },
] as const;

export function BookingSteps({ currentStep }: BookingStepsProps) {
  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <nav className="mb-8">
      <ol className="flex items-center justify-center gap-2">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <li key={step.id} className="flex items-center">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                    isCompleted && 'bg-blue-600 text-white',
                    isCurrent && 'bg-blue-600 text-white ring-4 ring-blue-100',
                    !isCompleted && !isCurrent && 'bg-gray-100 text-gray-400'
                  )}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
                </div>
                <span
                  className={cn(
                    'text-sm font-medium hidden sm:block',
                    isCurrent && 'text-gray-900',
                    !isCurrent && 'text-gray-400'
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'w-8 sm:w-16 h-0.5 mx-2',
                    index < currentIndex ? 'bg-blue-600' : 'bg-gray-200'
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
