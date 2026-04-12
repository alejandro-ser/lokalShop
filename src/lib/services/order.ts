import { supabase } from './supabase.js';
import { put, getAll, get, del } from './db.js';
import type { Order, OrderItem, OrderStatus, CartItem } from '$lib/types/api.js';

/**
 * Hybrid Order Engine: writes to both IndexedDB (instant local) and
 * Supabase (cloud persistence for the Melibo chatbot).
 *
 * ── Melibo Integration ──
 * To let the Melibo chatbot query order status, configure a
 * "Supabase Lookup" node in your Melibo flow:
 *   1. Use the REST endpoint: POST {SUPABASE_URL}/rest/v1/orders?select=*&id=eq.{order_id}
 *   2. Pass headers: apikey={ANON_KEY}, Authorization: Bearer {ANON_KEY}
 *   3. Parse the JSON response → status, items, total_amount
 *   4. Use a conditional node to format a human-readable status message.
 * Ensure the `orders` table has RLS enabled with a SELECT policy for `anon`.
 */

function generateId(): string {
	return crypto.randomUUID();
}

function nowISO(): string {
	return new Date().toISOString();
}

export async function createOrder(
	cartItems: CartItem[],
	customerEmail: string
): Promise<Order> {
	const items: OrderItem[] = cartItems.map((ci) => ({
		id: ci.id,
		title: ci.title,
		price: ci.price,
		image: ci.image,
		qty: ci.qty
	}));

	const totalAmount = items.reduce((sum, i) => sum + i.price * i.qty, 0);
	const now = nowISO();

	const order: Order = {
		id: generateId(),
		status: 'pending',
		items,
		total_amount: Math.round(totalAmount * 100) / 100,
		customer_email: customerEmail,
		created_at: now,
		updated_at: now
	};

	await put('orders', order);

	supabase
		.from('orders')
		.insert({
			id: order.id,
			status: order.status,
			items: order.items,
			total_amount: order.total_amount,
			customer_email: order.customer_email,
			created_at: order.created_at,
			updated_at: order.updated_at
		})
		.then(({ error }) => {
			if (error) console.error('[order] Supabase sync failed:', error.message);
		});

	return order;
}

export async function getLocalOrders(): Promise<Order[]> {
	return getAll<Order>('orders');
}

export async function getLocalOrder(id: string): Promise<Order | undefined> {
	return get<Order>('orders', id);
}

export async function getCloudOrders(): Promise<Order[]> {
	const { data, error } = await supabase
		.from('orders')
		.select('*')
		.order('created_at', { ascending: false });

	if (error) throw new Error(error.message);
	return (data ?? []) as Order[];
}

export async function getOrdersByEmail(email: string): Promise<Order[]> {
	const { data, error } = await supabase
		.from('orders')
		.select('*')
		.eq('customer_email', email)
		.order('created_at', { ascending: false });

	if (error) throw new Error(error.message);
	return (data ?? []) as Order[];
}

export async function deleteOrder(id: string): Promise<void> {
	await del('orders', id);

	const { error } = await supabase
		.from('orders')
		.delete()
		.eq('id', id);

	if (error) throw new Error(error.message);
}

export async function updateOrderStatus(
	id: string,
	status: OrderStatus
): Promise<void> {
	const now = nowISO();

	const localOrder = await get<Order>('orders', id);
	if (localOrder) {
		await put('orders', { ...localOrder, status, updated_at: now });
	}

	const { error } = await supabase
		.from('orders')
		.update({ status, updated_at: now })
		.eq('id', id);

	if (error) throw new Error(error.message);
}
