<!-- src/routes/[lang]/[category]/[slug]/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import { gsap } from 'gsap';
	import type { PageData } from './$types';
	import { type Language, fallbackTranslations } from '$lib/translations';
	import SEO from '$lib/components/SEO.svelte';
	import SpeechControl from '$lib/components/SpeechControl.svelte';

	export let data: PageData;

	const post = data.post;
	const translations = data.translations;
	const seo = data.seo;
	const textContent = data.textContent; // EN: Cleaned text for the TTS control. / IT: Testo pulito per il controllo TTS.
	const lang = post?.lang as Language;
	const t = lang && translations ? translations[lang] : fallbackTranslations;

	// EN: Container for the GSAP fade-in.
	// IT: Contenitore per il fade-in di GSAP.
	let articleWrapper: HTMLElement;

	onMount(() => {
		if (articleWrapper) {
			gsap.to(articleWrapper, { autoAlpha: 1, duration: 0.4 });
		}
	});
</script>

<SEO title={seo.title} description={seo.description} />

<div class="flex w-full flex-grow items-center justify-center p-4 md:p-8">
	<!-- EN: Starts hidden (visibility: hidden) so GSAP can fade it in cleanly. -->
	<!-- IT: Parte nascosto (visibility: hidden) così GSAP può farlo comparire in dissolvenza. -->
	<div
		bind:this={articleWrapper}
		class="w-full max-w-4xl rounded-xl border-2 border-cyan-500/30 bg-gradient-to-br from-cyan-950/20 to-slate-950/10 p-6 shadow-2xl shadow-cyan-900/50 backdrop-blur-lg md:p-10"
		style="visibility: hidden;"
	>
		{#if post}
			<a
				href="{base}/{post.lang}.html"
				class="mb-8 block font-semibold text-cyan-400 transition-colors hover:text-amber-400"
			>
				&larr; {t.backToArticles}
			</a>

			<!-- EN: The `prose` classes (Tailwind Typography) style the rendered Markdown. -->
			<!-- IT: Le classi `prose` (Tailwind Typography) stilano il Markdown renderizzato. -->
			<article
				class="prose prose-invert lg:prose-xl prose-strong:text-amber-400 prose-ol:text-gray-400 prose-hr:border-cyan-500/30"
			>
				<h1>{post.title}</h1>

				{#if textContent}
					<div class="not-prose my-8">
						<SpeechControl text={textContent} lang={post.lang} {t} />
					</div>
				{/if}

				<!-- EN: Safe: content comes from trusted local Markdown files. -->
				<!-- IT: Sicuro: il contenuto proviene da file Markdown locali e affidabili. -->
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html post.content}

				{#if post.sources && post.sources.length > 0}
					<hr />
					<h2>{t.sources}</h2>
					<ol>
						{#each post.sources as source (source.url)}
							<li>
								<a
									href={source.url}
									target="_blank"
									rel="noopener noreferrer"
									class="text-cyan-400 transition-colors hover:text-amber-400 hover:underline"
								>
									{source.text}
								</a>
							</li>
						{/each}
					</ol>
				{/if}
			</article>
		{/if}
	</div>
</div>
