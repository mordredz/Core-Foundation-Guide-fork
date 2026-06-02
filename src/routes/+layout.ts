// src/routes/+layout.ts
import { translations } from '$lib/translations';

// EN: Root load: exposes the translations object to every page/layout via `await parent()`.
// IT: Load di radice: espone l'oggetto delle traduzioni a ogni pagina/layout tramite `await parent()`.
export const load = async () => {
	return {
		translations
	};
};

export const prerender = true;
