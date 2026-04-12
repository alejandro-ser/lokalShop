import { browser } from '$app/environment';
import en from './locales/en.json';
import de from './locales/de.json';
import es from './locales/es.json';

const dictionaries = { en, de, es } as const;

export const locales = ['en', 'de', 'es'] as const;
export type Locale = (typeof locales)[number];
export type Dict = typeof en;

function getInitialLocale(): Locale {
	if (!browser) return 'en';
	const stored = localStorage.getItem('locale');
	if (stored && locales.includes(stored as Locale)) return stored as Locale;
	const nav = navigator.language.slice(0, 2);
	if (locales.includes(nav as Locale)) return nav as Locale;
	return 'en';
}

let _locale = $state<Locale>(getInitialLocale());
let _dict = $derived(dictionaries[_locale]);

export function locale(): Locale {
	return _locale;
}

export function setLocale(l: Locale): void {
	_locale = l;
	if (browser) {
		localStorage.setItem('locale', l);
		document.documentElement.lang = l;
	}
}

/**
 * Reactive translation accessor — reads from $derived dict so any
 * template expression calling t() re-renders on locale change.
 * Supports dot-notation: t('nav.home'), t('faq.items') etc.
 */
export function t(key: string): unknown {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return key.split('.').reduce<any>((obj, k) => obj?.[k], _dict) ?? key;
}

/** Type-safe shortcut: returns string, falls back to key */
export function ts(key: string): string {
	return String(t(key));
}

/** Direct access to the current reactive translations object */
export function dict(): Dict {
	return _dict;
}

if (browser) {
	$effect.root(() => {
		$effect(() => {
			document.documentElement.lang = _locale;
		});
	});
}
