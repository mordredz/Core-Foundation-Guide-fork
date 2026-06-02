<!-- src/lib/components/NodeCard.svelte -->
<script lang="ts">
	export let title: string;
	export let categoryName: string;
	export let excerpt: string | undefined;
</script>

<!-- EN: 3-row card (title / excerpt / category). The group-hover styles are driven by NodeGrid. -->
<!-- IT: Card a 3 righe (titolo / estratto / categoria). Gli stili group-hover sono guidati da NodeGrid. -->
<div
	class="card-border card-shadow relative grid
	         h-full w-full grid-rows-[auto_1fr_auto]
	         rounded-xl border-2 border-cyan-500/30
	         bg-gradient-to-br from-cyan-950/20
	         to-slate-950/10 shadow-lg

	         shadow-cyan-900/50 backdrop-blur-lg
	         group-hover:border-amber-400/80 group-hover:shadow-amber-500/20"
>
	<!-- EN: Title / IT: Titolo -->
	<div class="p-4 pb-3 md:p-5 md:pb-4">
		<h2 class="card-title text-base font-bold text-gray-100 group-hover:text-amber-400">{title}</h2>
	</div>

	<!-- EN: Excerpt / IT: Estratto -->
	<div
		class="card-divider relative overflow-hidden border-t border-cyan-500/20 group-hover:border-amber-400/30"
	>
		<div class="h-full p-4 pt-3 md:p-5 md:pt-4">
			{#if excerpt}
				<!-- EN: `prose` (Tailwind Typography) styles the HTML rendered from markdown. -->
				<!-- IT: `prose` (Tailwind Typography) stila l'HTML generato dal markdown. -->
				<div
					class="prose prose-sm
	                    prose-invert leading-snug text-gray-400 prose-p:text-gray-400 prose-strong:text-amber-400"
				>
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html excerpt}
				</div>
			{:else}
				<div class="text-transparent">Nessuna anteprima.</div>
			{/if}
		</div>
		<!-- EN: Gradient fade at the bottom of the excerpt. -->
		<!-- IT: Sfumatura a gradiente in fondo all'estratto. -->
		<div
			class="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-slate-950/60 to-transparent"
		></div>
	</div>

	<!-- EN: Category footer / IT: Footer della categoria -->
	<div>
		<div class="card-divider border-t border-cyan-500/20 group-hover:border-amber-400/30"></div>
		<div
			class="card-category-text flex items-center justify-end gap-2 p-3 text-right text-xs font-semibold text-cyan-400 group-hover:text-amber-500"
		>
			<span>{categoryName}</span>
			<div
				class="card-category-dot h-2 w-2 rounded-full bg-cyan-400 group-hover:bg-amber-500"
			></div>
		</div>
	</div>
</div>
