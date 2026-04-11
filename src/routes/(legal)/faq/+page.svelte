<script lang="ts">
	import GlassContainer from '$lib/components/GlassContainer.svelte';
	import Icon from '$lib/components/Icon.svelte';

	const faqs: { q: string; a: string }[] = [
		{
			q: 'What is obraNativa?',
			a: 'obraNativa is a curated e-commerce platform showcasing unique products from around the world. We focus on quality, craftsmanship, and fair pricing.'
		},
		{
			q: 'How does the cart work offline?',
			a: 'Your cart is stored in IndexedDB, a browser-native database. This means your selections persist across page reloads and even offline sessions.'
		},
		{
			q: 'What payment methods are supported?',
			a: 'This is a demo application. No real transactions are processed. In a production environment, we would integrate with Stripe, PayPal, or similar providers.'
		},
		{
			q: 'Is my data stored securely?',
			a: 'All data is stored locally in your browser. We do not collect or transmit any personal information. The API data comes from the Platzi Fake Store API.'
		},
		{
			q: 'How do I contact support?',
			a: 'You can reach us through the chatbot widget in the bottom-right corner, or visit our Contact page for a direct form.'
		},
		{
			q: 'What technologies power this site?',
			a: 'SvelteKit with adapter-static for deployment, modern CSS with OKLCH colors and glassmorphism, IndexedDB for offline persistence, and zero external CSS frameworks.'
		}
	];

	let openIndex = $state(-1);

	function toggle(i: number) {
		openIndex = openIndex === i ? -1 : i;
	}
</script>

<svelte:head>
	<title>FAQ — obraNativa</title>
</svelte:head>

<section class="section">
	<div class="container legal-page">
		<h1 class="page-title">Frequently Asked Questions</h1>
		<p class="page-subtitle">Everything you need to know</p>

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
