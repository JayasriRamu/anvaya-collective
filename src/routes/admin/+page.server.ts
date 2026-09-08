import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { content } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	const items = await db.select().from(content).orderBy(desc(content.createdAt));
	return { contentItems: items };
};

export const actions: Actions = {
	add: async ({ request }) => {
		const data = await request.formData();

		const type = data.get('type')?.toString();
		const title = data.get('title')?.toString().trim();
		const url = data.get('url')?.toString().trim();
		const tags = data.get('tags')?.toString().trim();
		const description = data.get('description')?.toString().trim();
		const syllabus = data.get('syllabus')?.toString().trim() || null;
		const difficulty = data.get('difficulty')?.toString() || null;
		const enrollmentCta = data.get('enrollmentCta')?.toString().trim() || null;
		const posterImage = data.get('posterImage')?.toString().trim() || null;
		const expiresAt = data.get('expiresAt')?.toString() || null;

		const errors: Record<string, string | undefined> = {};

		if (!type) errors.type = 'Content type is required.';
		if (!title) errors.title = 'Title is required.';

		if (Object.keys(errors).length > 0) {
			return fail(400, { errors, values: { type, title, url, tags, description, syllabus, difficulty, enrollmentCta, posterImage: posterImage ?? '', expiresAt: expiresAt ?? '' } });
		}

		try {
			await db.insert(content).values({
				type: type!,
				title: title!,
				url: url || null,
				tags: tags || null,
				description: description || null,
				syllabus,
				difficulty,
				enrollmentCta,
				posterImage,
				expiresAt
			});

			return { success: true, message: 'Content added successfully.' };
		} catch (e) {
			console.error('DB Insert Error:', e);
			return fail(500, { errors: { server: 'Failed to save content. Please try again.' }, values: { type, title, url, tags, description, syllabus, difficulty, enrollmentCta, posterImage: posterImage ?? '' } });
		}
	},

	updateContent: async ({ request }) => {
		const data = await request.formData();

		const id = Number(data.get('id'));
		const type = data.get('type')?.toString();
		const title = data.get('title')?.toString().trim();
		const url = data.get('url')?.toString().trim();
		const tags = data.get('tags')?.toString().trim();
		const description = data.get('description')?.toString().trim();
		const syllabus = data.get('syllabus')?.toString().trim() || null;
		const difficulty = data.get('difficulty')?.toString() || null;
		const enrollmentCta = data.get('enrollmentCta')?.toString().trim() || null;
		const posterImage = data.get('posterImage')?.toString().trim() || null;
		const expiresAt = data.get('expiresAt')?.toString() || null;

		const errors: Record<string, string | undefined> = {};

		if (!id) errors.server = 'Invalid ID.';
		if (!type) errors.type = 'Content type is required.';
		if (!title) errors.title = 'Title is required.';

		if (Object.keys(errors).length > 0) {
			return fail(400, { errors, values: { type, title, url, tags, description, syllabus, difficulty, enrollmentCta, posterImage: posterImage ?? '', expiresAt: expiresAt ?? '' } });
		}

		try {
			await db
				.update(content)
				.set({
					type: type!,
					title: title!,
					url: url || null,
					tags: tags || null,
					description: description || null,
					syllabus,
					difficulty,
					enrollmentCta,
					posterImage,
					expiresAt
				})
				.where(eq(content.id, id));

			return { success: true, message: 'Content updated successfully.' };
		} catch (e) {
			console.error('DB Update Error:', e);
			return fail(500, { errors: { server: 'Failed to update content.' }, values: { type, title, url, tags, description, syllabus, difficulty, enrollmentCta, posterImage: posterImage ?? '' } });
		}
	},

	deleteContent: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get('id'));

		if (!id) return fail(400, { errors: { server: 'Invalid ID.' } });

		try {
			await db.delete(content).where(eq(content.id, id));
			return { success: true, message: 'Content deleted.' };
		} catch (e) {
			console.error('DB Delete Error:', e);
			return fail(500, { errors: { server: 'Failed to delete content.' } });
		}
	}
};
