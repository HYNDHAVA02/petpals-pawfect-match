
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://wbjwykpwtyqupputqmhs.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indiand5a3B3dHlxdXBwdXRxbWhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxNjM0NDQsImV4cCI6MjA2MDczOTQ0NH0.ZvoyCD8_bdRjJjul2z_08N4CWRHFuXCZwCm7IZoMFNk";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

