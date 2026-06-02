/// <reference types="@sveltejs/kit" />

// EN: Lets TypeScript import `.md` files: default = a Svelte component, plus frontmatter metadata.
// IT: Permette a TypeScript di importare file `.md`: default = un componente Svelte, più i metadati del frontmatter.
declare module '*.md' {
	export { SvelteComponent as default } from 'svelte';
	export const metadata: Record<string, any>;
}
