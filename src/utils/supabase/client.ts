'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/src/types/database';

/**
 * Browser Supabase Client
 * Used in Client Components for real-time data and authentication
 * Automatically manages session via cookies
 */
export const createClient = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
