import fm from 'front-matter';
import { marked } from 'marked';

// EN: Formats a category slug (e.g. 'core_concepts') into a readable name ('Core Concepts').
// IT: Formatta uno slug di categoria (es. 'core_concepts') in un nome leggibile ('Core Concepts').
function formatCategoryName(text: string) {
	const words = text.replace(/_/g, ' ').split(' ');
	return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

// EN: Builds a short excerpt from the post content, in both HTML and plain-text form.
// IT: Costruisce un breve estratto dal contenuto del post, in forma sia HTML sia testo semplice.
async function createExcerpt(
	content: string,
	maxLength = 150
): Promise<{ html: string; plain: string }> {
	const contentWithoutFrontmatter = content.replace(/---[\s\S]*?---/, '').trim();

	// EN: Truncate without cutting a word in half.
	// IT: Tronca senza tagliare una parola a metà.
	const truncated =
		contentWithoutFrontmatter.length <= maxLength
			? contentWithoutFrontmatter
			: contentWithoutFrontmatter
					.slice(0, maxLength)
					.slice(
						0,
						Math.min(contentWithoutFrontmatter.length, contentWithoutFrontmatter.lastIndexOf(' '))
					) + '...';

	const html = await marked.parse(truncated);

	// EN: Plain-text version: strip the basic Markdown syntax.
	// IT: Versione in testo semplice: rimuove la sintassi Markdown di base.
	const plain = truncated
		.replace(/(\*\*|__)(.*?)\1/g, '$2')
		.replace(/(\*|_)(.*?)\1/g, '$2')
		.replace(/#{1,6}\s+(.*)/g, '$1')
		.replace(/\[(.*?)\]\(.*?\)/g, '$1');

	return { html, plain };
}

// EN: A source or citation listed in a post's front matter.
// IT: Una fonte o citazione elencata nel front matter di un post.
export interface Source {
	text: string;
	url: string;
}

// EN: The main data structure for a post.
// IT: La struttura dati principale di un post.
export interface Post {
	lang: string;
	categorySlug: string;
	categoryName: string;
	slug: string;
	title: string;
	excerpt: string; // EN: HTML version / IT: versione HTML
	plainExcerpt: string; // EN: Plain text version / IT: versione testo semplice
	content?: string; // EN: Full Markdown content / IT: contenuto Markdown completo
	sources?: Source[];
}

// EN: In-memory cache, populated on first load to avoid reprocessing.
// IT: Cache in memoria, popolata al primo caricamento per evitare di rielaborare.
let allPosts: Post[] = [];

// EN: Fetches, parses and caches all posts from '/src/content'.
// IT: Recupera, analizza e mette in cache tutti i post da '/src/content'.
export const getPosts = async (): Promise<Post[]> => {
	if (allPosts.length > 0) {
		return allPosts;
	}

	// EN: '?raw' imports each Markdown file as a plain text string.
	// IT: '?raw' importa ogni file Markdown come stringa di testo grezzo.
	const allPostFiles = import.meta.glob('/src/content/**/*.md', { query: '?raw' });

	const postPromises = Object.entries(allPostFiles).map(async ([path, resolver]) => {
		const mod = (await resolver()) as { default: string };
		const rawContent = mod.default;

		const { attributes, body } = fm<any>(rawContent);

		if (!attributes) {
			console.warn(`ATTENZIONE: Frontmatter non trovato per il file: ${path}`);
			return null;
		}

		// EN: Extract language, category and slug from the file path.
		// IT: Estrae lingua, categoria e slug dal percorso del file.
		const match = path.match(/\/src\/content\/([^/]+)\/([^/]+)\/([^/]+)\.md$/);
		if (!match) {
			return null;
		}

		const [, lang, categorySlug, slug] = match;

		// EN: Use the front-matter excerpt if present, otherwise derive one from the body.
		// IT: Usa l'estratto del front matter se presente, altrimenti lo ricava dal corpo.
		const excerptData = attributes.excerpt
			? { html: await marked.parse(attributes.excerpt), plain: attributes.excerpt }
			: await createExcerpt(body);

		const post: Post = {
			lang,
			categorySlug,
			slug,
			categoryName: formatCategoryName(categorySlug),
			title: attributes.title || 'Senza Titolo',
			excerpt: excerptData.html,
			plainExcerpt: excerptData.plain,
			sources: attributes.sources,
			content: body
		};

		return post;
	});

	const resolvedPosts = await Promise.all(postPromises);

	allPosts = resolvedPosts.filter((p): p is Post => p !== null);

	return allPosts;
};
