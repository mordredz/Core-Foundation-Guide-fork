// src/routes/[lang]/[category]/[slug]/+page.ts
import { getPosts } from '$lib/posts';
import type { PageLoad } from './$types';
import { marked } from 'marked';
import { error } from '@sveltejs/kit';

// EN: Strips all HTML tags from a string.
// IT: Rimuove tutti i tag HTML da una stringa.
function htmlToPlainText(html: string): string {
	return html
		.replace(/<[^>]*>/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

// EN: Cleans Markdown into text suitable for a Text-to-Speech engine.
// IT: Pulisce il Markdown in testo adatto a un motore Text-to-Speech.
function cleanTextForSpeech(markdown: string): string {
	return (
		markdown
			// EN: Remove YAML front matter. / IT: Rimuove il front matter YAML.
			.replace(/---[\s\S]*?---/, '')
			// EN: Remove citation numbers like [1], [2]. / IT: Rimuove i numeri di citazione come [1], [2].
			.replace(/\[\d+\]/g, '')
			// EN: Decode numeric HTML entities. / IT: Decodifica le entità HTML numeriche.
			.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
			// EN: Keep only the text of Markdown links. / IT: Mantiene solo il testo dei link Markdown.
			.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
			// EN: Drop emphasis characters (*, _, **). / IT: Rimuove i caratteri di enfasi (*, _, **).
			.replace(/(\*\*|\*|_)/g, '')
			// EN: Turn headings into plain text + ';' for a short pause.
			// IT: Trasforma le intestazioni in testo + ';' per una breve pausa.
			.replace(/^[#]{1,6}\s+(.*)/gm, '$1;')
			.replace(/\s+/g, ' ')
			.trim()
	);
}

// EN: Loads a single post, processes its content, and prepares SEO + TTS data.
// IT: Carica un singolo post, ne elabora il contenuto e prepara i dati per SEO + TTS.
export const load: PageLoad = async ({ params, parent }) => {
	// EN: Strip the '.html' suffix used to make deep links work on static hosting.
	// IT: Rimuove il suffisso '.html' usato per far funzionare i deep link sull'hosting statico.
	const lang = params.lang.replace(/\.html$/, '');
	const category = params.category.replace(/\.html$/, '');
	const slug = params.slug.replace(/\.html$/, '');

	// EN: Don't allow traversal toward hidden files (e.g. .git, .env).
	// IT: Impedisce l'accesso a file nascosti (es. .git, .env).
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
	const textContent = `${post.title}. ${cleanText}`; // EN: Prepend the title for TTS context. / IT: Antepone il titolo per il contesto TTS.

	const seo = {
		title: post.title,
		description: post.plainExcerpt || htmlToPlainText(htmlContent).substring(0, 155)
	};

	// EN: Replace the raw Markdown with the rendered HTML.
	// IT: Sostituisce il Markdown grezzo con l'HTML renderizzato.
	const processedPost = { ...post, content: htmlContent };

	return {
		post: processedPost,
		translations,
		seo,
		textContent
	};
};
