<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import Icon from '$lib/components/Icon.svelte';
	import Image from '$lib/components/Image.svelte';
	import Button from '$lib/components/Button.svelte';
	import GlassContainer from '$lib/components/GlassContainer.svelte';
	import { isAuthenticated, logout } from '$lib/services/auth.js';
	import { getCloudOrders, updateOrderStatus, deleteOrder } from '$lib/services/order.js';
	import { ts } from '$lib/i18n/index.svelte.js';
	import type { Order, OrderStatus } from '$lib/types/api.js';

	const STATUSES: OrderStatus[] = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

	let orders = $state<Order[]>([]);
	let loading = $state(true);
	let error = $state('');
	let copiedId = $state('');
	let searchQuery = $state('');
	let confirmDeleteId = $state('');

	let filtered = $derived(() => {
		const q = searchQuery.trim().toLowerCase();
		if (!q) return orders;
		return orders.filter(
			(o) => o.id.toLowerCase().includes(q) || o.customer_email.toLowerCase().includes(q)
		);
	});

	onMount(() => {
		if (!isAuthenticated()) {
			goto(`${base}/admin-preview/login`);
			return;
		}
		loadOrders();
	});

	async function loadOrders() {
		loading = true;
		error = '';
		try {
			orders = await getCloudOrders();
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to load orders';
		} finally {
			loading = false;
		}
	}

	async function changeStatus(order: Order, newStatus: OrderStatus) {
		if (newStatus === order.status) return;
		try {
			await updateOrderStatus(order.id, newStatus);
			orders = orders.map((o) =>
				o.id === order.id ? { ...o, status: newStatus, updated_at: new Date().toISOString() } : o
			);
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to update status';
		}
	}

	async function handleDelete(id: string) {
		if (confirmDeleteId !== id) {
			confirmDeleteId = id;
			return;
		}
		try {
			await deleteOrder(id);
			orders = orders.filter((o) => o.id !== id);
			confirmDeleteId = '';
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to delete order';
			confirmDeleteId = '';
		}
	}

	function cancelDelete() {
		confirmDeleteId = '';
	}

	async function copyId(id: string) {
		try {
			await navigator.clipboard.writeText(id);
			copiedId = id;
			setTimeout(() => { copiedId = ''; }, 1500);
		} catch { /* clipboard may be blocked */ }
	}

	function handleLogout() {
		logout();
		goto(`${base}/admin-preview/login`);
	}

	const statusColors: Record<OrderStatus, string> = {
		pending: 'oklch(0.8 0.18 80)',
		confirmed: 'oklch(0.65 0.28 280)',
		shipped: 'oklch(0.7 0.24 190)',
		delivered: 'oklch(0.72 0.19 145)',
		cancelled: 'oklch(0.65 0.24 25)'
	};

	function statusLabel(s: OrderStatus): string {
		return ts(`admin.status_${s}`);
	}

	function formatDate(iso: string): string {
		return new Date(iso).toLocaleString();
	}

	function cleanUrl(img: string): string {
		try {
			const cleaned = (img || '').replace(/^\[?"?|"?\]?$/g, '');
			new URL(cleaned);
			return cleaned;
		} catch {
			return 'https://placehold.co/80x80/eee/999?text=No+Img';
		}
	}
</script>

<svelte:head>
	<title>{ts('admin.title')} — obraNativa</title>
</svelte:head>

