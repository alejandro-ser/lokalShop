<script lang="ts">
	import GlassContainer from '$lib/components/GlassContainer.svelte';
	import RT from '$lib/components/RT.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { ts } from '$lib/i18n/index.svelte.js';
</script>

<svelte:head>
	<title>{ts('about.title')} — LokalShop</title>
</svelte:head>

<section class="section">
	<div class="container legal-page">
		<h1 class="page-title">{ts('about.title')}</h1>
		<p class="page-subtitle">{ts('about.subtitle')}</p>

		<div class="content">
			<GlassContainer>
				<h2>{ts('about.mission_title')}</h2>
				<RT content={ts('about.mission_text')} />
			</GlassContainer>

			<GlassContainer>
				<h2>{ts('about.story_title')}</h2>
				<RT content={ts('about.story_text')} />
			</GlassContainer>

			<GlassContainer>
				<h2>{ts('about.tech_title')}</h2>
				<RT content={ts('about.tech_text')} />
			</GlassContainer>

			<div class="values-grid">
				<div class="value-card">
					<Icon name="star" size={32} />
					<h3>{ts('about.values.quality_title')}</h3>
					<p>{ts('about.values.quality_text')}</p>
				</div>
				<div class="value-card">
					<Icon name="tag" size={32} />
					<h3>{ts('about.values.pricing_title')}</h3>
					<p>{ts('about.values.pricing_text')}</p>
				</div>
				<div class="value-card">
					<Icon name="message-circle" size={32} />
					<h3>{ts('about.values.community_title')}</h3>
					<p>{ts('about.values.community_text')}</p>
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
