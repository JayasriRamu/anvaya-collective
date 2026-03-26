import type { Handle } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';
import { sequence } from '@sveltejs/kit/hooks';
import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

// --- 1. Better Auth Session Handler ---
const authHandle: Handle = async ({ event, resolve }) => {
	const { pathname } = event.url;
	// Use startsWith to catch all /api/auth sub-routes
	if (pathname.startsWith('/api/auth')) {
		return auth.handler(event.request);
	}
	return resolve(event);
};

// --- 2. Existing Visitor Stats + Privacy Logic ---
const mainHandle: Handle = async ({ event, resolve }) => {
	// --- A. Visitor Stats Logic ---
	const statsCookie = event.cookies.get('visitor_stats');
	let stats = { views: 0, lastVisit: 'First time' };

	if (statsCookie) {
		try {
			const parsed = JSON.parse(statsCookie);
			stats = {
				views: (parsed.views || 0) + 1,
				lastVisit: parsed.currentVisit || 'First time'
			};
		} catch (e) {
			console.error('Cookie parse error');
		}
	} else {
		stats.views = 1;
	}

	const currentVisitDate = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

	event.cookies.set(
		'visitor_stats',
		JSON.stringify({ views: stats.views, currentVisit: currentVisitDate }),
		{
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 30
		}
	);

	event.locals.stats = stats;
	event.locals.userMobile = event.cookies.get('user_mobile') || null;
	event.locals.formSubmitted = event.cookies.get('form_submitted') === 'true';

	// --- B. Admin Security Guard ---
	if (event.url.pathname.startsWith('/admin') && !event.url.pathname.includes('/admin/login')) {
		const session = await auth.api.getSession({
			headers: event.request.headers
		});

		// 1. Redirect to login if no session exists
		if (!session) {
			throw redirect(302, '/admin/login');
		}

		// 2. Email Validation Logic
		// Split the env string into an array and trim spaces
		const ALLOWED_ADMINS = env.ADMIN_EMAILS.split(',').map((email) => email.trim().toLowerCase());
		const userEmail = session.user.email.toLowerCase();

		// Check if the logged-in user is in the allowlist
		if (!ALLOWED_ADMINS.includes(userEmail)) {
			console.warn('Unauthorized access attempt blocked for:', userEmail);
			throw redirect(302, '/');
		}
	}

	// --- C. Resolve & Privacy Headers ---
	const response = await resolve(event);

	if (event.url.pathname === '/contact') {
		response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
		response.headers.set('Pragma', 'no-cache');
		response.headers.set('Expires', '0');
	}

	return response;
};

// Combine both handlers
export const handle = sequence(authHandle, mainHandle);
