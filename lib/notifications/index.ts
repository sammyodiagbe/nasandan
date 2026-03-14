import { createBookingTokens, buildConfirmationUrls } from './tokens';
import { sendBookingSms, type BookingSmsData } from './sms';
import { sendBookingEmail, type BookingEmailData } from './email';
import { supabaseAdmin } from '@/lib/supabase-server';

export interface NotifyAdminParams {
  bookingId: string;
  confirmationNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  vehicleInfo: string;
  vehicleColor: string;
  startDate: string;
  endDate: string;
  pickupTime: string;
  returnTime: string;
  totalPrice: number;
  notes?: string;
}

export interface NotificationResult {
  success: boolean;
  smsSuccess: boolean;
  emailSuccess: boolean;
  smsMessageId?: string;
  emailMessageId?: string;
  errors: string[];
}

// Main orchestrator function - sends both SMS and email notifications
export async function notifyAdminOfBooking(params: NotifyAdminParams): Promise<NotificationResult> {
  const result: NotificationResult = {
    success: false,
    smsSuccess: false,
    emailSuccess: false,
    errors: [],
  };

  // 1. Create confirmation tokens
  const tokens = await createBookingTokens(params.bookingId);
  if (!tokens) {
    result.errors.push('Failed to create confirmation tokens');
    return result;
  }

  // 2. Build confirmation URLs
  const { confirmUrl, declineUrl } = buildConfirmationUrls(
    tokens.confirmToken,
    tokens.declineToken
  );

  // 3. Prepare notification data
  const smsData: BookingSmsData = {
    confirmationNumber: params.confirmationNumber,
    customerName: params.customerName,
    customerPhone: params.customerPhone,
    vehicleInfo: params.vehicleInfo,
    startDate: params.startDate,
    endDate: params.endDate,
    totalPrice: params.totalPrice,
    confirmUrl,
    declineUrl,
  };

  const emailData: BookingEmailData = {
    ...params,
    confirmUrl,
    declineUrl,
  };

  // 4. Send notifications in parallel
  const [smsResult, emailResult] = await Promise.all([
    sendBookingSms(smsData),
    sendBookingEmail(emailData),
  ]);

  // 5. Update booking with notification status
  await supabaseAdmin
    .from('bookings')
    .update({ admin_notified_at: new Date().toISOString() })
    .eq('id', params.bookingId);

  // 6. Compile results
  result.smsSuccess = smsResult.success;
  result.emailSuccess = emailResult.success;
  result.smsMessageId = smsResult.messageId;
  result.emailMessageId = emailResult.messageId;

  if (!smsResult.success && smsResult.error) {
    result.errors.push(`SMS: ${smsResult.error}`);
  }
  if (!emailResult.success && emailResult.error) {
    result.errors.push(`Email: ${emailResult.error}`);
  }

  // Consider success if at least one notification was sent
  result.success = result.smsSuccess || result.emailSuccess;

  return result;
}

// Re-export for convenience
export { processToken } from './tokens';
export { generateConfirmationNumber } from './tokens';
