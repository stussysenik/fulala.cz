import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		port: 5175,
		fs: {
			allow: [path.resolve('convex')],
		},
	},
	build: {
		// Don't fail on warnings
		rollupOptions: {
			onwarn(warning, warn) {
				// Suppress a11y warnings
				if (warning.code === 'PLUGIN_WARNING' &&
					warning.message?.includes('a11y')) {
					return;
				}
				warn(warning);
			}
		}
	}
});
