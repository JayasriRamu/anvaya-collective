import { db } from '$lib/server/db';
import { content } from '$lib/server/db/schema';
import { RECENT_WINDOW_DAYS } from '$lib/content';
import { desc, eq, and, or, isNull, isNotNull, gte } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const now = new Date().toISOString().split('T')[0];

	const [activePoster] = await db
		.select()
		.from(content)
		.where(
			and(
				or(eq(content.type, 'Workshop Slides'), eq(content.type, 'Poster')),
				isNotNull(content.posterImage),
				or(isNull(content.expiresAt), gte(content.expiresAt, now))
			)
		)
		.orderBy(desc(content.createdAt))
		.limit(1);

	const cutoff = new Date(Date.now() - RECENT_WINDOW_DAYS * 86_400_000);

	// Show an item in Recent Activity when it is not past its event/expiry date
	// AND either has a live future date or was posted within the recency window
	// (so undated items age out naturally).
	const recentItems = await db
		.select()
		.from(content)
		.where(
			and(
				or(isNull(content.expiresAt), gte(content.expiresAt, now)),
				or(gte(content.expiresAt, now), gte(content.createdAt, cutoff))
			)
		)
		.orderBy(desc(content.createdAt))
		.limit(6);

	return { activePoster: activePoster ?? null, recentItems };
};
