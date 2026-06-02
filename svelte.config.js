// svelte.config.js

// Static adapter: prerenders the site to plain files for GitHub Pages.
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// Generates the full list of content paths to prerender.
import { generatePaths } from './generate-paths.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Only treat .svelte files as components (avoids conflicts with .md content).
	extensions: ['.svelte'],

	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),

		paths: {
			// Empty in dev; set to the repo name for production on GitHub Pages.
			base: process.env.NODE_ENV === 'production' ? '/Core-Foundation-Guide' : ''
		},

		alias: {
			$lib: 'src/lib'
		},

		prerender: {
			// The dynamic [lang]/[category]/[slug] routes can't be discovered
			// automatically, so we feed SvelteKit the complete list.
			entries: generatePaths()
		}
	}
};

export default config;
