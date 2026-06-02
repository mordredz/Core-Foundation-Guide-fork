<!-- src/routes/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import type { PageData } from './$types';

	export let data: PageData;

	// EN: Client-side redirect to the default language landing page.
	// IT: Reindirizzamento lato client alla pagina iniziale della lingua predefinita.
	onMount(() => {
		if (data.defaultLang) {
			const targetPath = `${base}/${data.defaultLang}.html`;
			// EN: replaceState avoids polluting history so the back button still works.
			// IT: replaceState evita di sporcare la cronologia, così il tasto "indietro" funziona.
			goto(targetPath, { replaceState: true });
		}
	});
</script>

<!-- EN: Brief placeholder shown until the redirect kicks in. -->
<!-- IT: Breve segnaposto mostrato finché non scatta il reindirizzamento. -->
<div class="flex min-h-screen w-full items-center justify-center">
	<p class="text-white">{data.translations?.it.initializing || 'Initializing...'}</p>
</div>
