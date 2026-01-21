import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
  // If already logged in, redirect to admin
  const session = cookies.get('fulala_admin_session');
  if (session) {
    throw redirect(303, '/admin');
  }
  return {};
};

export const actions: Actions = {
  login: async ({ request, cookies }) => {
    const data = await request.formData();
    const email = data.get('email')?.toString();
    const password = data.get('password')?.toString();

    if (!email || !password) {
      return fail(400, { error: 'Email and password are required' });
    }

    // In production, validate credentials with Convex auth.login mutation
    // For demo, we accept specific credentials
    const validCredentials = [
      { email: 'admin@fulala.cz', password: 'admin123', name: 'Admin', role: 'owner' },
      { email: 'manager@fulala.cz', password: 'manager123', name: 'Manager', role: 'manager' },
      { email: 'staff@fulala.cz', password: 'staff123', name: 'Staff', role: 'staff' },
    ];

    const user = validCredentials.find(
      (u) => u.email === email.toLowerCase() && u.password === password
    );

    if (!user) {
      return fail(401, { error: 'Invalid email or password' });
    }

    // Set session cookie (in production, use token from Convex)
    const sessionData = {
      email: user.email,
      name: user.name,
      role: user.role,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    cookies.set('fulala_admin_session', JSON.stringify(sessionData), {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    throw redirect(303, '/admin');
  },

  logout: async ({ cookies }) => {
    cookies.delete('fulala_admin_session', { path: '/' });
    throw redirect(303, '/admin/login');
  },
};
