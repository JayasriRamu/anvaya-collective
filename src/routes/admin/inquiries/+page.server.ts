import { db } from '$lib/server/db';
import { inquiries } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	const allInquiries = await db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
	return { inquiries: allInquiries };
};

export const actions: Actions = {
	deleteInquiry: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get('id'));

		if (!id) return fail(400, { message: 'Invalid ID' });

		try {
			await db.delete(inquiries).where(eq(inquiries.id, id));
			return { success: true };
		} catch (error) {
			return fail(500, { message: 'Failed to delete' });
		}
	}
};
