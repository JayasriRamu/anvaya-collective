import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { inquiries } from '$lib/server/db/schema'; // Ensure path matches your project structure

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const name = data.get('name')?.toString() || '';
		const mobile = data.get('mobile')?.toString() || '';
		const interest = data.get('interest')?.toString() || '';
		const ageGroup = data.get('ageGroup')?.toString() || '';
		const message = data.get('message')?.toString() || '';

		const cleanMobile = mobile.replace(/\D/g, '');

		if (cleanMobile.length !== 10) {
			return fail(400, { invalidMobile: true, name, interest, ageGroup, message });
		}

		try {
			await db.insert(inquiries).values({
				name,
				email: cleanMobile, // Mapping mobile to email column as per your logic
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
