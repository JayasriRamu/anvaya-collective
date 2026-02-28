import adapter from '@sveltejs/adapter-vercel'; // Change this line
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		// Use adapter-vercel instead of adapter-auto
		adapter: adapter()
	}
};

export default config;
