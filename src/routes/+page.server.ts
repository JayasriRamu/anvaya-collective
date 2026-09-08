import { db } from '$lib/server/db';
import { content } from '$lib/server/db/schema';
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

	const recentItems = await db
		.select()
		.from(content)
		.where(or(isNull(content.expiresAt), gte(content.expiresAt, now)))
		.orderBy(desc(content.createdAt))
		.limit(6);

	return { activePoster: activePoster ?? null, recentItems };
};
