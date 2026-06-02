<!-- src/lib/components/SpeechControl.svelte -->
<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { type TranslationSet } from '$lib/translations';

	export let text: string; // EN: Article text to read aloud. / IT: Testo dell'articolo da leggere ad alta voce.
	export let lang: string; // EN: Language code, used to filter voices. / IT: Codice lingua, usato per filtrare le voci.
	export let t: TranslationSet; // EN: UI labels. / IT: Etichette della UI.

	let synth: SpeechSynthesis;
	let utterance: SpeechSynthesisUtterance;

	let isSupported = false;
	let isSpeaking = false;
	let showSettings = false;

	let availableVoices: SpeechSynthesisVoice[] = [];
	let selectedVoiceURI: string | null = null;

	function initialize() {
		if (!browser || !('speechSynthesis' in window)) return;
		isSupported = true;
		synth = window.speechSynthesis;
	}

	// EN: Filter the available voices down to the article's language and pick a default.
	// IT: Filtra le voci disponibili in base alla lingua dell'articolo e ne sceglie una di default.
	function populateVoiceList() {
		const voices = synth.getVoices();
		availableVoices = voices.filter((voice) => voice.lang.startsWith(lang));

		if (!selectedVoiceURI && availableVoices.length > 0) {
			// EN: Prefer a higher-quality voice when one is available.
			// IT: Preferisce una voce di qualità superiore quando disponibile.
			const keywords = ['natural', 'online', 'google'];
			let preferredVoice = availableVoices.find((v) =>
				keywords.some((k) => v.name.toLowerCase().includes(k))
			);
			selectedVoiceURI = (preferredVoice || availableVoices[0]).voiceURI;
		}
	}

	function createUtterance() {
		utterance = new SpeechSynthesisUtterance(text);
		utterance.lang = lang;

		if (selectedVoiceURI) {
			const selectedVoice = availableVoices.find((v) => v.voiceURI === selectedVoiceURI);
			if (selectedVoice) utterance.voice = selectedVoice;
		}

		utterance.pitch = 1;
		utterance.rate = 1;

		utterance.onstart = () => {
			isSpeaking = true;
		};
		utterance.onend = () => {
			isSpeaking = false;
		};
	}

	function handlePlay() {
		isSpeaking = true; // EN: Update the UI immediately. / IT: Aggiorna subito la UI.
		synth.cancel(); // EN: Drop any in-progress speech. / IT: Interrompe l'eventuale lettura in corso.
		createUtterance();
		synth.speak(utterance);
	}

	function handleStop() {
		isSpeaking = false;
		synth.cancel();
	}

	onMount(() => {
		initialize();
		if (isSupported) {
			// EN: Voices often load asynchronously.
			// IT: Le voci spesso si caricano in modo asincrono.
			synth.onvoiceschanged = populateVoiceList;
			populateVoiceList(); // EN: ...but they may already be ready. / IT: ...ma potrebbero essere già pronte.
		}
	});

	// EN: Stop speech on unmount to avoid it outliving the page.
	// IT: Ferma la lettura allo smontaggio per evitare che sopravviva alla pagina.
	onDestroy(() => {
		if (synth) synth.cancel();
	});

	// EN: Stop playback if the text changes.
	// IT: Ferma la riproduzione se il testo cambia.
	$: if (text && browser && isSupported) {
		handleStop();
	}
</script>

<svg class="hidden">
	<symbol id="icon-play" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></symbol>
	<symbol id="icon-stop" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h12v12H6z" /></symbol>
	<symbol
		id="icon-settings"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<path
			d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l-.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
		/>
		<circle cx="12" cy="12" r="3" />
	</symbol>
</svg>

{#if isSupported}
	<div class="space-y-3 rounded-lg border border-cyan-900/50 bg-slate-900/30 p-4 backdrop-blur-sm">
		<div class="flex items-center gap-4">
			{#if !isSpeaking}
				<button
					on:click={handlePlay}
					aria-label="Play"
					class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500 text-slate-900 transition-transform hover:scale-110"
					><svg class="h-6 w-6"><use href="#icon-play" /></svg></button
				>
			{:else}
				<button
					on:click={handleStop}
					aria-label="Stop"
					class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-500 text-slate-900 transition-transform hover:scale-110"
					><svg class="h-6 w-6"><use href="#icon-stop" /></svg></button
				>
			{/if}

			<div class="text-sm font-semibold text-slate-300">
				{#if isSpeaking}
					<span class="text-cyan-400">{t.playing}</span>
				{:else}
					<span>{t.listenToArticle}</span>
				{/if}
			</div>

			<!-- EN: Settings only make sense when there's more than one voice. -->
			<!-- IT: Le impostazioni hanno senso solo quando c'è più di una voce. -->
			{#if availableVoices.length > 1}
				<button
					on:click={() => (showSettings = !showSettings)}
					aria-label="Audio settings"
					class="ml-auto shrink-0 text-slate-400 transition-colors hover:text-white"
					><svg class="h-6 w-6"><use href="#icon-settings" /></svg></button
				>
			{/if}
		</div>

		{#if showSettings && availableVoices.length > 1}
			<div class="space-y-2 border-t border-cyan-900/50 pt-3">
				<div>
					<label for="voice-select" class="mb-1 block text-xs font-medium text-slate-400"
						>{t.voice}</label
					>
					<select
						id="voice-select"
						bind:value={selectedVoiceURI}
						on:change={handlePlay}
						class="w-full rounded-md border-2 border-slate-700 bg-slate-900/50 px-2 py-1 text-sm text-white focus:border-cyan-400 focus:outline-none"
					>
						{#each availableVoices as voice (voice.voiceURI)}
							<option value={voice.voiceURI}>{voice.name} ({voice.lang})</option>
						{/each}
					</select>
				</div>
			</div>
		{/if}
	</div>
{/if}
