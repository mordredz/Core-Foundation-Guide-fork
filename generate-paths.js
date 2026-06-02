// generate-paths.js
import fs from 'fs';
import path from 'path';

/**
 * Scans 'src/content' to build the list of URL paths to prerender.
 * SvelteKit needs this because the routes are dynamic ([lang]/[category]/[slug]).
 * @returns {string[]} Unique URL paths to prerender.
 */
export function generatePaths() {
	const contentDir = path.resolve(process.cwd(), 'src/content');

	// Language directories (e.g. 'en', 'it').
	const languages = fs
		.readdirSync(contentDir)
		.filter((item) => fs.statSync(path.join(contentDir, item)).isDirectory());

	// A Set keeps the paths unique.
	const paths = new Set();
	paths.add('/');

	for (const lang of languages) {
		paths.add(`/${lang}.html`);
		const langDir = path.join(contentDir, lang);

		// Category directories within the language.
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
