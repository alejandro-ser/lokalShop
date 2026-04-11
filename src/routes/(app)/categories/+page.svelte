<script lang="ts">
	import { onMount } from 'svelte';
	import CategoryCard from '$lib/components/CategoryCard.svelte';
	import { getCategories } from '$lib/services/api.js';
	import { t } from '$lib/store/i18n.js';
	import type { Category } from '$lib/types/api.js';

	let categories = $state.raw<Category[]>([]);
	let loading = $state(true);

	onMount(async () => {
		try {
			categories = await getCategories();
		} catch (e) {
			console.error('Failed to load categories:', e);
		} finally {
			loading = false;
		}
	});
</script>

<svelte:head>
	<title>{$t.nav.categories} — obraNativa</title>
</svelte:head>

<section class="section">
	<div class="container">
		<h1 class="page-title">{$t.nav.categories}</h1>
		<p class="page-subtitle">{$t.category.explore}</p>

		<div class="grid-wrap">
			{#if loading}
				<div class="category-grid">
					{#each Array(6) as _, i (i)}
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
	</div>
</section>

<style>
	.grid-wrap {
		margin-top: var(--space-8);
	}
</style>
