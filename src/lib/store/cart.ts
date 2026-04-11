import { writable } from 'svelte/store';
import { getAll, put, del, clear } from '$lib/services/db.js';
import type { CartItem } from '$lib/types/api.js';

const { subscribe, set, update } = writable<CartItem[]>([]);

let initialized = false;

async function init() {
	if (initialized) return;
	initialized = true;
	try {
		const items = await getAll<CartItem>('cart');
		set(items || []);
	} catch {
		set([]);
	}
}

function persist(items: CartItem[]) {
	for (const item of items) {
		put('cart', item).catch(() => {});
	}
}

function addItem(product: Omit<CartItem, 'qty'> & { qty?: number }) {
	update((items) => {
		const existing = items.find((i) => i.id === product.id);
		if (existing) {
			existing.qty += product.qty || 1;
			const next = [...items];
			persist(next);
			return next;
		}
		const next = [...items, { ...product, qty: product.qty || 1 }];
		persist(next);
		return next;
	});
}

function updateQty(id: number, qty: number) {
	if (qty <= 0) {
		removeItem(id);
		return;
	}
	update((items) => {
		const next = items.map((i) => (i.id === id ? { ...i, qty } : i));
		persist(next);
		return next;
	});
}

function removeItem(id: number) {
	del('cart', id).catch(() => {});
	update((items) => items.filter((i) => i.id !== id));
}

function clearCart() {
	clear('cart').catch(() => {});
	set([]);
}

export const cart = {
	subscribe,
	init,
	addItem,
	updateQty,
	removeItem,
	clearCart
};
