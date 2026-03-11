// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const statsCookie = event.cookies.get('visitor_stats');
	let stats = { views: 0, lastVisit: 'First time' };

	if (statsCookie) {
		try {
			const parsed = JSON.parse(statsCookie);
			stats = {
				views: parsed.views + 1,
				lastVisit: parsed.currentVisit // The previous "current" becomes the "last"
			};
		} catch (e) {
			console.error('Cookie parse error');
		}
	}

	const currentVisitDate = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

	// Set the updated cookie (valid for 30 days)
	event.cookies.set(
		'visitor_stats',
		JSON.stringify({
			views: stats.views,
			currentVisit: currentVisitDate
		}),
		{
			path: '/',
			httpOnly: true,
			maxAge: 60 * 60 * 24 * 30
		}
	);

	// Pass this data to the frontend via locals
	event.locals.stats = stats;

	return await resolve(event);
};
