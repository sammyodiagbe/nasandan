import { randomBytes } from 'crypto';
import { supabaseAdmin } from '@/lib/supabase-server';

// Generate a secure random token
export function generateSecureToken(): string {
  return randomBytes(32).toString('hex');
}

// Generate confirmation number in format NR-YYYY-XXXX
export function generateConfirmationNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `NR-${year}-${random}`;
}

// Create confirm and decline tokens for a booking
export async function createBookingTokens(bookingId: string): Promise<{
  confirmToken: string;
  declineToken: string;
} | null> {
  const confirmToken = generateSecureToken();
  const declineToken = generateSecureToken();

  const { error } = await supabaseAdmin
    .from('booking_tokens')
    .insert([
      {
        booking_id: bookingId,
        token: confirmToken,
        action: 'confirm',
      },
      {
        booking_id: bookingId,
        token: declineToken,
        action: 'decline',
      },
    ]);

  if (error) {
    console.error('Error creating booking tokens:', error);
    return null;
  }

  return { confirmToken, declineToken };
}

// Get the base URL for building confirmation links
function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
}

// Build confirmation URLs
export function buildConfirmationUrls(confirmToken: string, declineToken: string): {
  confirmUrl: string;
  declineUrl: string;
} {
  const baseUrl = getBaseUrl();
  return {
    confirmUrl: `${baseUrl}/api/confirm/${confirmToken}`,
    declineUrl: `${baseUrl}/api/confirm/${declineToken}`,
  };
}

// Validate and process a token
export async function processToken(token: string): Promise<{
  success: boolean;
  action?: 'confirm' | 'decline';
  bookingId?: string;
  confirmationNumber?: string;
  error?: string;
}> {
  // Find the token
  const { data: tokenData, error: tokenError } = await supabaseAdmin
    .from('booking_tokens')
    .select('*, bookings(id, confirmation_number, status)')
    .eq('token', token)
    .single();

  if (tokenError || !tokenData) {
    return { success: false, error: 'Invalid or expired token' };
  }

  // Check if already used
  if (tokenData.used_at) {
    return { success: false, error: 'This link has already been used' };
  }

  // Check if expired
  if (new Date(tokenData.expires_at) < new Date()) {
    return { success: false, error: 'This link has expired' };
  }

  // Check booking status
  const booking = tokenData.bookings as { id: string; confirmation_number: string; status: string };
  if (booking.status !== 'pending') {
    return {
      success: false,
      error: `This booking has already been ${booking.status}`
    };
  }

  // Mark token as used
  await supabaseAdmin
    .from('booking_tokens')
    .update({ used_at: new Date().toISOString() })
    .eq('id', tokenData.id);

  // Update booking status
  const newStatus = tokenData.action === 'confirm' ? 'confirmed' : 'cancelled';
  const updateData: Record<string, string> = {
    status: newStatus,
    updated_at: new Date().toISOString(),
  };

  if (tokenData.action === 'confirm') {
    updateData.confirmed_at = new Date().toISOString();
  } else {
    updateData.declined_at = new Date().toISOString();
  }

  const { error: updateError } = await supabaseAdmin
    .from('bookings')
    .update(updateData)
    .eq('id', tokenData.booking_id);

  if (updateError) {
    console.error('Error updating booking status:', updateError);
    return { success: false, error: 'Failed to update booking status' };
  }

  // Invalidate the other token for this booking
  await supabaseAdmin
    .from('booking_tokens')
    .update({ used_at: new Date().toISOString() })
    .eq('booking_id', tokenData.booking_id)
    .neq('id', tokenData.id);

  return {
    success: true,
    action: tokenData.action,
    bookingId: tokenData.booking_id,
    confirmationNumber: booking.confirmation_number,
  };
}
