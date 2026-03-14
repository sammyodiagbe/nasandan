import { NextRequest, NextResponse } from 'next/server';
import { processToken } from '@/lib/notifications';

interface RouteParams {
  params: Promise<{ token: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { token } = await params;

  if (!token || token.length !== 64) {
    // Redirect to error page with invalid token message
    const errorUrl = new URL('/admin/confirm', request.url);
    errorUrl.searchParams.set('status', 'error');
    errorUrl.searchParams.set('message', 'Invalid confirmation link');
    return NextResponse.redirect(errorUrl);
  }

  // Process the token
  const result = await processToken(token);

  // Build redirect URL
  const redirectUrl = new URL('/admin/confirm', request.url);

  if (result.success) {
    redirectUrl.searchParams.set('status', result.action === 'confirm' ? 'confirmed' : 'declined');
    if (result.confirmationNumber) {
      redirectUrl.searchParams.set('booking', result.confirmationNumber);
    }
  } else {
    redirectUrl.searchParams.set('status', 'error');
    redirectUrl.searchParams.set('message', result.error || 'Something went wrong');
  }

  return NextResponse.redirect(redirectUrl);
}
