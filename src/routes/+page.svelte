<!-- src/routes/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import type { PageData } from './$types';

	export let data: PageData;

	// Client-side redirect to the default language landing page.
	onMount(() => {
		if (data.defaultLang) {
			const targetPath = `${base}/${data.defaultLang}.html`;
			// replaceState avoids polluting history so the back button still works.
			goto(targetPath, { replaceState: true });
		}
	});
</script>

<!-- Brief placeholder shown until the redirect kicks in. -->
<div class="flex min-h-screen w-full items-center justify-center">
	<p class="text-white">{data.translations?.it.initializing || 'Initializing...'}</p>
</div>
