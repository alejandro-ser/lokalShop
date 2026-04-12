<script lang="ts">
	import GlassContainer from '$lib/components/GlassContainer.svelte';
	import { ts } from '$lib/i18n/index.svelte.js';
</script>

<svelte:head>
	<title>{ts('impressum.title')} — obraNativa</title>
</svelte:head>

<section class="section">
	<div class="container legal-page">
		<h1 class="page-title">{ts('impressum.title')}</h1>
		<p class="page-subtitle">{ts('impressum.subtitle')}</p>

		<div class="content">
			<GlassContainer>
				<h2>{ts('impressum.company_title')}</h2>
				<p><strong>{ts('impressum.company_name')}</strong></p>
				<p>{ts('impressum.company_desc')}</p>
				<p class="address">{ts('impressum.company_address')}</p>
			</GlassContainer>

			<GlassContainer>
				<h2>{ts('impressum.contact_title')}</h2>
				<p>{ts('impressum.contact_email')}</p>
				<p>{ts('impressum.contact_phone')}</p>
			</GlassContainer>

			<GlassContainer>
				<h2>{ts('impressum.disclaimer_title')}</h2>
				<p>{ts('impressum.disclaimer_p1')}</p>
				<p>{ts('impressum.disclaimer_p2')}</p>
			</GlassContainer>

			<GlassContainer>
				<h2>{ts('impressum.liability_title')}</h2>
				<p>{ts('impressum.liability_text')}</p>
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

	.content p + p {
		margin-top: var(--space-2);
	}

	.address {
		white-space: pre-line;
	}
</style>
