// src/routes/+layout.ts
import { translations } from '$lib/translations';

// Root load: exposes the translations object to every page/layout via `await parent()`.
export const load = async () => {
	return {
		translations
	};
};

export const prerender = true;
