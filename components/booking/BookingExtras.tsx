'use client';

import { Shield, Navigation, Baby, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Checkbox } from '@/components/ui';
import { useBooking } from '@/lib/context';
import { EXTRAS_PRICING } from '@/types';
import { formatCurrency } from '@/lib/utils';

const extras = [
  {
    key: 'insurance' as const,
    icon: Shield,
    name: 'Insurance Coverage',
    description: 'Full coverage for damage and theft protection',
    price: EXTRAS_PRICING.insurance,
  },
  {
    key: 'gps' as const,
    icon: Navigation,
    name: 'GPS Navigation',
    description: 'Portable GPS device with updated maps',
    price: EXTRAS_PRICING.gps,
  },
  {
    key: 'childSeat' as const,
    icon: Baby,
    name: 'Child Seat',
    description: 'Safety-certified child car seat',
    price: EXTRAS_PRICING.childSeat,
  },
  {
    key: 'additionalDriver' as const,
    icon: Users,
    name: 'Additional Driver',
    description: 'Add another authorized driver to your rental',
    price: EXTRAS_PRICING.additionalDriver,
  },
];

export function BookingExtras() {
  const { extras: selectedExtras, setExtras, calculatePrice } = useBooking();

  const toggleExtra = (key: keyof typeof selectedExtras) => {
    const newExtras = { ...selectedExtras, [key]: !selectedExtras[key] };
    setExtras(newExtras);
    setTimeout(calculatePrice, 0);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Optional Extras</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {extras.map((extra) => (
          <label
            key={extra.key}
            className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <input
              type="checkbox"
              checked={selectedExtras[extra.key]}
              onChange={() => toggleExtra(extra.key)}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <extra.icon className="h-4 w-4 text-gray-400" />
                <span className="font-medium text-gray-900 text-sm">{extra.name}</span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{extra.description}</p>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {formatCurrency(extra.price)}/day
            </span>
          </label>
        ))}
      </CardContent>
    </Card>
  );
}
