<script lang="ts">
	import GlassContainer from '$lib/components/GlassContainer.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { ts, t } from '$lib/i18n/index.svelte.js';

	let openIndex = $state(-1);

	function toggle(i: number) {
		openIndex = openIndex === i ? -1 : i;
	}

	let faqs = $derived(t('faq.items') as { q: string; a: string }[]);
</script>

<svelte:head>
	<title>{ts('faq.title')} — obraNativa</title>
</svelte:head>

<section class="section">
	<div class="container legal-page">
		<h1 class="page-title">{ts('faq.title')}</h1>
		<p class="page-subtitle">{ts('faq.subtitle')}</p>

		<div class="faq-list">
			{#each faqs as faq, i (i)}
				<div class="faq-item" class:open={openIndex === i}>
					<button class="faq-question" onclick={() => toggle(i)}>
						<span>{faq.q}</span>
						<span class="faq-chevron">
							<Icon name="chevron-right" size={18} />
						</span>
					</button>
					{#if openIndex === i}
						<div class="faq-answer">
							<p>{faq.a}</p>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.legal-page {
		max-width: 800px;
	}

	.faq-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		margin-top: var(--space-8);
	}

	.faq-item {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		overflow: hidden;
		transition: box-shadow var(--duration-normal);
	}

	.faq-item.open {
		box-shadow: var(--shadow-md);
	}

	.faq-question {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: var(--space-5) var(--space-6);
		font-weight: 600;
		font-size: var(--text-base);
		text-align: left;
		transition: color var(--duration-fast);
	}

	.faq-question:hover {
		color: var(--accent-1);
	}

	.faq-chevron {
		transition: transform var(--duration-normal) var(--ease-out);
		flex-shrink: 0;
	}

	.open .faq-chevron {
		transform: rotate(90deg);
	}

	.faq-answer {
		padding: 0 var(--space-6) var(--space-5);
	}

	.faq-answer p {
		color: var(--text-muted);
		line-height: 1.7;
	}
</style>
