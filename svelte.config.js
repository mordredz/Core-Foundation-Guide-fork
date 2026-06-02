// svelte.config.js

// EN: Static adapter: prerenders the site to plain files for GitHub Pages.
// IT: Adapter statico: pre-renderizza il sito in file statici per GitHub Pages.
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// EN: Generates the full list of content paths to prerender.
// IT: Genera l'elenco completo dei percorsi dei contenuti da pre-renderizzare.
import { generatePaths } from './generate-paths.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// EN: Only treat .svelte files as components (avoids conflicts with .md content).
	// IT: Considera componenti solo i file .svelte (evita conflitti con i contenuti .md).
	extensions: ['.svelte'],

	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),

		paths: {
			// EN: Empty in dev; set to the repo name for production on GitHub Pages.
			// IT: Vuoto in dev; impostato al nome del repo in produzione su GitHub Pages.
			base: process.env.NODE_ENV === 'production' ? '/Core-Foundation-Guide' : ''
		},

		alias: {
			$lib: 'src/lib'
		},

		prerender: {
			// EN: The dynamic [lang]/[category]/[slug] routes can't be discovered
			//     automatically, so we feed SvelteKit the complete list.
			// IT: Le rotte dinamiche [lang]/[category]/[slug] non sono individuabili
			//     in automatico, quindi forniamo a SvelteKit l'elenco completo.
			entries: generatePaths()
		}
	}
};

export default config;
