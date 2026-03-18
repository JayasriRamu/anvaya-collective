import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// --- 1. Visitor Stats Logic ---
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
		JSON.stringify({
			views: stats.views,
			currentVisit: currentVisitDate
		}),
		{
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 30
		}
	);

	// --- 2. Privacy & Session Identification ---
	// Assign values to locals so load functions can use them
	event.locals.stats = stats;
	event.locals.userMobile = event.cookies.get('user_mobile') || null;
	event.locals.formSubmitted = event.cookies.get('form_submitted') === 'true';

	// --- 3. Resolve & Security Headers ---
	const response = await resolve(event);

	// Privacy Guard: Prevent browser from caching the contact page
	// This ensures that if a user submits without "Remember Me",
	// the next person can't click "Back" to see their data.
	if (event.url.pathname === '/contact') {
		response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
		response.headers.set('Pragma', 'no-cache');
		response.headers.set('Expires', '0');
	}

	return response;
};
