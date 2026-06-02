<!-- src/lib/components/SEO.svelte -->
<script lang="ts">
	import { page } from '$app/stores';

	export let title: string;
	export let description: string;

	const siteName = 'Core Foundation Guide';

	$: fullTitle = `${title} | ${siteName}`;
	$: currentUrl = $page.url.href;
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />

	<!-- EN: Open Graph (Facebook, etc.) -->
	<!-- IT: Open Graph (Facebook, ecc.) -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content={currentUrl} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<!-- <meta property="og:image" content="URL_DI_UN_IMMAGINE_PREDEFINITA" /> -->

	<!-- EN: Twitter Card -->
	<!-- IT: Twitter Card -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content={currentUrl} />
	<meta property="twitter:title" content={fullTitle} />
	<meta property="twitter:description" content={description} />
	<!-- <meta property="twitter:image" content="URL_DI_UN_IMMAGINE_PREDEFINITA" /> -->
</svelte:head>
