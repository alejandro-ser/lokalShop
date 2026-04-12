<script lang="ts">
	import { base } from '$app/paths';
	import Image from './Image.svelte';
	import Button from './Button.svelte';
	import Icon from './Icon.svelte';
	import { cart } from '$lib/store/cart.js';
	import { ts } from '$lib/i18n/index.svelte.js';
	import type { Product } from '$lib/types/api.js';

	let { product }: { product: Product } = $props();

	function addToCart() {
		cart.addItem({
			id: product.id,
			title: product.title,
			price: product.price,
			image: product.images?.[0] || ''
		});
	}

	let imageUrl = $derived.by(() => {
		const img = product.images?.[0] || '';
		try {
			const cleaned = img.replace(/^\[?"?|"?\]?$/g, '');
			new URL(cleaned);
			return cleaned;
		} catch {
			return 'https://placehold.co/400x300/eee/999?text=No+Image';
		}
	});
</script>

<article class="card">
	<a href="{base}/products/{product.id}" class="card-image">
		<Image src={imageUrl} alt={product.title} aspect="4/3" />
	</a>
	<div class="card-body">
		<a href="{base}/products/{product.id}" class="card-title">
			{product.title}
		</a>
		<span class="card-category">{product.category?.name || ''}</span>
		<div class="card-footer">
			<span class="card-price">${product.price}</span>
			<Button variant="primary" size="sm" onclick={addToCart}>
				<Icon name="shopping-cart" size={16} />
				{ts('product.add_to_cart')}
			</Button>
		</div>
	</div>
</article>

<style>
	.card {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		overflow: hidden;
		transition:
			transform var(--duration-normal) var(--ease-out),
			box-shadow var(--duration-normal) var(--ease-out);
		container-type: inline-size;
	}

	.card:hover {
		transform: translateY(-4px);
		box-shadow: var(--shadow-lg);
	}

	.card-image {
		display: block;
	}

	.card-body {
		padding: var(--space-4);
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.card-title {
		font-weight: 600;
		font-size: var(--text-base);
		line-height: 1.3;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		transition: color var(--duration-fast);
	}

	.card-title:hover {
		color: var(--accent-1);
	}

	.card-category {
		font-size: var(--text-xs);
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.card-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: var(--space-2);
	}

	.card-price {
		font-size: var(--text-xl);
		font-weight: 700;
		color: var(--accent-1);
	}

	@container (max-width: 200px) {
		.card-footer {
			flex-direction: column;
			gap: var(--space-2);
			align-items: stretch;
		}
	}
</style>
