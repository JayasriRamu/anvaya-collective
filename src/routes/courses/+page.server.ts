import { db } from '$lib/server/db';
import { content } from '$lib/server/db/schema';
import { desc, eq, or } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const courseMaterials = await db
		.select()
		.from(content)
		.where(or(eq(content.type, 'Course Material'), eq(content.type, 'course')))
		.orderBy(desc(content.createdAt));

	return { courseMaterials };
};
