import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import type { BookingPricing, Vehicle } from '@/types';

interface PriceBreakdownProps {
  vehicle: Vehicle;
  pricing: BookingPricing;
}

export function PriceBreakdown({ vehicle, pricing }: PriceBreakdownProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Price Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Vehicle */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">
            {vehicle.make} {vehicle.model} x {pricing.numberOfDays} {pricing.numberOfDays === 1 ? 'day' : 'days'}
          </span>
          <span className="text-gray-900">
            {formatCurrency(pricing.dailyRate * pricing.numberOfDays)}
          </span>
        </div>

        {/* Extras */}
        {pricing.fees.map((fee) => (
          <div key={fee.name} className="flex justify-between text-sm">
            <span className="text-gray-600">{fee.name}</span>
            <span className="text-gray-900">{formatCurrency(fee.amount)}</span>
          </div>
        ))}

        {/* Subtotal */}
        <div className="flex justify-between text-sm pt-3 border-t border-gray-100">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-gray-900">{formatCurrency(pricing.subtotal)}</span>
        </div>

        {/* Tax */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax ({(pricing.taxRate * 100).toFixed(1)}%)</span>
          <span className="text-gray-900">{formatCurrency(pricing.taxAmount)}</span>
        </div>

        {/* Total */}
        <div className="flex justify-between pt-3 border-t border-gray-200">
          <span className="font-semibold text-gray-900">Total</span>
          <span className="font-bold text-lg text-blue-600">
            {formatCurrency(pricing.total)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
