export interface Category {
	id: number;
	name: string;
	image: string;
}

export interface Product {
	id: number;
	title: string;
	price: number;
	description: string;
	images: string[];
	category: Category;
}

export interface CartItem {
	id: number;
	title: string;
	price: number;
	image: string;
	qty: number;
}

export interface CacheEntry<T = unknown> {
	key: string;
	data: T;
	ts: number;
}
