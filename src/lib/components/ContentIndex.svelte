<!-- src/lib/components/ContentIndex.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import type { CategoryIndex } from '../../routes/[lang]/+page';
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { createEventDispatcher } from 'svelte';

	export let postIndex: CategoryIndex[] = [];
	const dispatch = createEventDispatcher();

	// EN: Slug of the category open in the mobile accordion.
	// IT: Slug della categoria aperta nella fisarmonica mobile.
	let openCategorySlug: string | null = null;
	// EN: Category panel elements, for the GSAP border effect.
	// IT: Elementi dei pannelli di categoria, per l'effetto bordo con GSAP.
	let categoryPanels: HTMLElement[] = [];

	function toggleCategory(slug: string) {
		openCategorySlug = openCategorySlug === slug ? null : slug;
	}

	// EN: Tell the parent which post was clicked (for smooth scroll-to-card).
	// IT: Comunica al genitore quale post è stato cliccato (per lo scroll fluido alla card).
	function handleLinkClick(slug: string) {
		dispatch('indexclick', slug);
	}

	onMount(() => {
		categoryPanels.forEach((panel) => {
			if (!panel) return;

			// EN: clientWidth > 0 means this is the visible desktop grid, not the hidden mobile layout.
			// IT: clientWidth > 0 indica la griglia desktop visibile, non il layout mobile nascosto.
			if (panel.clientWidth > 0) {
				const rect = panel.querySelector<SVGRectElement>('.glow-rect');
				if (!rect) return;

				const length = rect.getTotalLength();
				const impulseLength = length * 0.25;

				// EN: stroke-dasharray/offset trick: a moving "impulse" travelling along the border.
				// IT: trucco stroke-dasharray/offset: un "impulso" in movimento lungo il bordo.
				gsap.set(rect, {
					strokeDasharray: `${impulseLength} ${length}`,
					strokeDashoffset: impulseLength,
					opacity: 0
				});

				gsap.from(rect, {
					strokeDashoffset: length,
					duration: 2.5,
					ease: 'none',
					repeat: -1
				});

				// EN: Fade the glowing border in/out on hover.
				// IT: Mostra/nasconde in dissolvenza il bordo luminoso all'hover.
				panel.addEventListener('mouseenter', () => {
					gsap.to(rect, { opacity: 1, duration: 0.3 });
				});
				panel.addEventListener('mouseleave', () => {
					gsap.to(rect, { opacity: 0, duration: 0.3 });
				});
			}
		});
	});
</script>

<div class="mx-auto mb-16 w-full max-w-7xl px-4">
	<!-- EN: Desktop: grid of category panels with the animated border. -->
	<!-- IT: Desktop: griglia di pannelli di categoria con il bordo animato. -->
	<div class="hidden gap-6 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
		{#each postIndex as category, i (category.categorySlug)}
			<div
				bind:this={categoryPanels[i]}
				class="relative rounded-xl border border-cyan-900/50
                       bg-gradient-to-br from-cyan-950/20 to-slate-950/10
                       p-5 backdrop-blur-lg"
			>
				<!-- EN: SVG holding the animated glowing border, sitting behind the content. -->
				<!-- IT: SVG che contiene il bordo luminoso animato, dietro al contenuto. -->
				<svg
					class="glow-svg pointer-events-none absolute inset-0 h-full w-full"
					width="100%"
					height="100%"
					fill="none"
				>
					<defs>
						<filter id="glow-filter">
							<feGaussianBlur stdDeviation="1" result="coloredBlur" />
						</filter>
						<linearGradient id="impulse-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
							<stop offset="0%" stop-color="#FEF08A" />
							<stop offset="100%" stop-color="#FBBF24" stop-opacity="0" />
						</linearGradient>
					</defs>
					<rect
						class="glow-rect"
						x="1"
						y="1"
						width="calc(100% - 2px)"
						height="calc(100% - 2px)"
						rx="11"
						stroke="url(#impulse-gradient)"
						stroke-width="0.8"
						filter="url(#glow-filter)"
					/>
				</svg>

				<h3 class="mb-4 border-b-2 border-amber-800/50 pb-2 text-lg font-bold text-amber-400">
					{category.categoryName}
				</h3>
				<ul class="space-y-2">
					{#each category.posts as post (post.slug)}
						<li class="group/item relative">
							<!-- EN: preventDefault stops the anchor jump; handleLinkClick drives the custom smooth scroll. -->
							<!-- IT: preventDefault blocca il salto dell'ancora; handleLinkClick gestisce lo scroll fluido personalizzato. -->
							<a
								href={`#${post.slug}`}
								on:click|preventDefault={() => handleLinkClick(post.slug)}
								class="flex items-center pl-6 text-slate-300 transition-colors
                                       before:absolute
                                       before:left-0 before:top-0 before:text-cyan-700 before:transition-colors
                                       before:content-['└─'] hover:text-white
                                       group-hover/item:before:text-amber-400"
							>
								<span>{post.title}</span>
							</a>
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</div>

	<!-- EN: Mobile: accordion showing one category at a time. -->
	<!-- IT: Mobile: fisarmonica che mostra una categoria alla volta. -->
	<div class="space-y-3 md:hidden">
		{#each postIndex as category (category.categorySlug)}
			<div class="overflow-hidden rounded-lg border border-slate-800 bg-slate-900/50">
				<button
					on:click={() => toggleCategory(category.categorySlug)}
					class="flex w-full items-center justify-between p-4 text-left"
				>
					<span class="font-bold text-amber-400">{category.categoryName}</span>
					<svg
						class="h-5 w-5 text-slate-400 transition-transform duration-300 {openCategorySlug ===
						category.categorySlug
							? 'rotate-180'
							: ''}"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19 9l-7 7-7-7"
						/>
					</svg>
				</button>

				{#if openCategorySlug === category.categorySlug}
					<div
						class="border-t border-slate-800 px-4 pb-4"
						transition:slide={{ duration: 300, easing: quintOut }}
					>
						<ul class="mt-4 space-y-2">
							{#each category.posts as post (post.slug)}
								<li class="group relative">
									<a
										href={`#${post.slug}`}
										on:click|preventDefault={() => handleLinkClick(post.slug)}
										class="block py-1 pl-6 text-slate-300 transition-colors
                               before:absolute
                               before:left-0 before:top-1 before:text-cyan-700 before:transition-colors
                               before:content-['└─'] hover:text-white
                               group-hover:before:text-amber-400"
									>
										{post.title}
									</a>
								</li>
							{/each}
						</ul>
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>
