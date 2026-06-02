// Tells TypeScript about the global `p5` that the script attaches to window.
declare global {
	interface Window {
		p5: any;
	}
}

/**
 * Loads p5.js lazily from the local vendor copy (client-side only, no CDN).
 * @returns A promise resolving to the p5 constructor.
 */
export async function loadP5() {
	const module = await import('$lib/vendor/p5.min.js');
	// Prefer the ESM default export, fall back to the global for older builds.
	return module.default || window.p5;
}
