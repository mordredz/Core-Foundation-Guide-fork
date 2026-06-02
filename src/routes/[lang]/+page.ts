// src/routes/[lang]/+page.ts
import { getPosts } from '$lib/posts';
import type { PageLoad } from './$types';

// EN: Minimal post shape used in index lists.
// IT: Struttura minima di un post usata negli elenchi indice.
export interface PostForIndex {
	title: string;
	slug: string;
}

// EN: A category group with its posts, used by the content index.
// IT: Un gruppo di categoria con i suoi post, usato dall'indice dei contenuti.
export interface CategoryIndex {
	categoryName: string;
	categorySlug: string;
	posts: PostForIndex[];
}

// EN: Loads the language landing page: all posts for the language, grouped by category.
// IT: Carica la pagina iniziale della lingua: tutti i post della lingua, raggruppati per categoria.
export const load: PageLoad = async ({ params, parent }) => {
	const lang = params.lang.replace(/\.html$/, '');

	const { translations } = await parent();

	const allPosts = await getPosts();
	const posts = allPosts.filter((p) => p.lang === lang);

	// EN: Display order for the categories.
	// IT: Ordine di visualizzazione delle categorie.
	const categoryOrder = ['fundamentals', 'system_anatomy', 'core_concepts', 'advanced_topics'];

	// EN: Group posts by category.
	// IT: Raggruppa i post per categoria.
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

	// EN: Sort by the predefined order; unknown categories go last.
	// IT: Ordina secondo l'ordine predefinito; le categorie sconosciute vanno in fondo.
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
