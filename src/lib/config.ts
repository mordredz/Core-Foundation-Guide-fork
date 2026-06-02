// src/lib/config.ts
// EN: Project-wide configuration values.
// IT: Valori di configurazione a livello di progetto.

// EN: Color for each category slug. Slugs must match the content folder names.
// IT: Colore per ogni slug di categoria. Gli slug devono combaciare con i nomi delle cartelle dei contenuti.
export const categoryColors: { [key: string]: string } = {
	'advanced-topics': 'cyan',
	'core-concepts': 'amber',
	fundamentals: 'sky',
	'system-anatomy': 'teal'
};

// EN: Fallback color for categories not listed above.
// IT: Colore di fallback per le categorie non elencate sopra.
export const defaultCategoryColor = 'slate';
