import twilio from 'twilio';
import { format } from 'date-fns';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const adminPhoneNumber = process.env.ADMIN_PHONE_NUMBER;

// Initialize Twilio client
function getTwilioClient() {
  if (!accountSid || !authToken) {
    console.warn('Twilio credentials not configured');
    return null;
  }
  return twilio(accountSid, authToken);
}

export interface BookingSmsData {
  confirmationNumber: string;
  customerName: string;
  customerPhone: string;
  vehicleInfo: string; // e.g., "2023 Toyota Camry"
  startDate: string;
  endDate: string;
  totalPrice: number;
  confirmUrl: string;
  declineUrl: string;
}

// Format currency for SMS
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

// Format date for SMS
function formatSmsDate(dateStr: string): string {
  return format(new Date(dateStr), 'MMM d');
}

// Build SMS message
function buildSmsMessage(data: BookingSmsData): string {
  return `New Booking Request!
#${data.confirmationNumber}
${data.customerName} (${data.customerPhone})
${data.vehicleInfo}
${formatSmsDate(data.startDate)} - ${formatSmsDate(data.endDate)}
${formatCurrency(data.totalPrice)}

Confirm: ${data.confirmUrl}
Decline: ${data.declineUrl}`;
}

// Send SMS notification to admin
export async function sendBookingSms(data: BookingSmsData): Promise<{
  success: boolean;
  messageId?: string;
  error?: string;
}> {
  const client = getTwilioClient();

  if (!client) {
    console.log('SMS would be sent (Twilio not configured):', buildSmsMessage(data));
    return { success: true, messageId: 'mock-' + Date.now() };
  }

  if (!twilioPhoneNumber || !adminPhoneNumber) {
    console.warn('Phone numbers not configured');
    return { success: false, error: 'Phone numbers not configured' };
  }

  try {
    const message = await client.messages.create({
      body: buildSmsMessage(data),
      from: twilioPhoneNumber,
      to: adminPhoneNumber,
    });

    console.log('SMS sent successfully:', message.sid);
    return { success: true, messageId: message.sid };
  } catch (error) {
    console.error('Error sending SMS:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send SMS'
    };
  }
}
