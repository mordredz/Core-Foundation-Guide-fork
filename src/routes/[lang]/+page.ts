// src/routes/[lang]/+page.ts
import { getPosts } from '$lib/posts';
import type { PageLoad } from './$types';

// Minimal post shape used in index lists.
export interface PostForIndex {
	title: string;
	slug: string;
}

// A category group with its posts, used by the content index.
export interface CategoryIndex {
	categoryName: string;
	categorySlug: string;
	posts: PostForIndex[];
}

// Loads the language landing page: all posts for the language, grouped by category.
export const load: PageLoad = async ({ params, parent }) => {
	const lang = params.lang.replace(/\.html$/, '');

	const { translations } = await parent();

	const allPosts = await getPosts();
	const posts = allPosts.filter((p) => p.lang === lang);

	// Display order for the categories.
	const categoryOrder = ['fundamentals', 'system_anatomy', 'core_concepts', 'advanced_topics'];

	// Group posts by category.
	const postIndex = posts.reduce<CategoryIndex[]>((accumulator, currentPost) => {
		let categoryGroup = accumulator.find(
			(group) => group.categorySlug === currentPost.categorySlug
		);

		if (!categoryGroup) {
			categoryGroup = {
				categoryName: currentPost.categoryName,
				categorySlug: currentPost.categorySlug,
				posts: []
			};
			accumulator.push(categoryGroup);
		}

		categoryGroup.posts.push({
			title: currentPost.title,
			slug: currentPost.slug
		});
		return accumulator;
	}, []);

	// Sort by the predefined order; unknown categories go last.
	postIndex.sort((a, b) => {
		const indexA = categoryOrder.indexOf(a.categorySlug);
		const indexB = categoryOrder.indexOf(b.categorySlug);
		if (indexA === -1) return 1;
		if (indexB === -1) return -1;
		return indexA - indexB;
	});

	return {
		lang,
		posts,
		postIndex,
		translations
	};
};
