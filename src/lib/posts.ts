import fm from 'front-matter';
import { marked } from 'marked';
import { categoryColors, defaultCategoryColor } from '$lib/config';

// Formats a category slug (e.g. 'core_concepts') into a readable name ('Core Concepts').
function formatCategoryName(text: string) {
	const words = text.replace(/_/g, ' ').split(' ');
	return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

// Builds a short excerpt from the post content, in both HTML and plain-text form.
async function createExcerpt(
	content: string,
	maxLength = 150
): Promise<{ html: string; plain: string }> {
	const contentWithoutFrontmatter = content.replace(/---[\s\S]*?---/, '').trim();

	// Truncate without cutting a word in half.
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

	// Plain-text version: strip the basic Markdown syntax.
	const plain = truncated
		.replace(/(\*\*|__)(.*?)\1/g, '$2')
		.replace(/(\*|_)(.*?)\1/g, '$2')
		.replace(/#{1,6}\s+(.*)/g, '$1')
		.replace(/\[(.*?)\]\(.*?\)/g, '$1');

	return { html, plain };
}

// A source or citation listed in a post's front matter.
export interface Source {
	text: string;
	url: string;
}

// The main data structure for a post.
export interface Post {
	lang: string;
	categorySlug: string;
	categoryName: string;
	categoryColor: string;
	slug: string;
	title: string;
	excerpt: string; // HTML version
	plainExcerpt: string; // Plain text version
	content?: string; // Full Markdown content
	sources?: Source[];
}

// In-memory cache, populated on first load to avoid reprocessing.
let allPosts: Post[] = [];

// Fetches, parses and caches all posts from '/src/content'.
export const getPosts = async (): Promise<Post[]> => {
	if (allPosts.length > 0) {
		return allPosts;
	}

	// '?raw' imports each Markdown file as a plain text string.
	const allPostFiles = import.meta.glob('/src/content/**/*.md', { query: '?raw' });

	const postPromises = Object.entries(allPostFiles).map(async ([path, resolver]) => {
		const mod = (await resolver()) as { default: string };
		const rawContent = mod.default;

		const { attributes, body } = fm<any>(rawContent);

		if (!attributes) {
			console.warn(`ATTENZIONE: Frontmatter non trovato per il file: ${path}`);
			return null;
		}

		// Extract language, category and slug from the file path.
		const match = path.match(/\/src\/content\/([^/]+)\/([^/]+)\/([^/]+)\.md$/);
		if (!match) {
			return null;
		}

		const [, lang, categorySlug, slug] = match;

		// Use the front-matter excerpt if present, otherwise derive one from the body.
		const excerptData = attributes.excerpt
			? { html: await marked.parse(attributes.excerpt), plain: attributes.excerpt }
			: await createExcerpt(body);

		const post: Post = {
			lang,
			categorySlug,
			slug,
			categoryName: formatCategoryName(categorySlug),
			categoryColor: categoryColors[categorySlug] || defaultCategoryColor,
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
