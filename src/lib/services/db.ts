import type { CacheEntry } from '$lib/types/api.js';

const DB_NAME = 'obraNativa';
const DB_VERSION = 1;

const STORES: Record<string, IDBObjectStoreParameters> = {
	cart: { keyPath: 'id' },
	cache: { keyPath: 'key' }
};

let db: IDBDatabase | null = null;

function open(): Promise<IDBDatabase> {
	if (db) return Promise.resolve(db);
	return new Promise((resolve, reject) => {
		const req = indexedDB.open(DB_NAME, DB_VERSION);
		req.onupgradeneeded = () => {
			const d = req.result;
			for (const [name, opts] of Object.entries(STORES)) {
				if (!d.objectStoreNames.contains(name)) {
					d.createObjectStore(name, opts);
				}
			}
		};
		req.onsuccess = () => {
			db = req.result;
			resolve(db);
		};
		req.onerror = () => reject(req.error);
	});
}

async function tx(store: string, mode: IDBTransactionMode): Promise<IDBObjectStore> {
	const d = await open();
	return d.transaction(store, mode).objectStore(store);
}

export async function getAll<T>(store: string): Promise<T[]> {
	const s = await tx(store, 'readonly');
	return new Promise((resolve, reject) => {
		const req = s.getAll();
		req.onsuccess = () => resolve(req.result as T[]);
		req.onerror = () => reject(req.error);
	});
}

export async function get<T>(store: string, key: IDBValidKey): Promise<T | undefined> {
	const s = await tx(store, 'readonly');
	return new Promise((resolve, reject) => {
		const req = s.get(key);
		req.onsuccess = () => resolve(req.result as T | undefined);
		req.onerror = () => reject(req.error);
	});
}

export async function put<T>(store: string, value: T): Promise<IDBValidKey> {
	const s = await tx(store, 'readwrite');
	return new Promise((resolve, reject) => {
		const req = s.put(value);
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error);
	});
}

export async function del(store: string, key: IDBValidKey): Promise<void> {
	const s = await tx(store, 'readwrite');
	return new Promise((resolve, reject) => {
		const req = s.delete(key);
		req.onsuccess = () => resolve();
		req.onerror = () => reject(req.error);
	});
}

export async function clear(store: string): Promise<void> {
	const s = await tx(store, 'readwrite');
	return new Promise((resolve, reject) => {
		const req = s.clear();
		req.onsuccess = () => resolve();
		req.onerror = () => reject(req.error);
	});
}

const CACHE_TTL = 1000 * 60 * 30;

export async function cached<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
	try {
		const entry = await get<CacheEntry<T>>('cache', key);
		if (entry && Date.now() - entry.ts < CACHE_TTL) return entry.data;
	} catch {
		/* cache miss */
	}
	const data = await fetcher();
	put('cache', { key, data, ts: Date.now() } satisfies CacheEntry<T>).catch(() => {});
	return data;
}
