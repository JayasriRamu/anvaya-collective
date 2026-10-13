import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { content, deletedContentTypes } from '$lib/server/db/schema';
import {
	dedupeTags,
	dedupeValues,
	normalizeContentType,
	normalizeTags,
	parseTags,
	safeUrl
} from '$lib/content';
import { desc, eq } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

/** Types the admin has removed from the pick list (lowercased, normalized). */
const deletedNames = async () => {
	const rows = await db.select({ name: deletedContentTypes.name }).from(deletedContentTypes);
	return new Set(rows.map((row) => row.name));
};

/** Bring a type name back into the pick list when it is used again. */
const undeleteType = async (type: string) => {
	await db.delete(deletedContentTypes).where(eq(deletedContentTypes.name, type.toLowerCase()));
};

export const load: PageServerLoad = async () => {
	const items = await db.select().from(content).orderBy(desc(content.createdAt));

	// Every type/tag already stored becomes a suggestion in the admin form, so
	// custom values the admin typed previously come back automatically. Types the
	// admin removed are filtered out (their content rows stay untouched).
	const usedTypes = items.map((item) => item.type).filter((type): type is string => !!type?.trim());
	const usedTags = items.flatMap((item) => parseTags(item.tags));
	const hidden = await deletedNames();

	return {
		contentItems: items,
		existingTypes: dedupeValues(usedTypes).filter(
			(type) => !hidden.has(normalizeContentType(type).toLowerCase())
		),
		existingTags: dedupeTags(usedTags),
		// Deleted names (lowercased) so the client can hide the matching pills too.
		hiddenTypes: [...hidden]
	};
};

export const actions: Actions = {
	add: async ({ request }) => {
		const data = await request.formData();

		const type = normalizeContentType(data.get('type')?.toString());
		const title = data.get('title')?.toString().trim();
		const url = safeUrl(data.get('url')?.toString()) ?? undefined;
		const tags = normalizeTags(data.get('tags')?.toString());
		const description = data.get('description')?.toString().trim();
		const syllabus = data.get('syllabus')?.toString().trim() || null;
		const difficulty = data.get('difficulty')?.toString() || null;
		const enrollmentCta = data.get('enrollmentCta')?.toString().trim() || null;
		const posterImage = safeUrl(data.get('posterImage')?.toString()) ?? null;
		const expiresAt = data.get('expiresAt')?.toString() || null;

		const errors: Record<string, string | undefined> = {};

		if (!type) errors.type = 'Content type is required.';
		if (!title) errors.title = 'Title is required.';

		if (Object.keys(errors).length > 0) {
			return fail(400, {
				errors,
				values: {
					type,
					title,
					url,
					tags,
					description,
					syllabus,
					difficulty,
					enrollmentCta,
					posterImage: posterImage ?? '',
					expiresAt: expiresAt ?? ''
				}
			});
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
			await undeleteType(type!);

			return { success: true, message: 'Content added successfully.' };
		} catch (e) {
			console.error('DB Insert Error:', e);
			return fail(500, {
				errors: { server: 'Failed to save content. Please try again.' },
				values: {
					type,
					title,
					url,
					tags,
					description,
					syllabus,
					difficulty,
					enrollmentCta,
					posterImage: posterImage ?? '',
					expiresAt: expiresAt ?? ''
				}
			});
		}
	},

	updateContent: async ({ request }) => {
		const data = await request.formData();

		const id = Number(data.get('id'));
		const type = normalizeContentType(data.get('type')?.toString());
		const title = data.get('title')?.toString().trim();
		const url = safeUrl(data.get('url')?.toString()) ?? undefined;
		const tags = normalizeTags(data.get('tags')?.toString());
		const description = data.get('description')?.toString().trim();
		const syllabus = data.get('syllabus')?.toString().trim() || null;
		const difficulty = data.get('difficulty')?.toString() || null;
		const enrollmentCta = data.get('enrollmentCta')?.toString().trim() || null;
		const posterImage = safeUrl(data.get('posterImage')?.toString()) ?? null;
		const expiresAt = data.get('expiresAt')?.toString() || null;

		const errors: Record<string, string | undefined> = {};

		if (!id) errors.server = 'Invalid ID.';
		if (!type) errors.type = 'Content type is required.';
		if (!title) errors.title = 'Title is required.';

		if (Object.keys(errors).length > 0) {
			return fail(400, {
				errors,
				values: {
					type,
					title,
					url,
					tags,
					description,
					syllabus,
					difficulty,
					enrollmentCta,
					posterImage: posterImage ?? '',
					expiresAt: expiresAt ?? ''
				}
			});
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
			await undeleteType(type!);

			return { success: true, message: 'Content updated successfully.' };
		} catch (e) {
			console.error('DB Update Error:', e);
			return fail(500, {
				errors: { server: 'Failed to update content.' },
				values: {
					type,
					title,
					url,
					tags,
					description,
					syllabus,
					difficulty,
					enrollmentCta,
					posterImage: posterImage ?? '',
					expiresAt: expiresAt ?? ''
				}
			});
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
	},

	deleteContentType: async ({ request }) => {
		const data = await request.formData();
		const name = normalizeContentType(data.get('name')?.toString());

		if (!name) return fail(400, { errors: { server: 'Missing content type name.' } });

		try {
			// Soft removal: the name disappears from the pick list, but any content
			// already using it stays in the library and on the site. Saving a new
			// item with the same type brings the pill back.
			await db
				.insert(deletedContentTypes)
				.values({ name: name.toLowerCase() })
				.onConflictDoNothing();
			return {
				success: true,
				message: `"${name}" removed from the list. Content already using it stays in the library.`
			};
		} catch (e) {
			console.error('DB Delete Type Error:', e);
			return fail(500, { errors: { server: 'Failed to remove the content type.' } });
		}
	}
};
