<!-- src/lib/components/NodeGrid.svelte -->
<script lang="ts">
	import { onMount, createEventDispatcher, tick } from 'svelte';
	import NodeCard from '$lib/components/NodeCard.svelte';
	import type { Post } from '$lib/posts';
	import type { gsap as GSAP } from 'gsap';
	import { fly } from 'svelte/transition';

	export let posts: Post[] = [];

	type AnimateGridParams = { posts: Post[]; gsap: typeof GSAP | undefined };

	const dispatch = createEventDispatcher();
	// GSAP is imported lazily in onMount to keep it out of the initial bundle.
	let gsap: typeof GSAP | undefined = undefined;

	// Forward a card click to the parent (which performs navigation).
	function handleCardClick(event: MouseEvent | KeyboardEvent, post: Post) {
		dispatch('cardclick', {
			post: post,
			element: event.currentTarget
		});
	}

	// Svelte action that wires up all GSAP grid animations.
	function animateGrid(node: HTMLElement, params: AnimateGridParams) {
		let ctx: gsap.Context;
		async function init() {
			if (!params.gsap) return;
			// Wait for the cards to be in the DOM before selecting them.
			await tick();
			if (ctx) ctx.revert();
			const cards = params.gsap.utils.toArray<HTMLElement>('.card-container');
			if (cards.length === 0) return;
			ctx = params.gsap.context(() => {
				// Continuous, subtle floating motion for the cards.
				function createFloatingAnimation() {
					params.gsap!.to(cards, {
						y: (i) => params.gsap!.utils.random(-8, 8),
						duration: (i) => params.gsap!.utils.random(3, 5),
						repeat: -1,
						yoyo: true,
						ease: 'sine.inOut',
						delay: (i) => params.gsap!.utils.random(0, 4)
					});
				}
				// Pre-build a paused color timeline per card for cheap hover transitions.
				cards.forEach((card: any) => {
					card.colorTimeline = params
						.gsap!.timeline({ paused: true })
						.to(card.querySelectorAll('.card-border, .card-divider'), { borderColor: '#FBBF24' }, 0)
						.to(card.querySelector('.card-title'), { color: '#FBBF24' }, 0)
						.to(card.querySelector('.card-category-text'), { color: '#F59E0B' }, 0)
						.to(card.querySelector('.card-category-dot'), { backgroundColor: '#F59E0B' }, 0);
				});
				createFloatingAnimation();
				// Pause floating while the pointer is over the grid for a more direct feel.
				node.addEventListener('mouseenter', () => params.gsap!.killTweensOf(cards, 'y'));
				// Magnetic/repulsive interaction between the pointer and the cards.
				node.addEventListener('mousemove', (e: MouseEvent) => {
					const { left: gridX, top: gridY } = node.getBoundingClientRect();
					const mouseX = e.clientX - gridX;
					const mouseY = e.clientY - gridY;
					let activeCard: HTMLElement | null = null;
					for (const card of cards) {
						const { left, top, width, height } = card.getBoundingClientRect();
						const cardLeft = left - gridX;
						const cardTop = top - gridY;
						if (
							mouseX >= cardLeft &&
							mouseX <= cardLeft + width &&
							mouseY >= cardTop &&
							mouseY <= cardTop + height
						) {
							activeCard = card;
							break;
						}
					}
					cards.forEach((card: any) => {
						// The card under the pointer is highlighted and lifted.
						if (card === activeCard) {
							params.gsap!.to(card, {
								x: 0,
								y: -10,
								scale: 1.1,
								duration: 0.4,
								ease: 'power2.out',
								overwrite: 'auto'
							});
							if (card.colorTimeline) card.colorTimeline.play();
						} else {
							// The others are pushed away from the cursor.
							const { left, top, width, height } = card.getBoundingClientRect();
							const cardX = left - gridX + width / 2;
							const cardY = top - gridY + height / 2;
							const distance = Math.hypot(mouseX - cardX, mouseY - cardY);
							let targetX = 0,
								targetY = 0;
							if (distance < width * 4) {
								const angle = Math.atan2(mouseY - cardY, mouseX - cardX);
								const move = -400 / distance;
								targetX = Math.cos(angle) * move;
								targetY = Math.sin(angle) * move;
							}
							params.gsap!.to(card, {
								x: targetX,
								y: targetY,
								scale: 1,
								duration: 0.4,
								ease: 'power2.out',
								overwrite: 'auto'
							});
							if (card.colorTimeline) card.colorTimeline.reverse();
						}
					});
				});
				// Reset everything and resume floating when the pointer leaves.
				node.addEventListener('mouseleave', () => {
					params.gsap!.to(cards, {
						x: 0,
						y: 0,
						scale: 1,
						duration: 0.6,
						ease: 'elastic.out(1, 0.75)',
						onComplete: createFloatingAnimation
					});
					cards.forEach((card: any) => {
						if (card.colorTimeline) card.colorTimeline.reverse();
					});
				});
			}, node);
		}
		init();
		return {
			update(newParams: AnimateGridParams) {
				params = newParams;
				init();
			},
			destroy() {
				if (ctx) ctx.revert();
			}
		};
	}

	onMount(async () => {
		const mod = await import('gsap');
		gsap = mod.gsap;
	});
</script>

<div
	class="isolate grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
	use:animateGrid={{ posts, gsap }}
>
	<!-- Keyed by slug for efficient updates when the posts array changes. -->
	{#each posts as post (post.slug)}
		<div
			data-slug={post.slug}
			class="card-container aspect-square cursor-pointer"
			role="button"
			tabindex="0"
			on:click={(e) => handleCardClick(e, post)}
			on:keydown={(e) => {
				if (e.key === 'Enter') handleCardClick(e, post);
			}}
			in:fly={{ y: 20, duration: 300, delay: 100 }}
			out:fly={{ y: 20, duration: 200 }}
		>
			<NodeCard categoryName={post.categoryName} title={post.title} excerpt={post.excerpt} />
		</div>
	{/each}
</div>
