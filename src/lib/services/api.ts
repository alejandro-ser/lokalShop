import { PUBLIC_API_BASE } from '$env/static/public';
import { cached } from './db.js';
import type { Product, Category } from '$lib/types/api.js';

async function fetchJSON<T>(endpoint: string): Promise<T> {
	const res = await fetch(`${PUBLIC_API_BASE}${endpoint}`);
	if (!res.ok) throw new Error(`API ${res.status}: ${endpoint}`);
	return res.json() as Promise<T>;
}

export function getCategories(): Promise<Category[]> {
	return cached('categories', () => fetchJSON<Category[]>('/categories'));
}

export function getProducts(offset = 0, limit = 12): Promise<Product[]> {
	return cached(`products-${offset}-${limit}`, () =>
		fetchJSON<Product[]>(`/products?offset=${offset}&limit=${limit}`)
	);
}

export function getProduct(id: number): Promise<Product> {
	return cached(`product-${id}`, () => fetchJSON<Product>(`/products/${id}`));
}

export function getProductsByCategory(
	categoryId: number,
	offset = 0,
	limit = 12
): Promise<Product[]> {
	return cached(`cat-${categoryId}-${offset}-${limit}`, () =>
		fetchJSON<Product[]>(`/categories/${categoryId}/products?offset=${offset}&limit=${limit}`)
	);
}

export function getCategory(id: number): Promise<Category> {
	return cached(`category-${id}`, () => fetchJSON<Category>(`/categories/${id}`));
}
