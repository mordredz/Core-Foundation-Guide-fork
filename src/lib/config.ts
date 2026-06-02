// src/lib/config.ts
// Project-wide configuration values.

// Color for each category slug. Slugs must match the content folder names.
export const categoryColors: { [key: string]: string } = {
	'advanced-topics': 'cyan',
	'core-concepts': 'amber',
	fundamentals: 'sky',
	'system-anatomy': 'teal'
};

// Fallback color for categories not listed above.
export const defaultCategoryColor = 'slate';
