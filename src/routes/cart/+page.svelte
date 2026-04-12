<script lang="ts">
	import { base } from '$app/paths';
	import Image from '$lib/components/Image.svelte';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import GlassContainer from '$lib/components/GlassContainer.svelte';
	import { cart } from '$lib/store/cart.js';
	import { ts } from '$lib/i18n/index.svelte.js';

	let total = $derived($cart.reduce((sum, i) => sum + i.price * i.qty, 0));
	let itemCount = $derived($cart.reduce((sum, i) => sum + i.qty, 0));

	function cleanUrl(img: string): string {
		try {
			const cleaned = (img || '').replace(/^\[?"?|"?\]?$/g, '');
			new URL(cleaned);
			return cleaned;
		} catch {
			return 'https://placehold.co/100x100/eee/999?text=No+Image';
		}
	}
</script>

<svelte:head>
	<title>{ts('cart.title')} ({itemCount}) — obraNativa</title>
</svelte:head>

<section class="section">
	<div class="container">
		<h1 class="page-title">{ts('cart.title')}</h1>

		{#if $cart.length === 0}
			<div class="empty-state">
				<Icon name="shopping-cart" size={64} />
				<h2>{ts('cart.empty')}</h2>
				<p>{ts('cart.empty_desc')}</p>
				<Button href="{base}/products" variant="primary" size="lg">
					<Icon name="tag" size={20} />
					{ts('home.browse')}
				</Button>
			</div>
		{:else}
			<div class="cart-layout">
				<div class="cart-items">
					{#each $cart as item (item.id)}
						<div class="cart-item glass">
							<a href="{base}/products/{item.id}" class="item-image">
								<Image src={cleanUrl(item.image)} alt={item.title} aspect="1" />
							</a>
							<div class="item-info">
								<a href="{base}/products/{item.id}" class="item-title">{item.title}</a>
								<span class="item-price">${item.price}</span>
							</div>
							<div class="item-actions">
								<div class="qty-control">
									<button
										class="qty-btn"
										onclick={() => cart.updateQty(item.id, item.qty - 1)}
										aria-label="Decrease quantity"
									>
										<Icon name="minus" size={14} />
									</button>
									<span class="qty-value">{item.qty}</span>
									<button
										class="qty-btn"
										onclick={() => cart.updateQty(item.id, item.qty + 1)}
										aria-label="Increase quantity"
									>
										<Icon name="plus" size={14} />
									</button>
								</div>
								<span class="item-subtotal">${(item.price * item.qty).toFixed(2)}</span>
								<button
									class="remove-btn"
									onclick={() => cart.removeItem(item.id)}
									aria-label="Remove {item.title}"
								>
									<Icon name="trash" size={16} />
								</button>
							</div>
						</div>
					{/each}
				</div>

				<aside class="cart-summary">
					<GlassContainer>
						<h2 class="summary-title">{ts('cart.summary')}</h2>
						<div class="summary-row">
							<span>{ts('cart.items')} ({itemCount})</span>
							<span>${total.toFixed(2)}</span>
						</div>
						<div class="summary-row">
							<span>{ts('cart.shipping')}</span>
							<span class="free">{ts('cart.free')}</span>
						</div>
						<hr />
						<div class="summary-row total">
							<span>{ts('cart.total')}</span>
							<span>${total.toFixed(2)}</span>
						</div>
						<Button variant="primary" size="lg" onclick={() => alert('Checkout coming soon!')}>
							{ts('cart.checkout')}
						</Button>
						<Button variant="ghost" size="sm" onclick={() => cart.clearCart()}>
							<Icon name="trash" size={14} />
							{ts('cart.clear')}
						</Button>
					</GlassContainer>
				</aside>
			</div>
		{/if}
	</div>
</section>

<style>
	.empty-state {
		text-align: center;
		padding: var(--space-16) var(--space-4);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-4);
		color: var(--text-muted);
	}

	.empty-state h2 {
		font-size: var(--text-2xl);
		color: var(--text);
	}

	.cart-layout {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-8);
		margin-top: var(--space-8);
	}

	@media (min-width: 768px) {
		.cart-layout {
			grid-template-columns: 1fr 340px;
			align-items: start;
		}
	}

	.cart-items {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.cart-item {
		display: grid;
		grid-template-columns: 80px 1fr auto;
		gap: var(--space-4);
		align-items: center;
		padding: var(--space-4);
	}

	.item-image {
		width: 80px;
		flex-shrink: 0;
		border-radius: var(--radius-sm);
		overflow: hidden;
	}

	.item-info {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		min-width: 0;
	}

	.item-title {
		font-weight: 600;
		font-size: var(--text-sm);
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		transition: color var(--duration-fast);
	}

	.item-title:hover {
		color: var(--accent-1);
	}

	.item-price {
		font-size: var(--text-sm);
		color: var(--text-muted);
	}

	.item-actions {
		display: flex;
		align-items: center;
		gap: var(--space-4);
	}

	.qty-control {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		background: var(--bg-secondary);
		border-radius: var(--radius-md);
		padding: var(--space-1);
	}

	.qty-btn {
		display: grid;
		place-items: center;
		width: 1.75rem;
		height: 1.75rem;
		border-radius: var(--radius-sm);
		transition: background var(--duration-fast);
	}

	.qty-btn:hover {
		background: var(--border);
	}

	.qty-value {
		min-width: 1.5rem;
		text-align: center;
		font-size: var(--text-sm);
		font-weight: 700;
	}

	.item-subtotal {
		font-weight: 700;
		min-width: 5rem;
		text-align: right;
	}

	.remove-btn {
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

	.remove-btn:hover {
		color: var(--danger);
		background: oklch(0.65 0.24 25 / 0.1);
	}

	.summary-title {
		font-size: var(--text-lg);
		font-weight: 700;
		margin-bottom: var(--space-6);
	}

	.summary-row {
		display: flex;
		justify-content: space-between;
		padding-block: var(--space-2);
		font-size: var(--text-sm);
	}

	.summary-row.total {
		font-size: var(--text-xl);
		font-weight: 800;
		padding-top: var(--space-4);
	}

	.free {
		color: var(--success);
		font-weight: 600;
	}

	hr {
		border: none;
		border-top: 1px solid var(--border);
		margin-block: var(--space-3);
	}

	.cart-summary :global(.btn) {
		width: 100%;
		margin-top: var(--space-4);
	}

	@media (max-width: 767px) {
		.cart-item {
			grid-template-columns: 60px 1fr;
		}

		.item-actions {
			grid-column: 1 / -1;
			justify-content: space-between;
		}
	}
</style>
