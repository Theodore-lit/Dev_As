import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// Routes configuration
const PUBLIC_ROUTES = [
  '/',
  '/connexion',
  '/candidater',
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

  // 1. Create a Supabase client with request context
  let supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookies) {
          cookies.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
          });
        },
      },
    },
  );

  // 2. Refresh session and get current user
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 3. Get user's profile/role if authenticated
  let role: string | null = null;
  if (session?.user) {
    const { data: profile } = await supabase
      .from('profils')
      .select('role')
      .eq('id', session.user.id)
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
    return NextResponse.next();
  }

  // Admin routes: require super_admin or admin role
  if (isAdminRoute) {
    if (!session || (role !== 'super_admin' && role !== 'admin')) {
      return NextResponse.redirect(new URL('/connexion', request.url));
    }
    return NextResponse.next();
  }

  // Participant routes: require participant role
  if (isParticipantRoute) {
    if (!session || role !== 'participant') {
      return NextResponse.redirect(new URL('/connexion', request.url));
    }
    return NextResponse.next();
  }

  // Default: allow
  return NextResponse.next();
}

export const config = {
  // Match all routes except static files and API routes
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public|logo.png|.*\\.png|.*\\.svg).*)',
  ],
};
