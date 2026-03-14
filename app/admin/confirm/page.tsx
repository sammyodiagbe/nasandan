'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { Suspense } from 'react';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const booking = searchParams.get('booking');
  const message = searchParams.get('message');

  // Determine content based on status
  const getContent = () => {
    switch (status) {
      case 'confirmed':
        return {
          icon: CheckCircle,
          iconColor: 'text-emerald-500',
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-200',
          title: 'Booking Confirmed!',
          subtitle: booking ? `Booking ${booking} has been confirmed.` : 'The booking has been confirmed.',
          description: 'The customer will be notified that their reservation is confirmed.',
        };
      case 'declined':
        return {
          icon: XCircle,
          iconColor: 'text-red-500',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          title: 'Booking Declined',
          subtitle: booking ? `Booking ${booking} has been declined.` : 'The booking has been declined.',
          description: 'The booking has been cancelled. The customer may submit a new booking request.',
        };
      case 'error':
      default:
        return {
          icon: AlertCircle,
          iconColor: 'text-amber-500',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          title: 'Unable to Process',
          subtitle: message || 'Something went wrong processing this request.',
          description: 'Please check the admin dashboard for the current booking status.',
        };
    }
  };

  const content = getContent();
  const Icon = content.icon;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className={`bg-white rounded-2xl shadow-lg overflow-hidden ${content.borderColor} border`}>
          {/* Status Header */}
          <div className={`${content.bgColor} p-8 text-center`}>
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-md mb-4">
              <Icon className={`h-10 w-10 ${content.iconColor}`} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {content.title}
            </h1>
            <p className="text-gray-600">
              {content.subtitle}
            </p>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Info Box */}
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 text-center">
                {content.description}
              </p>
            </div>

            {/* Booking Reference */}
            {booking && (
              <div className="text-center">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                  Booking Reference
                </p>
                <p className="font-mono text-lg font-semibold text-gray-900">
                  {booking}
                </p>
              </div>
            )}

            {/* Dashboard Link */}
            <Link
              href="/admin/bookings"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-[#0c2340] text-white rounded-xl font-medium hover:bg-[#0c2340]/90 transition-colors"
            >
              View All Bookings
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Nas & Dan Rentals - Admin Portal
        </p>
      </div>
    </div>
  );
}

export default function AdminConfirmPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}
