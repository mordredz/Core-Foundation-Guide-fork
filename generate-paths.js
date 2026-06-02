// generate-paths.js
import fs from 'fs';
import path from 'path';

/**
 * EN: Scans 'src/content' to build the list of URL paths to prerender.
 *     SvelteKit needs this because the routes are dynamic ([lang]/[category]/[slug]).
 * IT: Analizza 'src/content' per costruire l'elenco dei percorsi URL da pre-renderizzare.
 *     Serve a SvelteKit perché le rotte sono dinamiche ([lang]/[category]/[slug]).
 * @returns {string[]} Unique URL paths to prerender.
 */
export function generatePaths() {
	const contentDir = path.resolve(process.cwd(), 'src/content');

	// EN: Language directories (e.g. 'en', 'it').
	// IT: Cartelle delle lingue (es. 'en', 'it').
	const languages = fs
		.readdirSync(contentDir)
		.filter((item) => fs.statSync(path.join(contentDir, item)).isDirectory());

	// EN: A Set keeps the paths unique.
	// IT: Un Set mantiene i percorsi univoci.
	const paths = new Set();
	paths.add('/');

	for (const lang of languages) {
		paths.add(`/${lang}.html`);
		const langDir = path.join(contentDir, lang);

		// EN: Category directories within the language.
		// IT: Cartelle delle categorie all'interno della lingua.
		const categories = fs
			.readdirSync(langDir)
			.filter((item) => fs.statSync(path.join(langDir, item)).isDirectory());

		for (const category of categories) {
			paths.add(`/${lang}/${category}.html`);
			const categoryDir = path.join(langDir, category);

			const files = fs.readdirSync(categoryDir).filter((file) => file.endsWith('.md'));

			for (const file of files) {
				const slug = file.replace(/\.md$/, '');
				paths.add(`/${lang}/${category}/${slug}.html`);
			}
		}
	}

	console.log(`Trovati ${paths.size} percorsi unici da generare.`);

	return Array.from(paths);
}
