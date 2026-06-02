// vite.config.ts
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],

	resolve: {
		// EN: Keep path aliases in sync with svelte.config.js and tsconfig.
		// IT: Mantiene gli alias dei percorsi allineati con svelte.config.js e tsconfig.
		alias: {
			$lib: '/src/lib'
		}
	},

	optimizeDeps: {
		// EN: Pre-bundle gsap for a smoother dev server start.
		// IT: Pre-impacchetta gsap per un avvio più fluido del dev server.
		include: ['gsap']
	}
});
