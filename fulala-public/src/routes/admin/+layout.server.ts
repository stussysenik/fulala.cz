import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, url }) => {
  // Skip auth check for login page
  if (url.pathname === '/admin/login') {
    return {};
  }

  // Check for session cookie
  const sessionToken = cookies.get('fulala_admin_session');

  if (!sessionToken) {
    throw redirect(303, '/admin/login');
  }

  // In production, validate session with Convex
  // For now, we just check if the cookie exists
  try {
    const session = JSON.parse(sessionToken);
    return {
      user: session,
    };
  } catch {
    // Invalid session, clear cookie and redirect
    cookies.delete('fulala_admin_session', { path: '/' });
    throw redirect(303, '/admin/login');
  }
};
