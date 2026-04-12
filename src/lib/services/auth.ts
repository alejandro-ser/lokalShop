import { PUBLIC_ADMIN_HASH } from '$env/static/public';
import { browser } from '$app/environment';

const SESSION_KEY = 'admin_session';

async function sha256(message: string): Promise<string> {
	const encoder = new TextEncoder();
	const data = encoder.encode(message);
	const hashBuffer = await crypto.subtle.digest('SHA-256', data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function login(user: string, password: string): Promise<boolean> {
	const hash = await sha256(`${user}:${password}`);
	if (hash === PUBLIC_ADMIN_HASH) {
		if (browser) localStorage.setItem(SESSION_KEY, hash);
		return true;
	}
	return false;
}

export function isAuthenticated(): boolean {
	if (!browser) return false;
	return localStorage.getItem(SESSION_KEY) === PUBLIC_ADMIN_HASH;
}

export function logout(): void {
	if (browser) localStorage.removeItem(SESSION_KEY);
}