<section class="section">
	<div class="container admin-page">
		<div class="admin-header">
			<div>
				<h1 class="page-title">
					<Icon name="clipboard-list" size={28} />
					{ts('admin.title')}
				</h1>
				<p class="page-subtitle">{ts('admin.subtitle')}</p>
			</div>
			<div class="header-actions">
				<Button variant="ghost" size="sm" onclick={loadOrders}>
					<Icon name="refresh" size={16} />
					{ts('admin.refresh')}
				</Button>
				<Button variant="ghost" size="sm" onclick={handleLogout}>
					<Icon name="log-out" size={16} />
					{ts('admin.logout')}
				</Button>
			</div>
		</div>

		{#if !loading && !error && orders.length > 0}
			<div class="search-bar glass">
				<Icon name="search" size={16} />
				<input
					type="text"
					bind:value={searchQuery}
					placeholder={ts('admin.search_placeholder')}
					class="search-input"
				/>
				{#if searchQuery}
					<button class="search-clear" onclick={() => (searchQuery = '')}>
						<Icon name="x" size={14} />
					</button>
				{/if}
			</div>
		{/if}

		{#if loading}
			<div class="loading-state">
				<div class="skeleton" style="height: 10rem; border-radius: var(--radius-lg);"></div>
				<div class="skeleton" style="height: 10rem; border-radius: var(--radius-lg);"></div>
			</div>
		{:else if error}
			<GlassContainer>
				<div class="error-state">
					<Icon name="info" size={32} />
					<p>{error}</p>
					<Button variant="secondary" size="sm" onclick={loadOrders}>{ts('admin.retry')}</Button>
				</div>
			</GlassContainer>
		{:else if orders.length === 0}
			<GlassContainer>
				<div class="empty-state">
					<Icon name="package" size={48} />
					<h2>{ts('admin.no_orders')}</h2>
					<p>{ts('admin.no_orders_desc')}</p>
				</div>
			</GlassContainer>
		{:else if filtered().length === 0}
			<GlassContainer>
				<div class="empty-state">
					<Icon name="search" size={48} />
					<p>{ts('admin.no_results')}</p>
				</div>
			</GlassContainer>
		{:else}
			<div class="orders-list">
				{#each filtered() as order (order.id)}
					<div class="order-card glass">
						<div class="order-id-row">
							<span class="order-id-label">{ts('admin.order_number')}</span>
							<code class="order-id-code">{order.id}</code>
							<button
								class="copy-btn"
								onclick={() => copyId(order.id)}
								title={ts('admin.copy')}
							>
								<Icon name={copiedId === order.id ? 'check' : 'clipboard'} size={14} />
								<span class="copy-label">
									{copiedId === order.id ? ts('admin.copied') : ts('admin.copy')}
								</span>
							</button>
						</div>

						<div class="order-meta">
							<div class="meta-item">
								<span class="meta-label">{ts('admin.customer')}</span>
								<span>{order.customer_email || '—'}</span>
							</div>
							<div class="meta-item">
								<span class="meta-label">{ts('admin.date')}</span>
								<span class="muted">{formatDate(order.created_at)}</span>
							</div>
						</div>

						<div class="order-bottom">
							<div class="status-control">
								<span
									class="status-dot"
									style:background={statusColors[order.status]}
								></span>
								<select
									class="status-select"
									value={order.status}
									onchange={(e) => changeStatus(order, (e.target as HTMLSelectElement).value as OrderStatus)}
									style:--sel-color={statusColors[order.status]}
								>
									{#each STATUSES as s}
										<option value={s}>{statusLabel(s)}</option>
									{/each}
								</select>
							</div>
							<span class="order-total">${order.total_amount.toFixed(2)}</span>
						</div>

						<details class="items-details">
							<summary>{ts('admin.items')} ({order.items.length})</summary>
							<ul class="items-list">
								{#each order.items as item}
									<li class="item-row">
										<div class="item-thumb">
											<Image src={cleanUrl(item.image)} alt={item.title} aspect="1" />
										</div>
										<div class="item-info">
											<span class="item-name">{item.title}</span>
											<span class="item-detail">
												{ts('admin.qty')}: {item.qty} &middot; {ts('admin.unit_price')}: ${item.price.toFixed(2)}
											</span>
										</div>
										<span class="item-subtotal">${(item.price * item.qty).toFixed(2)}</span>
									</li>
								{/each}
							</ul>
						</details>

						<div class="order-actions">
							{#if confirmDeleteId === order.id}
								<button class="delete-btn confirming" onclick={() => handleDelete(order.id)}>
									<Icon name="trash" size={14} />
									{ts('admin.delete_confirm')}
								</button>
								<button class="cancel-delete-btn" onclick={cancelDelete}>
									<Icon name="x" size={14} />
								</button>
							{:else}
								<button class="delete-btn" onclick={() => handleDelete(order.id)}>
									<Icon name="trash" size={14} />
									{ts('admin.delete')}
								</button>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</section>

<style>
	.admin-page {
		max-width: 960px;
	}

	.admin-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		margin-bottom: var(--space-6);
		gap: var(--space-4);
		flex-wrap: wrap;
	}

	.admin-header .page-title {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}

	.header-actions {
		display: flex;
		gap: var(--space-2);
	}

	/* --- Search bar --- */
	.search-bar {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3) var(--space-4);
		margin-bottom: var(--space-6);
		border-radius: var(--radius-lg);
		color: var(--text-muted);
	}

	.search-input {
		flex: 1;
		background: transparent;
		border: none;
		font-size: var(--text-sm);
		color: var(--text);
		outline: none;
	}

	.search-input::placeholder {
		color: var(--text-muted);
		opacity: 0.6;
	}

	.search-clear {
		display: grid;
		place-items: center;
		width: 1.5rem;
		height: 1.5rem;
		border-radius: var(--radius-sm);
		color: var(--text-muted);
		cursor: pointer;
		transition: color var(--duration-fast);
	}

	.search-clear:hover {
		color: var(--text);
	}

	/* --- States --- */
	.loading-state {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.error-state,
	.empty-state {
		text-align: center;
		padding: var(--space-10);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-4);
		color: var(--text-muted);
	}

	.empty-state h2 {
		font-size: var(--text-xl);
		color: var(--text);
	}

	/* --- Orders list --- */
	.orders-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-5);
	}

	.order-card {
		padding: var(--space-5);
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	/* --- Order ID row --- */
	.order-id-row {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		min-width: 0;
	}

	.order-id-label {
		font-size: var(--text-xs);
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--text-muted);
		flex-shrink: 0;
	}

	.order-id-code {
		font-family: var(--font-mono);
		font-size: var(--text-xs);
		background: var(--bg-secondary);
		padding: var(--space-1) var(--space-3);
		border-radius: var(--radius-sm);
		color: var(--accent-1);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 28ch;
	}

	.copy-btn {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		padding: var(--space-1) var(--space-2);
		border-radius: var(--radius-sm);
		font-size: var(--text-xs);
		font-weight: 600;
		color: var(--text-muted);
		background: transparent;
		cursor: pointer;
		transition:
			color var(--duration-fast),
			background var(--duration-fast);
		flex-shrink: 0;
	}

	.copy-btn:hover {
		color: var(--accent-1);
		background: var(--bg-secondary);
	}

	/* --- Order meta --- */
	.order-meta {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-4) var(--space-6);
		font-size: var(--text-sm);
	}

	.meta-label {
		font-size: var(--text-xs);
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--text-muted);
		margin-right: var(--space-2);
	}

	.muted {
		color: var(--text-muted);
	}

	/* --- Order bottom: status + total --- */
	.order-bottom {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: var(--space-3);
	}

	.order-total {
		font-weight: 800;
		font-size: var(--text-lg);
		color: var(--accent-1);
	}

	.status-control {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.status-dot {
		width: 8px;
		height: 8px;
		border-radius: var(--radius-full);
		flex-shrink: 0;
	}

	.status-select {
		font-size: var(--text-xs);
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		padding: var(--space-1) var(--space-3);
		padding-right: var(--space-6);
		border-radius: var(--radius-full);
		border: 1px solid color-mix(in oklch, var(--sel-color) 30%, transparent);
		background: color-mix(in oklch, var(--sel-color) 12%, transparent);
		color: var(--sel-color);
		cursor: pointer;
		appearance: none;
		background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23888' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right 8px center;
		transition:
			box-shadow var(--duration-fast),
			border-color var(--duration-fast);
	}

	.status-select:hover,
	.status-select:focus-visible {
		box-shadow: 0 0 12px color-mix(in oklch, var(--sel-color) 25%, transparent);
		outline: none;
	}

	/* --- Items accordion --- */
	.items-details {
		border-top: 1px solid var(--border);
		padding-top: var(--space-3);
	}

	.items-details summary {
		cursor: pointer;
		font-size: var(--text-sm);
		font-weight: 700;
		color: var(--text-muted);
		padding-block: var(--space-2);
		user-select: none;
	}

	.items-details summary:hover {
		color: var(--text);
	}

	.items-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		margin-top: var(--space-3);
	}

	.item-row {
		display: grid;
		grid-template-columns: 48px 1fr auto;
		gap: var(--space-3);
		align-items: center;
	}

	.item-thumb {
		width: 48px;
		height: 48px;
		border-radius: var(--radius-sm);
		overflow: hidden;
	}

	.item-info {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}

	.item-name {
		font-size: var(--text-sm);
		font-weight: 600;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.item-detail {
		font-size: var(--text-xs);
		color: var(--text-muted);
	}

	.item-subtotal {
		font-size: var(--text-sm);
		font-weight: 700;
		white-space: nowrap;
	}

	/* --- Delete action --- */
	.order-actions {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		border-top: 1px solid var(--border);
		padding-top: var(--space-3);
	}

	.delete-btn {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-3);
		border-radius: var(--radius-md);
		font-size: var(--text-xs);
		font-weight: 600;
		color: var(--text-muted);
		background: transparent;
		border: 1px solid transparent;
		cursor: pointer;
		transition:
			color var(--duration-fast),
			background var(--duration-fast),
			border-color var(--duration-fast);
	}

	.delete-btn:hover {
		color: oklch(0.65 0.24 25);
		background: oklch(0.65 0.24 25 / 0.08);
		border-color: oklch(0.65 0.24 25 / 0.2);
	}

	.delete-btn.confirming {
		color: oklch(1 0 0);
		background: oklch(0.55 0.24 25);
		border-color: oklch(0.55 0.24 25);
	}

	.delete-btn.confirming:hover {
		background: oklch(0.48 0.24 25);
	}

	.cancel-delete-btn {
		display: grid;
		place-items: center;
		width: 1.75rem;
		height: 1.75rem;
		border-radius: var(--radius-sm);
		color: var(--text-muted);
		cursor: pointer;
		transition: background var(--duration-fast);
	}

	.cancel-delete-btn:hover {
		background: var(--bg-secondary);
	}

	.copy-label {
		display: none;
	}

	@media (min-width: 640px) {
		.copy-label {
			display: inline;
		}

		.order-id-code {
			max-width: none;
		}
	}
</style>
