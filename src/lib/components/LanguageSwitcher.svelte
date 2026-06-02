<!-- src/lib/components/LanguageSwitcher.svelte -->
<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import { translations } from '$lib/translations';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { browser } from '$app/environment';
	import { base } from '$app/paths';

	const languageNames: Record<string, string> = {
		it: 'Italiano',
		en: 'English',
		fr: 'Français',
		es: 'Español',
		de: 'Deutsch',
		pt: 'Português'
	};

	// Available languages, derived from the translations object.
	const availableLanguages = Object.keys(translations).map((code) => ({
		code,
		name: languageNames[code] || code.toUpperCase()
	}));

	let isOpen = false;
	let switcherElement: HTMLElement; // Root element, used for outside-click detection.

	// Builds the URL for `newLang`, preserving the current category/slug context.
	function getLanguageUrl(newLang: string): string {
		const currentPath = $page.url.pathname.replace(/\.html$/, '');
		const parts = currentPath.split('/');

		// Path looks like ['', 'Core-Foundation-Guide', 'it', 'category', 'slug']; lang is at index 2.
		if (parts.length > 2) {
			parts[2] = newLang;
			// Category or post page: rebuild the full path with the .html suffix.
			if (parts.length > 3) {
				return parts.join('/') + '.html';
			}
			// Language index page (e.g. /it).
			return `${base}/${newLang}.html`;
		}
		// Fallback for the root or unexpected paths.
		return `${base}/${newLang}.html`;
	}

	// Close the dropdown on a click outside the component.
	function handleClickOutside(event: MouseEvent) {
		if (switcherElement && !switcherElement.contains(event.target as Node)) {
			isOpen = false;
		}
	}

	if (browser) {
		onMount(() => {
			window.addEventListener('click', handleClickOutside);
		});
		onDestroy(() => {
			window.removeEventListener('click', handleClickOutside);
		});
	}
</script>

<svg class="hidden">
	<symbol
		id="icon-globe"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<circle cx="12" cy="12" r="10" />
		<line x1="2" y1="12" x2="22" y2="12" />
		<path
			d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
		/>
	</symbol>
</svg>

<!-- Relative wrapper for the absolutely-positioned dropdown. -->
<div bind:this={switcherElement} class="relative">
	<button
		on:click={() => (isOpen = !isOpen)}
		aria-label="Change language"
		class="text-slate-400 transition-colors hover:text-white"
	>
		<svg class="h-6 w-6"><use href="#icon-globe" /></svg>
	</button>

	{#if isOpen}
		<div
			class="absolute right-0 top-full mt-3 w-40 origin-top-right rounded-lg border border-cyan-900/50
                   bg-slate-950 p-2 shadow-2xl shadow-black/50"
			transition:fly={{ y: -10, duration: 200, easing: quintOut }}
		>
			<ul class="space-y-1">
				{#each availableLanguages as lang}
					<li>
						<!-- data-sveltekit-reload forces a full reload so the new language's load runs. -->
						<a
							href={getLanguageUrl(lang.code)}
							data-sveltekit-reload
							class="block w-full rounded-md px-3 py-1.5 text-left text-sm font-medium transition-colors
                           {$page.params.lang === lang.code
								? 'text-amber-400'
								: 'text-slate-300 hover:bg-slate-800/50 hover:text-white'}"
							on:click={() => (isOpen = false)}
						>
							{lang.name}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>
