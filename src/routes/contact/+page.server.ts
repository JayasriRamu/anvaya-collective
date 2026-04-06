import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { inquiries } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load = async ({ locals }) => {
	try {
		// SAFETY 1: Check if locals exists and user is "logged in" via cookie
		if (!locals?.userMobile) return { userInquiry: null };

		// SAFETY 2: Fetch existing record based on mobile (acting as email/ID)
		const userRecord = await db
			.select()
			.from(inquiries)
			.where(eq(inquiries.phone, locals.userMobile))
			.limit(1);

		return { userInquiry: userRecord[0] || null };
	} catch (e) {
		console.error('LOAD ERROR BLOCKED:', e);
		return { userInquiry: null };
	}
};

export const actions = {
	submit: async ({ request, cookies }) => {
		try {
			const data = await request.formData();

			// Extracting standard fields
			const rememberMe = data.get('rememberMe') === 'on';
			const name = data.get('name')?.toString() || '';
			const mobile = data.get('mobile')?.toString() || '';
			const ageGroup = data.get('ageGroup')?.toString() || '';
			const message = data.get('message')?.toString() || '';

			// NEW: Capture Location and Consent
			const location = data.get('location')?.toString() || 'India';
			const consent = data.get('consent') === 'on';

			// Capture selected tracks/interests
			const interest = data.getAll('interest').join(', ');

			// Validation: Mobile must be 10 digits
			const cleanMobile = mobile.replace(/\D/g, '');
			if (cleanMobile.length !== 10) {
				return fail(400, { invalidMobile: true });
			}

			// Check if this person has registered before
			const existing = await db
				.select()
				.from(inquiries)
				.where(eq(inquiries.phone, cleanMobile))
				.limit(1);

			const payload = {
				name,
				interest,
				ageGroup,
				message,
				location // Ensure this exists in your schema!
			};

			if (existing.length > 0) {
				// Update existing record
				await db.update(inquiries).set(payload).where(eq(inquiries.phone, cleanMobile));
			} else {
				// Insert new record
				await db.insert(inquiries).values({
					...payload,
					phone: cleanMobile
				});
			}

			// Handle "Remember Me" cookies
			if (rememberMe) {
				cookies.set('form_submitted', 'true', {
					path: '/',
					maxAge: 60 * 60 * 24 * 30,
					httpOnly: true,
					sameSite: 'lax'
				});
				cookies.set('user_mobile', cleanMobile, {
					path: '/',
					maxAge: 60 * 60 * 24 * 30,
					httpOnly: true,
					sameSite: 'lax'
				});
			} else {
				// If they don't want to be remembered, KILL the cookies immediately
				cookies.delete('form_submitted', { path: '/' });
				cookies.delete('user_mobile', { path: '/' });
			}

			return {
				success: true,
				remembered: rememberMe,
				location // Return location to frontend for payment messaging
			};
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
