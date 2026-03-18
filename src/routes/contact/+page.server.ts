// src/routes/contact/+page.server.ts
import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { inquiries } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load = async ({ locals }) => {
	try {
		// SAFETY 1: Check if locals even exists
		if (!locals?.userMobile) return { userInquiry: null };

		// SAFETY 2: Try-Catch around the DB call
		const userRecord = await db
			.select()
			.from(inquiries)
			.where(eq(inquiries.email, locals.userMobile))
			.limit(1);

		return { userInquiry: userRecord[0] || null };
	} catch (e) {
		// Log the error so you see it in terminal
		console.error('LOAD ERROR BLOCKED:', e);
		// Return null so the page still loads the blank form instead of crashing
		return { userInquiry: null };
	}
};

export const actions = {
	submit: async ({ request, cookies }) => {
		try {
			const data = await request.formData();
			const rememberMe = data.get('rememberMe') === 'on';
			const name = data.get('name')?.toString() || '';
			const mobile = data.get('mobile')?.toString() || '';
			const ageGroup = data.get('ageGroup')?.toString() || '';
			const message = data.get('message')?.toString() || '';
			const interest = data.getAll('interest').join(', ');

			const cleanMobile = mobile.replace(/\D/g, '');
			if (cleanMobile.length !== 10) return fail(400, { invalidMobile: true });

			const existing = await db
				.select()
				.from(inquiries)
				.where(eq(inquiries.email, cleanMobile))
				.limit(1);

			if (existing.length > 0) {
				await db
					.update(inquiries)
					.set({ name, interest, ageGroup, message })
					.where(eq(inquiries.email, cleanMobile));
			} else {
				await db
					.insert(inquiries)
					.values({ name, email: cleanMobile, interest, ageGroup, message });
			}

			if (rememberMe) {
				cookies.set('form_submitted', 'true', { path: '/', maxAge: 60 * 60 * 24 * 30 });
				cookies.set('user_mobile', cleanMobile, { path: '/', maxAge: 60 * 60 * 24 * 30 });
			} else {
				cookies.delete('form_submitted', { path: '/' });
				cookies.delete('user_mobile', { path: '/' });
			}

			return { success: true, remembered: rememberMe };
		} catch (e) {
			console.error('ACTION ERROR BLOCKED:', e);
			return fail(500, { error: true });
		}
	},
	logout: async ({ cookies }) => {
		cookies.delete('form_submitted', { path: '/' });
		cookies.delete('user_mobile', { path: '/' });
		return { success: false, loggedOut: true };
	}
};
