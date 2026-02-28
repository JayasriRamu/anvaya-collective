import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { env } from '$env/dynamic/private';

// 1. If we are in production, use the TURSO_CONNECTION_URL from Vercel.
// 2. If we are local, use the file:local.db path.
const client = createClient({
	url: env.TURSO_CONNECTION_URL || 'file:local.db',
	authToken: env.TURSO_AUTH_TOKEN
});

export const db = drizzle(client);
