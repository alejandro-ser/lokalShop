<script lang="ts">
	import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import ProductCard from '$lib/components/ProductCard.svelte';
	import CategoryCard from '$lib/components/CategoryCard.svelte';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import GlassContainer from '$lib/components/GlassContainer.svelte';
	import { getProducts, getCategories } from '$lib/services/api.js';
	import { ts } from '$lib/i18n/index.svelte.js';
	import type { Product, Category } from '$lib/types/api.js';

	let products = $state.raw<Product[]>([]);
	let categories = $state.raw<Category[]>([]);
	let loading = $state(true);

	onMount(async () => {
		try {
			const [p, c] = await Promise.all([getProducts(0, 8), getCategories()]);
			products = p;
			categories = c.slice(0, 5);
		} catch (e) {
			console.error('Failed to load home data:', e);
		} finally {
			loading = false;
		}
	});
</script>

<svelte:head>
	<title>obraNativa — {ts('home.hero_title_2')}</title>
</svelte:head>

<section class="hero section">
	<div class="container">
		<GlassContainer>
			<div class="hero-content">
				<h1 class="hero-title">
					{ts('home.hero_title_1')}<br />
					<span class="gradient-text">{ts('home.hero_title_2')}</span>
				</h1>
				<p class="hero-subtitle">{ts('home.hero_subtitle')}</p>
				<div class="hero-actions">
					<Button href="{base}/products" variant="primary" size="lg">
						<Icon name="tag" size={20} />
						{ts('home.browse')}
					</Button>
					<Button href="{base}/categories" variant="secondary" size="lg">
						<Icon name="grid" size={20} />
						{ts('nav.categories')}
					</Button>
				</div>
			</div>
		</GlassContainer>
	</div>
</section>

<section class="section">
	<div class="container">
		<div class="section-header">
			<h2 class="page-title">{ts('nav.categories')}</h2>
			<Button href="{base}/categories" variant="ghost" size="sm">
				{ts('home.view_all')} <Icon name="chevron-right" size={16} />
			</Button>
		</div>
		{#if loading}
			<div class="category-grid">
				{#each Array(5) as _, i (i)}
					<div class="skeleton" style="aspect-ratio: 3/2;"></div>
				{/each}
			</div>
		{:else}
			<div class="category-grid">
				{#each categories as category (category.id)}
					<CategoryCard {category} />
				{/each}
			</div>
		{/if}
	</div>
</section>

<section class="section">
	<div class="container">
		<div class="section-header">
			<h2 class="page-title">{ts('home.featured')}</h2>
			<Button href="{base}/products" variant="ghost" size="sm">
				{ts('home.view_all')} <Icon name="chevron-right" size={16} />
			</Button>
		</div>
		{#if loading}
			<div class="product-grid">
				{#each Array(8) as _, i (i)}
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
		{/if}
	</div>
</section>

<style>
	.hero-content {
		text-align: center;
		padding: var(--space-8) 0;
	}

	.hero-title {
		font-size: var(--text-4xl);
		font-weight: 800;
		letter-spacing: -0.03em;
		line-height: 1.1;
	}

	.gradient-text {
		background: linear-gradient(135deg, var(--accent-1), var(--accent-2), var(--accent-3));
		background-size: 200% 200%;
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
		animation: gradient-shift 6s ease infinite;
	}

	@keyframes gradient-shift {
		0%, 100% { background-position: 0% 50%; }
		50% { background-position: 100% 50%; }
	}

	.hero-subtitle {
		font-size: var(--text-lg);
		color: var(--text-muted);
		max-width: 480px;
		margin: var(--space-4) auto 0;
	}

	.hero-actions {
		display: flex;
		gap: var(--space-4);
		justify-content: center;
		margin-top: var(--space-8);
		flex-wrap: wrap;
	}

	.section-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--space-8);
	}

	.skeleton-card {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		overflow: hidden;
	}
</style>
