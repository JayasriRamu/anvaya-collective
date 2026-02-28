// place files you want to import through the `$lib` alias in this folder.
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { env } from '$env/dynamic/private';

// Ensure the environment variables are defined
if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
if (!env.DATABASE_AUTH_TOKEN) throw new Error('DATABASE_AUTH_TOKEN is not set');

const client = createClient({
	url: env.DATABASE_URL,
	authToken: env.DATABASE_AUTH_TOKEN
});

export const db = drizzle(client);
