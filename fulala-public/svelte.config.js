import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		alias: {
			$convex: './convex',
		}
	},
	onwarn: (warning, handler) => {
		// Suppress a11y warnings
		if (warning.code.startsWith('a11y')) return;
		handler(warning);
	}
};

export default config;
