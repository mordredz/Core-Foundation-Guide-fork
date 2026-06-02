<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import '../app.css';
	import NeuralBackground from '$lib/components/NeuralBackground.svelte';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
</script>

<!-- EN: Animated background, sits behind everything. -->
<!-- IT: Sfondo animato, posizionato dietro a tutto. -->
<NeuralBackground />

<!-- EN: 'isolate' creates a stacking context so the z-index plays nicely with the background. -->
<!-- IT: 'isolate' crea un contesto di impilamento così lo z-index funziona bene con lo sfondo. -->
<div class="relative isolate z-10">
	<Header />

	<!-- EN: Sticky-footer layout: min-h-screen + flex-grow main; pt-20 clears the fixed header. -->
	<!-- IT: Layout con footer in fondo: min-h-screen + main flex-grow; pt-20 lascia spazio all'header fisso. -->
	<div class="flex min-h-screen flex-col pt-20">
		<main class="flex-grow">
			<slot />
		</main>

		<Footer />
	</div>
</div>
