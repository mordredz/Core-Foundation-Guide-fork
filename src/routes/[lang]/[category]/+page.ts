// src/routes/[lang]/[category]/+page.ts
import { getPosts } from '$lib/posts';
import type { PageLoad } from './$types';

// EN: Loads a category index page: all posts for the given language + category.
// IT: Carica una pagina indice di categoria: tutti i post per la lingua + categoria date.
export const load: PageLoad = async ({ params, parent }) => {
	const lang = params.lang.replace(/\.html$/, '');
	const category = params.category.replace(/\.html$/, '');

	const { translations } = await parent();

	const allPosts = await getPosts();
	const posts = allPosts.filter((p) => p.lang === lang && p.categorySlug === category);

	return {
		posts,
		lang,
		category,
		translations
	};
};
