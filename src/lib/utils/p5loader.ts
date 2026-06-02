// EN: Tells TypeScript about the global `p5` that the script attaches to window.
// IT: Informa TypeScript della proprietà globale `p5` che lo script aggiunge a window.
declare global {
	interface Window {
		p5: any;
	}
}

/**
 * EN: Loads p5.js lazily from the local vendor copy (client-side only, no CDN).
 * IT: Carica p5.js in modo lazy dalla copia vendor locale (solo client-side, niente CDN).
 * @returns A promise resolving to the p5 constructor.
 */
export async function loadP5() {
	const module = await import('$lib/vendor/p5.min.js');
	// EN: Prefer the ESM default export, fall back to the global for older builds.
	// IT: Preferisce l'export default ESM, con fallback alla variabile globale per build più datate.
	return module.default || window.p5;
}
