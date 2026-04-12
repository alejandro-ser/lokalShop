<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import Image from '$lib/components/Image.svelte';
	import GlassContainer from '$lib/components/GlassContainer.svelte';
	import Button from '$lib/components/Button.svelte';
	import { base } from '$app/paths';
	import { cart } from '$lib/store/cart.js';
	import { ts } from '$lib/i18n/index.svelte.js';
	import { getOrdersByEmail } from '$lib/services/order.js';
	import type { Order, OrderStatus } from '$lib/types/api.js';

	let totalSpent = $derived($cart.reduce((sum, i) => sum + i.price * i.qty, 0));

	let lookupEmail = $state('');
	let emailTouched = $state(false);
	let searching = $state(false);
	let searched = $state(false);
	let orders = $state<Order[]>([]);
	let lookupError = $state('');
	let showLookup = $state(false);
	let expandedId = $state('');

	const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	let emailValid = $derived(EMAIL_RE.test(lookupEmail.trim()));
	let showEmailError = $derived(emailTouched && !emailValid);

	const statusColors: Record<OrderStatus, string> = {
		pending: 'oklch(0.8 0.18 80)',
		confirmed: 'oklch(0.65 0.28 280)',
		shipped: 'oklch(0.7 0.24 190)',
		delivered: 'oklch(0.72 0.19 145)',
		cancelled: 'oklch(0.65 0.24 25)'
	};

	async function handleSearch() {
		if (!emailValid) return;
		searching = true;
		lookupError = '';
		expandedId = '';
		try {
			orders = await getOrdersByEmail(lookupEmail.trim());
			searched = true;
		} catch {
			lookupError = ts('profile.email_required');
		} finally {
			searching = false;
		}
	}

	function formatDate(iso: string): string {
		return new Date(iso).toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	function cleanUrl(img: string): string {
		try {
			const cleaned = (img || '').replace(/^\[?"?|"?\]?$/g, '');
			new URL(cleaned);
			return cleaned;
		} catch {
			return 'https://placehold.co/60x60/eee/999?text=No+Img';
		}
	}

	function statusLabel(s: OrderStatus): string {
		return ts(`admin.status_${s}`);
	}
</script>

<svelte:head>
	<title>{ts('nav.profile')} — obraNativa</title>
</svelte:head>

<section class="section">
	<div class="container profile-page">
		<GlassContainer>
			<div class="profile-header">
				<div class="avatar">
					<Icon name="user" size={48} />
				</div>
				<div>
					<h1 class="page-title">{ts('profile.guest')}</h1>
					<p class="page-subtitle">{ts('profile.welcome')}</p>
				</div>
			</div>

			<div class="stats-grid">
				<div class="stat-card">
					<span class="stat-value">{$cart.length}</span>
					<span class="stat-label">{ts('profile.cart_items')}</span>
				</div>
				<div class="stat-card">
					<span class="stat-value">${totalSpent.toFixed(2)}</span>
					<span class="stat-label">{ts('profile.cart_total')}</span>
				</div>
				<div class="stat-card">
					<span class="stat-value">{orders.length}</span>
					<span class="stat-label">{ts('profile.orders')}</span>
				</div>
			</div>

			<div class="profile-links">
				<Button href="{base}/cart" variant="secondary" size="md">
					<Icon name="shopping-cart" size={18} />
					{ts('profile.view_cart')}
				</Button>
				<button class="orders-toggle" onclick={() => (showLookup = !showLookup)}>
					<Icon name="package" size={18} />
					{ts('profile.my_orders')}
					<Icon name={showLookup ? 'chevron-up' : 'chevron-down'} size={16} />
				</button>
				<Button href="{base}/contacto" variant="secondary" size="md">
					<Icon name="message-circle" size={18} />
					{ts('profile.contact_us')}
				</Button>
			</div>
		</GlassContainer>

		{#if showLookup}
			<div class="lookup-section">
				<GlassContainer>
					<div class="lookup-header">
						<h2 class="lookup-title">{ts('profile.order_lookup')}</h2>
						<a href="{base}/admin-preview" class="admin-link" title="Admin">
							<Icon name="settings" size={16} />
						</a>
					</div>
					<p class="lookup-desc">{ts('profile.order_lookup_desc')}</p>

					<form class="lookup-form" onsubmit={(e) => { e.preventDefault(); handleSearch(); }}>
						<div class="lookup-input-wrap" class:has-error={showEmailError}>
							<input
								type="email"
								required
								bind:value={lookupEmail}
								onblur={() => (emailTouched = true)}
								placeholder={ts('cart.email_placeholder')}
								aria-invalid={showEmailError}
							/>
							{#if showEmailError}
								<p class="field-error">{ts('profile.email_required')}</p>
							{/if}
						</div>
						<Button variant="primary" size="md" disabled={searching || !emailValid}>
							{#if searching}
								{ts('profile.searching')}
							{:else}
								<Icon name="search" size={16} />
								{ts('profile.search')}
							{/if}
						</Button>
					</form>

					{#if lookupError}
						<p class="lookup-error">{lookupError}</p>
					{/if}

					{#if searched && !searching}
						{#if orders.length === 0}
							<div class="empty-orders">
								<Icon name="package" size={32} />
								<p>{ts('profile.no_orders')}</p>
							</div>
						{:else}
							<div class="orders-result">
								{#each orders as order (order.id)}
									<div class="order-row">
										<div class="order-row-summary">
											<code class="order-code">{order.id.slice(0, 8)}</code>
											<span class="muted">{formatDate(order.created_at)}</span>
											<span
												class="status-pill"
												style:--pill-color={statusColors[order.status]}
											>
												{statusLabel(order.status)}
											</span>
											<span class="font-bold">${order.total_amount.toFixed(2)}</span>
											<button
												class="details-toggle"
												onclick={() => (expandedId = expandedId === order.id ? '' : order.id)}
											>
												<Icon name="eye" size={14} />
												{ts('profile.view_details')}
											</button>
										</div>

										{#if expandedId === order.id}
											<div class="order-detail-card">
												<div class="detail-meta">
													<div class="meta-item">
														<span class="meta-label">{ts('admin.order_number')}</span>
														<code class="detail-id">{order.id}</code>
													</div>
													<div class="meta-item">
														<span class="meta-label">{ts('admin.customer')}</span>
														<span>{order.customer_email}</span>
													</div>
													<div class="meta-item">
														<span class="meta-label">{ts('admin.date')}</span>
														<span class="muted">{formatDate(order.created_at)}</span>
													</div>
												</div>

												<div class="detail-status-row">
													<span class="status-dot" style:background={statusColors[order.status]}></span>
													<span class="status-select-ro" style:--sel-color={statusColors[order.status]}>
														{statusLabel(order.status)}
													</span>
													<span class="detail-total">${order.total_amount.toFixed(2)}</span>
												</div>

												<ul class="detail-items">
													{#each order.items as item}
														<li class="detail-item-row">
															<div class="detail-thumb">
																<Image src={cleanUrl(item.image)} alt={item.title} aspect="1" />
															</div>
															<div class="detail-item-info">
																<span class="detail-item-name">{item.title}</span>
																<span class="detail-item-meta">
																	{ts('admin.qty')}: {item.qty} &middot; ${item.price.toFixed(2)}
																</span>
															</div>
															<span class="detail-item-sub">${(item.price * item.qty).toFixed(2)}</span>
														</li>
													{/each}
												</ul>
											</div>
										{/if}
									</div>
								{/each}
							</div>
						{/if}
					{/if}
				</GlassContainer>
			</div>
		{/if}
	</div>
</section>

<style>
	.profile-page {
		max-width: 700px;
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
	}

	.profile-header {
		display: flex;
		align-items: center;
		gap: var(--space-6);
		margin-bottom: var(--space-8);
	}

	.avatar {
		width: 80px;
		height: 80px;
		border-radius: var(--radius-full);
		background: linear-gradient(135deg, var(--accent-1), var(--accent-2));
		display: grid;
		place-items: center;
		color: oklch(1 0 0);
		flex-shrink: 0;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-4);
		margin-bottom: var(--space-8);
	}

	.stat-card {
		background: var(--bg-secondary);
		border-radius: var(--radius-md);
		padding: var(--space-4);
		text-align: center;
	}

	.stat-value {
		display: block;
		font-size: var(--text-xl);
		font-weight: 800;
		color: var(--accent-1);
	}

	.stat-label {
		display: block;
		font-size: var(--text-xs);
		color: var(--text-muted);
		margin-top: var(--space-1);
	}

	.profile-links {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.profile-links :global(.btn) {
		width: 100%;
		justify-content: flex-start;
	}

	.orders-toggle {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		width: 100%;
		padding: var(--space-3) var(--space-5);
		border-radius: var(--radius-md);
		border: 1px solid var(--border);
		background: transparent;
		color: var(--text);
		font-size: var(--text-sm);
		font-weight: 600;
		cursor: pointer;
		transition:
			background var(--duration-fast),
			border-color var(--duration-fast);
	}

	.orders-toggle:hover {
		background: var(--bg-secondary);
		border-color: var(--accent-1);
	}

	/* --- Lookup section --- */
	.lookup-section {
		min-height: 120px;
	}

	.lookup-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.lookup-title {
		font-size: var(--text-lg);
		font-weight: 700;
		margin-bottom: var(--space-1);
	}

	.admin-link {
		display: grid;
		place-items: center;
		width: 2rem;
		height: 2rem;
		border-radius: var(--radius-sm);
		color: var(--text-muted);
		transition:
			color var(--duration-fast),
			background var(--duration-fast);
	}

	.admin-link:hover {
		color: var(--accent-1);
		background: var(--bg-secondary);
	}

	.lookup-desc {
		font-size: var(--text-sm);
		color: var(--text-muted);
		margin-bottom: var(--space-5);
	}

	.lookup-form {
		display: flex;
		gap: var(--space-3);
		align-items: flex-start;
	}

	.lookup-input-wrap {
		flex: 1;
	}

	.lookup-input-wrap input {
		width: 100%;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		padding: var(--space-3) var(--space-4);
		font-size: var(--text-sm);
		color: var(--text);
		transition: border-color var(--duration-fast);
	}

	.lookup-input-wrap input:focus {
		outline: none;
		border-color: var(--accent-1);
	}

	.lookup-input-wrap.has-error input {
		border-color: var(--danger);
	}

	.field-error {
		color: var(--danger);
		font-size: var(--text-xs);
		font-weight: 600;
		margin-top: var(--space-1);
	}

	.lookup-error {
		color: var(--danger);
		font-size: var(--text-sm);
		font-weight: 600;
		margin-top: var(--space-3);
	}

	.empty-orders {
		text-align: center;
		padding: var(--space-8);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-3);
		color: var(--text-muted);
	}

	/* --- Orders result list --- */
	.orders-result {
		margin-top: var(--space-5);
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.order-row {
		border-bottom: 1px solid color-mix(in oklch, var(--border) 50%, transparent);
		padding-bottom: var(--space-3);
	}

	.order-row:last-child {
		border-bottom: none;
		padding-bottom: 0;
	}

	.order-row-summary {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		flex-wrap: wrap;
		font-size: var(--text-sm);
	}

	.order-code {
		font-family: var(--font-mono);
		font-size: var(--text-xs);
		background: var(--bg-secondary);
		padding: var(--space-1) var(--space-2);
		border-radius: var(--radius-sm);
		color: var(--accent-1);
	}

	.muted {
		color: var(--text-muted);
	}

	.font-bold {
		font-weight: 700;
	}

	.status-pill {
		display: inline-block;
		font-size: var(--text-xs);
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		padding: var(--space-1) var(--space-2);
		border-radius: var(--radius-full);
		background: color-mix(in oklch, var(--pill-color) 15%, transparent);
		color: var(--pill-color);
	}

	.details-toggle {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		margin-left: auto;
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
	}

	.details-toggle:hover {
		color: var(--accent-1);
		background: var(--bg-secondary);
	}

	/* --- Expanded order detail card (read-only) --- */
	.order-detail-card {
		margin-top: var(--space-3);
		padding: var(--space-4);
		background: var(--bg-secondary);
		border-radius: var(--radius-md);
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.detail-meta {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3) var(--space-5);
		font-size: var(--text-sm);
	}

	.meta-item {
		display: flex;
		align-items: baseline;
		gap: var(--space-2);
	}

	.meta-label {
		font-size: var(--text-xs);
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--text-muted);
	}

	.detail-id {
		font-family: var(--font-mono);
		font-size: var(--text-xs);
		color: var(--accent-1);
		word-break: break-all;
	}

	.detail-status-row {
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

	.status-select-ro {
		font-size: var(--text-xs);
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		padding: var(--space-1) var(--space-3);
		border-radius: var(--radius-full);
		border: 1px solid color-mix(in oklch, var(--sel-color) 30%, transparent);
		background: color-mix(in oklch, var(--sel-color) 12%, transparent);
		color: var(--sel-color);
	}

	.detail-total {
		margin-left: auto;
		font-weight: 800;
		font-size: var(--text-lg);
		color: var(--accent-1);
	}

	.detail-items {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		border-top: 1px solid var(--border);
		padding-top: var(--space-3);
	}

	.detail-item-row {
		display: grid;
		grid-template-columns: 44px 1fr auto;
		gap: var(--space-3);
		align-items: center;
	}

	.detail-thumb {
		width: 44px;
		height: 44px;
		border-radius: var(--radius-sm);
		overflow: hidden;
	}

	.detail-item-info {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}

	.detail-item-name {
		font-size: var(--text-sm);
		font-weight: 600;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.detail-item-meta {
		font-size: var(--text-xs);
		color: var(--text-muted);
	}

	.detail-item-sub {
		font-size: var(--text-sm);
		font-weight: 700;
		white-space: nowrap;
	}

	@media (max-width: 500px) {
		.lookup-form {
			flex-direction: column;
		}

		.lookup-form :global(.btn) {
			width: 100%;
		}

		.order-row-summary {
			font-size: var(--text-xs);
		}
	}
</style>
