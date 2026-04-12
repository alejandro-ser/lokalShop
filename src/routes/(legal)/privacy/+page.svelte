<script lang="ts">
	import GlassContainer from '$lib/components/GlassContainer.svelte';
	import { ts } from '$lib/i18n/index.svelte.js';
</script>

<svelte:head>
	<title>{ts('privacy.title')} — obraNativa</title>
</svelte:head>

<section class="section">
	<div class="container legal-page">
		<h1 class="page-title">{ts('privacy.title')}</h1>
		<p class="page-subtitle">{ts('privacy.subtitle')}</p>

		<div class="content">
			<GlassContainer>
				<h2>{ts('privacy.overview_title')}</h2>
				<p>{ts('privacy.overview_text')}</p>
			</GlassContainer>

			<GlassContainer>
				<h2>{ts('privacy.collection_title')}</h2>
				<p>{ts('privacy.collection_text')}</p>
			</GlassContainer>

			<GlassContainer>
				<h2>{ts('privacy.api_title')}</h2>
				<p>{ts('privacy.api_text')}</p>
			</GlassContainer>

			<GlassContainer>
				<h2>{ts('privacy.rights_title')}</h2>
				<p>{ts('privacy.rights_text')}</p>
			</GlassContainer>

			<GlassContainer>
				<h2>{ts('privacy.changes_title')}</h2>
				<p>{ts('privacy.changes_text')}</p>
			</GlassContainer>
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
</style>
