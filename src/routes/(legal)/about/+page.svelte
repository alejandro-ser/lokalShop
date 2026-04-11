<script>
	import GlassContainer from '$lib/components/GlassContainer.svelte';
	import Icon from '$lib/components/Icon.svelte';
</script>

<svelte:head>
	<title>About — obraNativa</title>
</svelte:head>

<section class="section">
	<div class="container legal-page">
		<h1 class="page-title">About obraNativa</h1>
		<p class="page-subtitle">Crafting digital experiences with care</p>

		<div class="content">
			<GlassContainer>
				<h2>Our Mission</h2>
				<p>
					obraNativa is a curated marketplace dedicated to connecting people with unique, high-quality products.
					We believe that every purchase should be an experience — from discovery to delivery.
				</p>
			</GlassContainer>

			<GlassContainer>
				<h2>Built Different</h2>
				<p>
					This platform is built with cutting-edge web technology: SvelteKit for blazing-fast performance,
					modern CSS with OKLCH color science for a visually stunning experience, and IndexedDB for
					offline-first reliability. Zero bloat, pure craft.
				</p>
			</GlassContainer>

			<div class="values-grid">
				<div class="value-card">
					<Icon name="star" size={32} />
					<h3>Quality First</h3>
					<p>Every product is carefully curated for quality and uniqueness.</p>
				</div>
				<div class="value-card">
					<Icon name="tag" size={32} />
					<h3>Fair Pricing</h3>
					<p>Transparent pricing with no hidden costs or surprises.</p>
				</div>
				<div class="value-card">
					<Icon name="message-circle" size={32} />
					<h3>Community</h3>
					<p>Building a community of craft enthusiasts and artisans.</p>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.legal-page {
		max-width: 800px;
	}

	.content {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
		margin-top: var(--space-8);
	}

	.content h2 {
		font-size: var(--text-xl);
		font-weight: 700;
		margin-bottom: var(--space-3);
	}

	.content p {
		color: var(--text-muted);
		line-height: 1.8;
	}

	.values-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: var(--space-4);
		margin-top: var(--space-4);
	}

	.value-card {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		padding: var(--space-6);
		text-align: center;
	}

	.value-card h3 {
		font-size: var(--text-base);
		font-weight: 700;
		margin-top: var(--space-3);
		margin-bottom: var(--space-2);
	}

	.value-card p {
		font-size: var(--text-sm);
	}

	.value-card :global(svg) {
		color: var(--accent-1);
		margin-inline: auto;
	}
</style>
