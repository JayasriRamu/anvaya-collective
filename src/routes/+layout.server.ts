// src/routes/+layout.server.ts
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	return {
		stats: locals.stats,
		formSubmitted: locals.formSubmitted // Add this line
	};
};
