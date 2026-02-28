import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { inquiries } from '$lib/server/db/schema';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

const inquirySchema = z.object({
	dancerName: z.string().min(1, 'Dancer Name is required'),
	email: z.string().email('Invalid email address'),
	phoneNumber: z.string().optional(),
	danceStyle: z.string().min(1, 'Dance Style is required'),
	message: z.string().optional()
});

export const load = async () => {
	const form = await superValidate(inquirySchema);
	return { form };
};

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, inquirySchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await db.insert(inquiry).values({
				dancerName: form.data.dancerName,
				email: form.data.email,
				phoneNumber: form.data.phoneNumber,
				danceStyle: form.data.danceStyle,
				message: form.data.message
			});
		} catch (error) {
			console.error('Error submitting inquiry:', error);
			return fail(500, { form, message: 'Failed to submit inquiry. Please try again later.' });
		}

		return { form, message: 'Inquiry submitted successfully!' };
	}
};
