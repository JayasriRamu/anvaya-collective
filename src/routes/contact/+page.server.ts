import { db } from '$lib/server/db';
import { inquiries } from '$lib/server/db/schema';
import { fail } from '@sveltejs/kit';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();

		// Extracting raw values
		const name = data.get('name')?.toString() || '';
		const mobile = data.get('mobile')?.toString() || ''; // From the 10-digit input
		const interest = data.get('interest')?.toString() || '';
		const ageGroup = data.get('ageGroup')?.toString() || '';
		const message = data.get('message')?.toString() || ''; // Full message content

		// Sanitization: Ensure only digits are saved (stripping any accidental +91 if pasted)
		const cleanMobile = mobile.replace(/\D/g, '');

		// Server-side validation check
		if (cleanMobile.length !== 10) {
			return fail(400, { invalidMobile: true, name, interest, ageGroup, message });
		}

		try {
			await db.insert(inquiries).values({
				name,
				email: cleanMobile, // Mapping the 10-digit mobile to your 'email' column
				interest,
				ageGroup,
				message
			});

			return { success: true };
		} catch (error) {
			console.error('Submission failed:', error);
			return fail(500, { message: 'Database error. Please try again later.' });
		}
	}
};
