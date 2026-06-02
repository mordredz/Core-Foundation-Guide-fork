// src/routes/[lang]/[category]/+page.ts
import { getPosts } from '$lib/posts';
import type { PageLoad } from './$types';

// Loads a category index page: all posts for the given language + category.
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
