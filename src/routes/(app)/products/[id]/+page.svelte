<script lang="ts">
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import Image from '$lib/components/Image.svelte';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import GlassContainer from '$lib/components/GlassContainer.svelte';
	import { getProduct } from '$lib/services/api.js';
	import { cart } from '$lib/store/cart.js';
	import { t } from '$lib/store/i18n.js';
	import type { Product } from '$lib/types/api.js';

	let product = $state.raw<Product | null>(null);
	let loading = $state(true);
	let selectedImage = $state(0);
	let qty = $state(1);

	let id = $derived(Number(page.params.id));

	onMount(async () => {
		try {
			product = await getProduct(id);
		} catch (e) {
			console.error('Failed to load product:', e);
		} finally {
			loading = false;
		}
	});

	function cleanUrl(img: string): string {
		try {
			const cleaned = (img || '').replace(/^\[?"?|"?\]?$/g, '');
			new URL(cleaned);
			return cleaned;
		} catch {
			return 'https://placehold.co/600x400/eee/999?text=No+Image';
		}
	}

	function addToCart() {
		if (!product) return;
		cart.addItem({
			id: product.id,
			title: product.title,
			price: product.price,
			image: product.images?.[0] || '',
			qty
		});
	}

	let images = $derived(product?.images?.map(cleanUrl) || []);
</script>

<svelte:head>
	<title>{product?.title || 'Product'} — obraNativa</title>
</svelte:head>

<section class="section">
	<div class="container">
		<a href="{base}/products" class="back-link">
			<Icon name="arrow-left" size={18} />
			{$t.product.back}
		</a>

		{#if loading}
			<div class="detail-grid">
				<div class="skeleton" style="aspect-ratio: 1; border-radius: var(--radius-lg);"></div>
				<div style="display: flex; flex-direction: column; gap: var(--space-4);">
					<div class="skeleton" style="height: 2rem; width: 70%;"></div>
					<div class="skeleton" style="height: 1rem; width: 30%;"></div>
					<div class="skeleton" style="height: 6rem; width: 100%;"></div>
					<div class="skeleton" style="height: 3rem; width: 50%;"></div>
				</div>
			</div>
		{:else if product}
			<div class="detail-grid">
				<div class="gallery">
					<div class="gallery-main">
						<Image src={images[selectedImage] || images[0]} alt={product.title} aspect="1" />
					</div>
					{#if images.length > 1}
						<div class="gallery-thumbs">
							{#each images as img, i (i)}
								<button
									class="thumb"
									class:active={selectedImage === i}
									onclick={() => (selectedImage = i)}
								>
									<Image src={img} alt="{product.title} thumbnail {i + 1}" aspect="1" />
								</button>
							{/each}
						</div>
					{/if}
				</div>

				<div class="detail-info">
					<GlassContainer>
						<span class="detail-category">{product.category?.name || ''}</span>
						<h1 class="detail-title">{product.title}</h1>
						<p class="detail-price">${product.price}</p>
						<p class="detail-desc">{product.description}</p>

						<div class="qty-row">
							<span class="qty-label">{$t.product.quantity}</span>
							<div class="qty-control">
								<button class="qty-btn" onclick={() => qty > 1 && (qty -= 1)} aria-label="Decrease">
									<Icon name="minus" size={16} />
								</button>
								<span class="qty-value">{qty}</span>
								<button class="qty-btn" onclick={() => (qty += 1)} aria-label="Increase">
									<Icon name="plus" size={16} />
								</button>
							</div>
						</div>

						<Button variant="primary" size="lg" onclick={addToCart}>
							<Icon name="shopping-cart" size={20} />
							{$t.product.add_cart_full} — ${product.price * qty}
						</Button>
					</GlassContainer>
				</div>
			</div>
		{:else}
			<div class="empty-state">
				<Icon name="info" size={48} />
				<p>{$t.product.not_found}</p>
				<Button href="{base}/products" variant="secondary">{$t.product.back}</Button>
			</div>
		{/if}
	</div>
</section>

<style>
	.back-link {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		color: var(--text-muted);
		font-size: var(--text-sm);
		margin-bottom: var(--space-6);
		transition: color var(--duration-fast);
	}

	.back-link:hover {
		color: var(--text);
	}

	.detail-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-8);
	}

	@media (min-width: 768px) {
		.detail-grid {
			grid-template-columns: 1fr 1fr;
			align-items: start;
		}
	}

	.gallery-main {
		border-radius: var(--radius-lg);
		overflow: hidden;
	}

	.gallery-thumbs {
		display: flex;
		gap: var(--space-2);
		margin-top: var(--space-3);
	}

	.thumb {
		width: 64px;
		height: 64px;
		border-radius: var(--radius-sm);
		overflow: hidden;
		border: 2px solid transparent;
		opacity: 0.6;
		transition:
			opacity var(--duration-fast),
			border-color var(--duration-fast);
	}

	.thumb.active,
	.thumb:hover {
		opacity: 1;
		border-color: var(--accent-1);
	}

	.detail-category {
		font-size: var(--text-xs);
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--accent-1);
	}

	.detail-title {
		font-size: var(--text-2xl);
		font-weight: 700;
		line-height: 1.2;
		margin-top: var(--space-2);
	}

	.detail-price {
		font-size: var(--text-3xl);
		font-weight: 800;
		color: var(--accent-1);
		margin-top: var(--space-3);
	}

	.detail-desc {
		color: var(--text-muted);
		line-height: 1.7;
		margin-top: var(--space-4);
	}

	.qty-row {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		margin-top: var(--space-6);
		margin-bottom: var(--space-6);
	}

	.qty-label {
		font-weight: 600;
		font-size: var(--text-sm);
	}

	.qty-control {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		background: var(--bg-secondary);
		border-radius: var(--radius-md);
		padding: var(--space-1) var(--space-2);
	}

	.qty-btn {
		display: grid;
		place-items: center;
		width: 2rem;
		height: 2rem;
		border-radius: var(--radius-sm);
		transition: background var(--duration-fast);
	}

	.qty-btn:hover {
		background: var(--border);
	}

	.qty-value {
		min-width: 2rem;
		text-align: center;
		font-weight: 700;
	}

	.empty-state {
		text-align: center;
		padding: var(--space-16);
		color: var(--text-muted);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-4);
	}
</style>
