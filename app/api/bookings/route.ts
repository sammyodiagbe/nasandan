import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase-server';
import { notifyAdminOfBooking, generateConfirmationNumber } from '@/lib/notifications';

// Request validation schema
const createBookingSchema = z.object({
  vehicleId: z.string().uuid('Invalid vehicle ID'),
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  customerEmail: z.string().email('Invalid email address'),
  customerPhone: z.string().min(10, 'Phone number must be at least 10 digits'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  pickupTime: z.string().default('10:00'),
  returnTime: z.string().default('10:00'),
  totalPrice: z.number().positive('Total price must be positive'),
  notes: z.string().optional(),
  customerAge: z.number().int().min(18).max(120).optional(),
  hasFullLicense: z.boolean().default(true),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validationResult = createBookingSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Check if vehicle exists and is available
    const { data: vehicle, error: vehicleError } = await supabaseAdmin
      .from('cars')
      .select('id, make, model, year, color, available')
      .eq('id', data.vehicleId)
      .single();

    if (vehicleError || !vehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }

    if (!vehicle.available) {
      return NextResponse.json(
        { error: 'Vehicle is not available' },
        { status: 400 }
      );
    }

    // Check for overlapping bookings
    const { data: overlappingBookings } = await supabaseAdmin
      .from('bookings')
      .select('id')
      .eq('car_id', data.vehicleId)
      .in('status', ['pending', 'confirmed', 'active'])
      .or(`and(start_date.lte.${data.endDate},end_date.gte.${data.startDate})`);

    if (overlappingBookings && overlappingBookings.length > 0) {
      return NextResponse.json(
        { error: 'Vehicle is not available for the selected dates' },
        { status: 400 }
      );
    }

    // Generate confirmation number
    const confirmationNumber = generateConfirmationNumber();

    // Create booking with status 'pending'
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .insert({
        car_id: data.vehicleId,
        customer_name: data.customerName,
        customer_email: data.customerEmail,
        customer_phone: data.customerPhone,
        start_date: data.startDate,
        end_date: data.endDate,
        pickup_time: data.pickupTime,
        return_time: data.returnTime,
        total_price: data.totalPrice,
        notes: data.notes || null,
        customer_age: data.customerAge || null,
        has_full_license: data.hasFullLicense,
        status: 'pending',
        confirmation_number: confirmationNumber,
      })
      .select('id')
      .single();

    if (bookingError || !booking) {
      console.error('Error creating booking:', bookingError);
      return NextResponse.json(
        { error: 'Failed to create booking' },
        { status: 500 }
      );
    }

    // Send notifications to admin (SMS + Email)
    const vehicleInfo = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
    const notificationResult = await notifyAdminOfBooking({
      bookingId: booking.id,
      confirmationNumber,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      vehicleInfo,
      vehicleColor: vehicle.color,
      startDate: data.startDate,
      endDate: data.endDate,
      pickupTime: data.pickupTime,
      returnTime: data.returnTime,
      totalPrice: data.totalPrice,
      notes: data.notes,
    });

    // Log notification status but don't fail the booking
    if (!notificationResult.success) {
      console.warn('Notification issues:', notificationResult.errors);
    }

    return NextResponse.json({
      success: true,
      confirmationNumber,
      bookingId: booking.id,
      notificationsSent: {
        sms: notificationResult.smsSuccess,
        email: notificationResult.emailSuccess,
      },
    });
  } catch (error) {
    console.error('Unexpected error in booking creation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET: Fetch bookings (for admin dashboard)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = supabaseAdmin
      .from('bookings')
      .select(`
        *,
        cars (
          id,
          make,
          model,
          year,
          color,
          price_per_day,
          image_url
        )
      `)
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: bookings, error } = await query;

    if (error) {
      console.error('Error fetching bookings:', error);
      return NextResponse.json(
        { error: 'Failed to fetch bookings' },
        { status: 500 }
      );
    }

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('Unexpected error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
