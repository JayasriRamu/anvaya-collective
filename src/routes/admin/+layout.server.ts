import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { env } from '$env/dynamic/private';

export const load: LayoutServerLoad = async ({ request, url }) => {
	// Let anyone reach the login page itself (otherwise /admin/login would
	// redirect unauthenticated users to itself in a loop).
	if (url.pathname === '/admin/login') {
		return {};
	}

	const session = await auth.api.getSession({
		headers: request.headers
	});

	// 1. Redirect to login if no session exists
	if (!session) {
		throw redirect(302, '/admin/login');
	}

	// 2. Email Validation Logic
	// Split the env string into an array, trim spaces, and drop empty entries
	const ALLOWED_ADMINS = (env.ADMIN_EMAILS || '')
		.split(',')
		.map((email) => email.trim().toLowerCase())
		.filter(Boolean);

	const userEmail = session.user.email.toLowerCase();

	// Check if the logged-in user is in the allowlist
	if (!ALLOWED_ADMINS.includes(userEmail)) {
		console.warn('Unauthorized admin access blocked for:', userEmail);
		throw redirect(302, '/');
	}

	return {
		user: {
			name: session.user.name,
			email: session.user.email
		}
	};
};