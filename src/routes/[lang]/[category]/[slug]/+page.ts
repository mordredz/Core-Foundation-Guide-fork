// src/routes/[lang]/[category]/[slug]/+page.ts
import { getPosts } from '$lib/posts';
import type { PageLoad } from './$types';
import { marked } from 'marked';
import { error } from '@sveltejs/kit';

// Strips all HTML tags from a string.
function htmlToPlainText(html: string): string {
	return html
		.replace(/<[^>]*>/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

// Cleans Markdown into text suitable for a Text-to-Speech engine.
function cleanTextForSpeech(markdown: string): string {
	return (
		markdown
			// Remove YAML front matter.
			.replace(/---[\s\S]*?---/, '')
			// Remove citation numbers like [1], [2].
			.replace(/\[\d+\]/g, '')
			// Decode numeric HTML entities.
			.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
			// Keep only the text of Markdown links.
			.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
			// Drop emphasis characters (*, _, **).
			.replace(/(\*\*|\*|_)/g, '')
			// Turn headings into plain text + ';' for a short pause.
			.replace(/^[#]{1,6}\s+(.*)/gm, '$1;')
			.replace(/\s+/g, ' ')
			.trim()
	);
}

// Loads a single post, processes its content, and prepares SEO + TTS data.
export const load: PageLoad = async ({ params, parent }) => {
	// Strip the '.html' suffix used to make deep links work on static hosting.
	const lang = params.lang.replace(/\.html$/, '');
	const category = params.category.replace(/\.html$/, '');
	const slug = params.slug.replace(/\.html$/, '');

	// Don't allow traversal toward hidden files (e.g. .git, .env).
	if (lang.startsWith('.') || category.startsWith('.') || slug.startsWith('.')) {
		throw error(404, 'Not Found');
	}

	const { translations } = await parent();

	const allPosts = await getPosts();
	const post = allPosts.find(
		(p) => p.lang === lang && p.categorySlug === category && p.slug === slug
	);

	if (!post) {
		throw error(404, 'Not Found');
	}

	const markdownContent = post.content || '';
	const htmlContent = await marked.parse(markdownContent);
	const cleanText = cleanTextForSpeech(markdownContent);
	const textContent = `${post.title}. ${cleanText}`; // Prepend the title for TTS context.

	const seo = {
		title: post.title,
		description: post.plainExcerpt || htmlToPlainText(htmlContent).substring(0, 155)
	};

	// Replace the raw Markdown with the rendered HTML.
	const processedPost = { ...post, content: htmlContent };

	return {
		post: processedPost,
		translations,
		seo,
		textContent
	};
};
