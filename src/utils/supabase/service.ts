import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/src/types/database';

/**
 * ⚠️ SERVICE ROLE CLIENT - USE WITH EXTREME CAUTION
 *
 * This client uses the Supabase service role key for highly privileged operations.
 * ONLY use for:
 * - Creating user accounts via auth.admin.createUser()
 * - Generating signed URLs for storage operations
 * - Other admin-only operations that require bypassing RLS
 *
 * NEVER:
 * - Expose this to the browser (NEXT_PUBLIC_)
 * - Use for regular SELECT/INSERT/UPDATE on user data
 * - Use in Client Components
 *
 * Always prefer createClient() from server.ts for normal database operations.
 */
export const createServiceClient = () =>
  createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
