<script lang="ts">
	import { base } from '$app/paths';
	import Image from './Image.svelte';
	import type { Category } from '$lib/types/api.js';

	let { category }: { category: Category } = $props();

	let imageUrl = $derived.by(() => {
		const img = category.image || '';
		try {
			const cleaned = img.replace(/^\[?"?|"?\]?$/g, '');
			new URL(cleaned);
			return cleaned;
		} catch {
			return 'https://placehold.co/400x300/eee/999?text=No+Image';
		}
	});
</script>

<a href="{base}/categories/{category.id}" class="cat-card">
	<div class="cat-image">
		<Image src={imageUrl} alt={category.name} aspect="3/2" />
	</div>
	<div class="cat-info">
		<h3 class="cat-name">{category.name}</h3>
	</div>
</a>

<style>
	.cat-card {
		display: block;
		border-radius: var(--radius-lg);
		overflow: hidden;
		position: relative;
		transition:
			transform var(--duration-normal) var(--ease-out),
			box-shadow var(--duration-normal) var(--ease-out);
	}

	.cat-card:hover {
		transform: translateY(-2px);
		box-shadow: var(--shadow-lg);
	}

	.cat-image {
		position: relative;
	}

	.cat-info {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		padding: var(--space-4);
		background: linear-gradient(to top, oklch(0.1 0 0 / 0.7), transparent);
	}

	.cat-name {
		color: oklch(1 0 0);
		font-size: var(--text-lg);
		font-weight: 700;
		text-shadow: 0 1px 3px oklch(0 0 0 / 0.3);
	}
</style>
