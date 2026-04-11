import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';
import dict, { type Locale, locales } from '$lib/i18n/dict.js';

function getInitialLocale(): Locale {
	if (!browser) return 'en';
	const stored = localStorage.getItem('locale');
	if (stored && locales.includes(stored as Locale)) return stored as Locale;
	const nav = navigator.language.slice(0, 2);
	if (locales.includes(nav as Locale)) return nav as Locale;
	return 'en';
}

export const locale = writable<Locale>(getInitialLocale());

if (browser) {
	locale.subscribe((val) => {
		localStorage.setItem('locale', val);
		document.documentElement.lang = val;
	});
}

export const t = derived(locale, ($locale) => dict[$locale]);

export function setLocale(l: Locale) {
	locale.set(l);
}

export { locales, type Locale };
