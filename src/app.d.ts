// src/app.d.ts
declare global {
	namespace App {
		interface Locals {
			stats: {
				views: number;
				lastVisit: string;
			};
		}
	}
}
export {};
