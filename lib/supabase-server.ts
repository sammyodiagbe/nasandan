import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Server-side Supabase client with service role for admin operations
// Only use this in API routes and server components, never on the client

let supabaseAdminClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (supabaseAdminClient) {
    return supabaseAdminClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Missing Supabase environment variables for server-side operations');
  }

  supabaseAdminClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return supabaseAdminClient;
}

// Alias for convenience - use getSupabaseAdmin() for lazy initialization
export const supabaseAdmin = {
  from: (table: string) => getSupabaseAdmin().from(table),
};

// Database types for booking tokens
export interface DbBookingToken {
  id: string;
  booking_id: string;
  token: string;
  action: 'confirm' | 'decline';
  used_at: string | null;
  expires_at: string;
  created_at: string;
}

// Extended booking type with new columns
export interface DbBooking {
  id: string;
  car_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  start_date: string;
  end_date: string;
  pickup_time: string;
  return_time: string;
  total_price: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  confirmation_number: string | null;
  notes: string | null;
  customer_age: number | null;
  has_full_license: boolean;
  admin_notified_at: string | null;
  confirmed_at: string | null;
  declined_at: string | null;
  created_at: string;
  updated_at: string;
}

// Car type for joining
export interface DbCar {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  price_per_day: number;
  fuel_type: string;
  doors: number;
  passengers: number;
  image_url: string | null;
  available: boolean;
}
