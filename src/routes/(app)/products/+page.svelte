<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import ProductCard from '$lib/components/ProductCard.svelte';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { getProducts } from '$lib/services/api.js';
	import { ts } from '$lib/i18n/index.svelte.js';
	import type { Product } from '$lib/types/api.js';

	const LIMIT = 12;

	let products = $state<Product[]>([]);
	let loading = $state(true);
	let loadingMore = $state(false);
	let hasMore = $state(true);

	let offset = $derived(Number(page.url.searchParams.get('offset')) || 0);

	onMount(() => loadInitial());

	async function loadInitial() {
		loading = true;
		try {
			const data = await getProducts(0, offset + LIMIT);
			products = data;
			hasMore = data.length >= offset + LIMIT;
		} catch (e) {
			console.error('Failed to load products:', e);
		} finally {
			loading = false;
		}
	}

	async function loadMore() {
		const newOffset = products.length;
		loadingMore = true;
		try {
			const data = await getProducts(newOffset, LIMIT);
			if (data.length < LIMIT) hasMore = false;
			products = [...products, ...data];
			const url = new URL(page.url);
			url.searchParams.set('offset', String(newOffset));
			goto(url.toString(), { replaceState: true, noScroll: true, keepFocus: true });
		} catch (e) {
			console.error('Failed to load more:', e);
		} finally {
			loadingMore = false;
		}
	}
</script>

<svelte:head>
	<title>{ts('product.all_products')} — LokalShop</title>
</svelte:head>

<section class="section">
	<div class="container">
		<h1 class="page-title">{ts('product.all_products')}</h1>
		<p class="page-subtitle">{ts('product.browse_collection')}</p>

		<div class="products-content">
			{#if loading}
				<div class="product-grid">
					{#each Array(LIMIT) as _, i (i)}
						<div class="skeleton-card">
							<div class="skeleton" style="aspect-ratio: 4/3;"></div>
							<div style="padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-2);">
								<div class="skeleton" style="height: 1rem; width: 80%;"></div>
								<div class="skeleton" style="height: 0.75rem; width: 40%;"></div>
								<div class="skeleton" style="height: 1.5rem; width: 30%; margin-top: var(--space-2);"></div>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="product-grid">
					{#each products as product (product.id)}
						<ProductCard {product} />
					{/each}
				</div>

				{#if hasMore}
					<div class="load-more">
						<Button variant="secondary" size="lg" onclick={loadMore} disabled={loadingMore}>
						{#if loadingMore}
							{ts('product.loading')}
						{:else}
							{ts('product.load_more')}
								<Icon name="chevron-right" size={18} />
							{/if}
						</Button>
					</div>
				{/if}

				{#if products.length === 0}
					<div class="empty-state">
						<Icon name="tag" size={48} />
						<p>{ts('product.no_products')}</p>
					</div>
				{/if}
			{/if}
		</div>
	</div>
</section>

<style>
	.products-content {
		margin-top: var(--space-8);
	}

	.load-more {
		display: flex;
		justify-content: center;
		margin-top: var(--space-10);
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

	.skeleton-card {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		overflow: hidden;
	}
</style>
