/// <reference types="@sveltejs/kit" />

// Lets TypeScript import `.md` files: default = a Svelte component, plus frontmatter metadata.
declare module '*.md' {
	export { SvelteComponent as default } from 'svelte';
	export const metadata: Record<string, any>;
}
