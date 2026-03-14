import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
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
  created_at: string;
  updated_at: string;
}
