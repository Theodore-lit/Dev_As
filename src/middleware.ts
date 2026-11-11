import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// Routes configuration
const PUBLIC_ROUTES = [
  '/',
  '/connexion',
  '/candidacy',
  '/editions',
  '/participants',
  '/resultats',
  '/palmares',
  '/actualites',
  '/competition',
];

const ADMIN_ROUTES = ['/admin'];
const PARTICIPANT_ROUTES = ['/participant'];

/**
 * Middleware to handle authentication and role-based redirects
 *
 * Behavior:
 * 1. Refreshes session on every request
 * 2. Redirects unauthenticated users trying to access protected routes
 * 3. Redirects authenticated users with wrong role
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let supabaseResponse = NextResponse.next({
    request,
  });

  // 1. Create a Supabase client with request context
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  // 2. Refresh session and get current user securely
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 3. Get user's profile/role if authenticated
  let role: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from('profils')
      .select('role')
      .eq('id', user.id)
      .single();

    role = profile?.role || null;
  }

  // 4. Check route access
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route),
  );
  const isAdminRoute = ADMIN_ROUTES.some((route) =>
    pathname.startsWith(route),
  );
  const isParticipantRoute = PARTICIPANT_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  // Allow public routes for everyone
  if (isPublicRoute) {
    return supabaseResponse;
  }

  // Admin routes: require super_admin or admin role
  if (isAdminRoute) {
    if (!user || (role !== 'super_admin' && role !== 'admin')) {
      const url = request.nextUrl.clone();
      url.pathname = '/connexion';
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  // Participant routes: require participant role
  if (isParticipantRoute) {
    if (!user || role !== 'participant') {
      const url = request.nextUrl.clone();
      url.pathname = '/connexion';
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  // Default: allow
  return supabaseResponse;
}

export const config = {
  // Match all routes except static files and API routes
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public|logo.png|.*\\.png|.*\\.svg).*)',
  ],
};
