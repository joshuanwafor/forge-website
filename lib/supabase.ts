import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export interface WaitlistEntry {
  id?: string;
  full_name: string;
  email: string;
  phone?: string;
  interest: string;
  referral?: string;
  message?: string;
  created_at?: string;
}

export interface CourseApplication {
  id?: string;
  full_name: string;
  location: string;
  gender: string;
  phone: string;
  email: string;
  course_of_interest: string;
  why_interested: string;
  availability: string;
  payment_reference: string;
  payment_status: string;
  amount_paid: number;
  created_at?: string;
}

