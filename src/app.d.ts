// src/app.d.ts
declare global {
	namespace App {
		interface Locals {
			stats: {
				views: number;
				lastVisit: string;
			};
			// Add this line to handle the form submission status
			userMobile: string | null;
			formSubmitted: boolean;
		}
	}
}
export {};
