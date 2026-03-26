import { betterAuth } from 'better-auth/minimal';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { env } from '$env/dynamic/private';
import { getRequestEvent } from '$app/server';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';

export const auth = betterAuth({
	baseURL: env.BETTER_AUTH_URL || env.ORIGIN,
	secret: env.BETTER_AUTH_SECRET,
	session: {
		cookieCache: {
			enabled: true,
			maxAge: 60 * 60 * 24 * 30 // 30 days
		}
	},
	database: drizzleAdapter(db, { provider: 'sqlite', schema: schema }),
	// ADD THIS: Google Social Provider
	socialProviders: {
		google: {
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET
		}
	},
	emailAndPassword: { enabled: true },
	plugins: [sveltekitCookies(getRequestEvent)] // make sure this is the last plugin in the array
});
