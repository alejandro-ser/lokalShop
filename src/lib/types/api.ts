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

export interface FaqItem {
	q: string;
	a: string;
}

export interface CacheEntry<T = unknown> {
	key: string;
	data: T;
	ts: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
	id: number;
	title: string;
	price: number;
	image: string;
	qty: number;
}

/**
 * Matches the Supabase `orders` table schema:
 *
 * CREATE TABLE orders (
 *   id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   status       TEXT NOT NULL DEFAULT 'pending',
 *   items        JSONB NOT NULL,
 *   total_amount NUMERIC(10,2) NOT NULL,
 *   customer_email TEXT,
 *   created_at   TIMESTAMPTZ DEFAULT now(),
 *   updated_at   TIMESTAMPTZ DEFAULT now()
 * );
 */
export interface Order {
	id: string;
	status: OrderStatus;
	items: OrderItem[];
	total_amount: number;
	customer_email: string;
	created_at: string;
	updated_at: string;
}
