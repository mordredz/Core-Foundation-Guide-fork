// vite.config.ts
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],

	resolve: {
		// Keep path aliases in sync with svelte.config.js and tsconfig.
		alias: {
			$lib: '/src/lib'
		}
	},

	optimizeDeps: {
		// Pre-bundle gsap for a smoother dev server start.
		include: ['gsap']
	}
});
