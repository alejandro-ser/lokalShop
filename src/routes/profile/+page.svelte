<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import GlassContainer from '$lib/components/GlassContainer.svelte';
	import Button from '$lib/components/Button.svelte';
	import { base } from '$app/paths';
	import { cart } from '$lib/store/cart.js';
	import { t } from '$lib/store/i18n.js';

	let totalSpent = $derived($cart.reduce((sum, i) => sum + i.price * i.qty, 0));
</script>

<svelte:head>
	<title>{$t.nav.profile} — obraNativa</title>
</svelte:head>

<section class="section">
	<div class="container profile-page">
		<GlassContainer>
			<div class="profile-header">
				<div class="avatar">
					<Icon name="user" size={48} />
				</div>
				<div>
					<h1 class="page-title">{$t.profile.guest}</h1>
					<p class="page-subtitle">{$t.profile.welcome}</p>
				</div>
			</div>

			<div class="stats-grid">
				<div class="stat-card">
					<span class="stat-value">{$cart.length}</span>
					<span class="stat-label">{$t.profile.cart_items}</span>
				</div>
				<div class="stat-card">
					<span class="stat-value">${totalSpent.toFixed(2)}</span>
					<span class="stat-label">{$t.profile.cart_total}</span>
				</div>
				<div class="stat-card">
					<span class="stat-value">0</span>
					<span class="stat-label">{$t.profile.orders}</span>
				</div>
			</div>

			<div class="profile-links">
				<Button href="{base}/cart" variant="secondary" size="md">
					<Icon name="shopping-cart" size={18} />
					{$t.profile.view_cart}
				</Button>
				<Button href="{base}/products" variant="secondary" size="md">
					<Icon name="tag" size={18} />
					{$t.home.browse}
				</Button>
				<Button href="{base}/contacto" variant="secondary" size="md">
					<Icon name="message-circle" size={18} />
					{$t.profile.contact_us}
				</Button>
			</div>
		</GlassContainer>
	</div>
</section>

<style>
	.profile-page {
		max-width: 600px;
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
</style>
