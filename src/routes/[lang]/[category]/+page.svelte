<!-- src/routes/[lang]/[category]/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import NodeGrid from '$lib/components/NodeGrid.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import type { Post } from '$lib/posts';
	import { type Language, fallbackTranslations } from '$lib/translations';

	export let data: PageData;

	const posts = data.posts;
	const lang = data.lang as Language;
	const category = data.category;
	const t = lang && data.translations ? data.translations[lang] : fallbackTranslations;

	// NOTE: not currently wired to <NodeGrid> below, so cards on this page don't
	// navigate. Add `on:cardclick={handleCardClick}` to enable it.
	function handleCardClick(event: CustomEvent<{ post: Post }>) {
		const { post } = event.detail;
		goto(`${base}/${post.lang}/${post.categorySlug}/${post.slug}.html`);
	}
</script>

<SEO
	title={`${t.pageTitleCategory}: ${category}`}
	description={`Esplora tutti gli articoli nella categoria ${category}`}
/>

<div class="pb-8 pt-12 text-center">
	<h1 class="text-4xl font-bold uppercase tracking-widest text-white">
		{t.pageTitleCategory}: <span class="text-cyan-400">{category}</span>
	</h1>
</div>

<div class="mx-auto max-w-7xl px-4 pb-12">
	{#if posts.length > 0}
		<NodeGrid {posts} />
	{:else}
		<p class="text-center text-slate-500">{t.noPostsFound}</p>
	{/if}
</div>
