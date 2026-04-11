<script lang="ts">
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import ProductCard from '$lib/components/ProductCard.svelte';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { getProductsByCategory, getCategory } from '$lib/services/api.js';
	import { t } from '$lib/store/i18n.js';
	import type { Product, Category } from '$lib/types/api.js';

	const LIMIT = 12;

	let products = $state<Product[]>([]);
	let category = $state.raw<Category | null>(null);
	let loading = $state(true);
	let loadingMore = $state(false);
	let hasMore = $state(true);

	let slug = $derived(Number(page.params.slug));

	onMount(async () => {
		try {
			const [cat, prods] = await Promise.all([
				getCategory(slug),
				getProductsByCategory(slug, 0, LIMIT)
			]);
			category = cat;
			products = prods;
			hasMore = prods.length >= LIMIT;
		} catch (e) {
			console.error('Failed to load category:', e);
		} finally {
			loading = false;
		}
	});

	async function loadMore() {
		loadingMore = true;
		try {
			const data = await getProductsByCategory(slug, products.length, LIMIT);
			if (data.length < LIMIT) hasMore = false;
			products = [...products, ...data];
		} catch (e) {
			console.error('Failed to load more:', e);
		} finally {
			loadingMore = false;
		}
	}
</script>

<svelte:head>
	<title>{category?.name || 'Category'} — obraNativa</title>
</svelte:head>

<section class="section">
	<div class="container">
		<a href="{base}/categories" class="back-link">
			<Icon name="arrow-left" size={18} />
			{$t.category.all}
		</a>

		{#if loading}
			<div class="skeleton" style="height: 2.5rem; width: 40%; margin-bottom: var(--space-8);"></div>
			<div class="product-grid">
				{#each Array(LIMIT) as _, i (i)}
					<div class="skeleton-card">
						<div class="skeleton" style="aspect-ratio: 4/3;"></div>
						<div style="padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-2);">
							<div class="skeleton" style="height: 1rem; width: 80%;"></div>
							<div class="skeleton" style="height: 1.5rem; width: 30%;"></div>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<h1 class="page-title">{category?.name || 'Category'}</h1>

			<div class="content">
				<div class="product-grid">
					{#each products as product (product.id)}
						<ProductCard {product} />
					{/each}
				</div>

				{#if hasMore}
					<div class="load-more">
						<Button variant="secondary" size="lg" onclick={loadMore} disabled={loadingMore}>
							{#if loadingMore}
								{$t.product.loading}
							{:else}
								{$t.product.load_more} <Icon name="chevron-right" size={18} />
							{/if}
						</Button>
					</div>
				{/if}

				{#if products.length === 0}
					<div class="empty-state">
						<Icon name="tag" size={48} />
						<p>{$t.category.no_products}</p>
					</div>
				{/if}
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

	.content {
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
