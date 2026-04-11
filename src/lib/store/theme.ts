import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type ColorTheme = 'default' | 'green' | 'yellow';

function getInitialMode(): 'light' | 'dark' {
	if (!browser) return 'light';
	const stored = localStorage.getItem('theme-mode');
	if (stored === 'dark' || stored === 'light') return stored;
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getInitialColor(): ColorTheme {
	if (!browser) return 'default';
	const stored = localStorage.getItem('theme-color') as ColorTheme | null;
	if (stored === 'green' || stored === 'yellow' || stored === 'default') return stored;
	return 'default';
}

export const themeMode = writable<'light' | 'dark'>(getInitialMode());
export const themeColor = writable<ColorTheme>(getInitialColor());

if (browser) {
	themeMode.subscribe((val) => {
		document.documentElement.classList.toggle('dark', val === 'dark');
		localStorage.setItem('theme-mode', val);
	});

	themeColor.subscribe((val) => {
		document.documentElement.setAttribute('data-theme', val);
		localStorage.setItem('theme-color', val);
	});
}

export function toggleThemeMode() {
	themeMode.update((t) => (t === 'dark' ? 'light' : 'dark'));
}

export function setColorTheme(color: ColorTheme) {
	themeColor.set(color);
}
