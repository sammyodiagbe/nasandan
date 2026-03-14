import { Resend } from 'resend';
import { format } from 'date-fns';

const resendApiKey = process.env.RESEND_API_KEY;
const adminEmail = process.env.ADMIN_EMAIL || 'admin@nasandanrentals.com';

// Initialize Resend client
function getResendClient() {
  if (!resendApiKey) {
    console.warn('Resend API key not configured');
    return null;
  }
  return new Resend(resendApiKey);
}

export interface BookingEmailData {
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
  confirmUrl: string;
  declineUrl: string;
  notes?: string;
}

// Format currency
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

// Format date for email
function formatEmailDate(dateStr: string): string {
  return format(new Date(dateStr), 'EEEE, MMMM d, yyyy');
}

// Build HTML email
function buildEmailHtml(data: BookingEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Booking Request</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background-color: #0c2340; padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #E8AC41; font-size: 24px;">New Booking Request</h1>
              <p style="margin: 10px 0 0; color: #ffffff; font-size: 18px; font-family: monospace;">${data.confirmationNumber}</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 30px;">
              <!-- Customer Info -->
              <table width="100%" style="margin-bottom: 25px;">
                <tr>
                  <td style="padding-bottom: 15px; border-bottom: 1px solid #eee;">
                    <h2 style="margin: 0 0 10px; color: #0c2340; font-size: 16px;">Customer</h2>
                    <p style="margin: 0; color: #333; font-size: 18px; font-weight: 600;">${data.customerName}</p>
                    <p style="margin: 5px 0 0; color: #666; font-size: 14px;">${data.customerEmail}</p>
                    <p style="margin: 5px 0 0; color: #666; font-size: 14px;">${data.customerPhone}</p>
                  </td>
                </tr>
              </table>

              <!-- Vehicle Info -->
              <table width="100%" style="margin-bottom: 25px;">
                <tr>
                  <td style="padding-bottom: 15px; border-bottom: 1px solid #eee;">
                    <h2 style="margin: 0 0 10px; color: #0c2340; font-size: 16px;">Vehicle</h2>
                    <p style="margin: 0; color: #333; font-size: 18px; font-weight: 600;">${data.vehicleInfo}</p>
                    <p style="margin: 5px 0 0; color: #666; font-size: 14px;">${data.vehicleColor}</p>
                  </td>
                </tr>
              </table>

              <!-- Rental Period -->
              <table width="100%" style="margin-bottom: 25px;">
                <tr>
                  <td style="padding-bottom: 15px; border-bottom: 1px solid #eee;">
                    <h2 style="margin: 0 0 10px; color: #0c2340; font-size: 16px;">Rental Period</h2>
                    <table width="100%">
                      <tr>
                        <td width="50%">
                          <p style="margin: 0; color: #888; font-size: 12px; text-transform: uppercase;">Pick-up</p>
                          <p style="margin: 5px 0 0; color: #333; font-size: 14px; font-weight: 600;">${formatEmailDate(data.startDate)}</p>
                          <p style="margin: 3px 0 0; color: #666; font-size: 14px;">${data.pickupTime}</p>
                        </td>
                        <td width="50%">
                          <p style="margin: 0; color: #888; font-size: 12px; text-transform: uppercase;">Return</p>
                          <p style="margin: 5px 0 0; color: #333; font-size: 14px; font-weight: 600;">${formatEmailDate(data.endDate)}</p>
                          <p style="margin: 3px 0 0; color: #666; font-size: 14px;">${data.returnTime}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              ${data.notes ? `
              <!-- Notes -->
              <table width="100%" style="margin-bottom: 25px;">
                <tr>
                  <td style="padding: 15px; background-color: #fff9e6; border-radius: 6px; border-left: 4px solid #E8AC41;">
                    <h2 style="margin: 0 0 8px; color: #0c2340; font-size: 14px;">Customer Notes</h2>
                    <p style="margin: 0; color: #666; font-size: 14px;">${data.notes}</p>
                  </td>
                </tr>
              </table>
              ` : ''}

              <!-- Total -->
              <table width="100%" style="margin-bottom: 30px;">
                <tr>
                  <td style="padding: 20px; background-color: #0c2340; border-radius: 6px; text-align: center;">
                    <p style="margin: 0; color: #fff; font-size: 14px;">Estimated Total</p>
                    <p style="margin: 5px 0 0; color: #E8AC41; font-size: 32px; font-weight: 700;">${formatCurrency(data.totalPrice)}</p>
                  </td>
                </tr>
              </table>

              <!-- Action Buttons -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="48%" style="text-align: center;">
                    <a href="${data.confirmUrl}" style="display: inline-block; padding: 16px 40px; background-color: #10b981; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px;">Confirm Booking</a>
                  </td>
                  <td width="4%"></td>
                  <td width="48%" style="text-align: center;">
                    <a href="${data.declineUrl}" style="display: inline-block; padding: 16px 40px; background-color: #ef4444; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px;">Decline Booking</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #eee;">
              <p style="margin: 0; color: #888; font-size: 12px;">Nas & Dan Rentals - Admin Notification</p>
              <p style="margin: 5px 0 0; color: #aaa; font-size: 11px;">This link expires in 7 days</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

// Build plain text email
function buildEmailText(data: BookingEmailData): string {
  return `NEW BOOKING REQUEST
${data.confirmationNumber}

CUSTOMER
${data.customerName}
${data.customerEmail}
${data.customerPhone}

VEHICLE
${data.vehicleInfo}
${data.vehicleColor}

RENTAL PERIOD
Pick-up: ${formatEmailDate(data.startDate)} at ${data.pickupTime}
Return: ${formatEmailDate(data.endDate)} at ${data.returnTime}

${data.notes ? `NOTES: ${data.notes}\n\n` : ''}TOTAL: ${formatCurrency(data.totalPrice)}

---

CONFIRM: ${data.confirmUrl}

DECLINE: ${data.declineUrl}

---
Nas & Dan Rentals - Admin Notification
This link expires in 7 days`;
}

// Send email notification to admin
export async function sendBookingEmail(data: BookingEmailData): Promise<{
  success: boolean;
  messageId?: string;
  error?: string;
}> {
  const client = getResendClient();

  if (!client) {
    console.log('Email would be sent (Resend not configured):');
    console.log('To:', adminEmail);
    console.log('Subject:', `New Booking: ${data.confirmationNumber} - ${data.customerName}`);
    return { success: true, messageId: 'mock-' + Date.now() };
  }

  try {
    // Use verified domain or Resend's test domain for development
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'Nas & Dan Rentals <onboarding@resend.dev>';

    const result = await client.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: `New Booking: ${data.confirmationNumber} - ${data.customerName}`,
      html: buildEmailHtml(data),
      text: buildEmailText(data),
    });

    if (result.error) {
      console.error('Error sending email:', result.error);
      return { success: false, error: result.error.message };
    }

    console.log('Email sent successfully:', result.data?.id);
    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email'
    };
  }
}
