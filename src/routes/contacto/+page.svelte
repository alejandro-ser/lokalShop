<script lang="ts">
	import { base } from '$app/paths';
	import GlassContainer from '$lib/components/GlassContainer.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { ts, locale } from '$lib/i18n/index.svelte.js';
	import { onMount } from 'svelte';
	import { PUBLIC_MELIBO_CONTACT_KEY } from '$env/static/public';

	let formContainer = $state<HTMLDivElement | null>(null);

	function insertForm() {
		if (!formContainer || !PUBLIC_MELIBO_CONTACT_KEY) return;
		formContainer.innerHTML = '';
		const el = document.createElement('melibo-contact');
		el.setAttribute('channel-key', PUBLIC_MELIBO_CONTACT_KEY);
		el.setAttribute('language', locale());
		formContainer.appendChild(el);
	}

	onMount(() => {
		if (!PUBLIC_MELIBO_CONTACT_KEY) return;

		const scriptAlready = document.querySelector<HTMLScriptElement>(
			'script[src*="gomelibo.com/v1/form.js"]'
		);

		if (scriptAlready) {
			requestAnimationFrame(insertForm);
		} else {
			const script = document.createElement('script');
			script.src = 'https://cdn.gomelibo.com/v1/form.js';
			script.async = true;
			script.onload = () => requestAnimationFrame(insertForm);
			document.head.appendChild(script);
		}

		return () => {
			if (formContainer) formContainer.innerHTML = '';
		};
	});
</script>

<svelte:head>
	<title>{ts('contact.title')} — LokalShop</title>
</svelte:head>

<section class="section">
	<div class="container contact-page">
		<h1 class="page-title">{ts('contact.title')}</h1>
		<p class="page-subtitle">{ts('contact.subtitle')}</p>

		<div class="contact-grid">
			<GlassContainer>
				<div class="contact-info">
					<div class="info-item">
						<Icon name="mail" size={24} />
						<div>
							<h3>{ts('contact.email')}</h3>
							<p>info@lokalshop.example.com</p>
						</div>
					</div>
					<div class="info-item">
						<Icon name="message-circle" size={24} />
						<div>
							<h3>{ts('contact.live_chat')}</h3>
							<p>{ts('contact.live_chat_desc')}</p>
						</div>
					</div>
					<div class="info-item">
						<Icon name="help-circle" size={24} />
						<div>
							<h3>{ts('nav.faq')}</h3>
							<p>{ts('contact.faq_link')} <a href="{base}/faq">FAQ</a></p>
						</div>
					</div>
				</div>
			</GlassContainer>

			<GlassContainer>
				<h2 class="form-title">{ts('contact.send_message')}</h2>
				<div bind:this={formContainer} class="melibo-form-wrap">
					<div class="form-placeholder">
						<Icon name="mail" size={32} />
						<p>{ts('contact.loading_form')}</p>
					</div>
				</div>
			</GlassContainer>
		</div>
	</div>
</section>

<style>
	.contact-page {
		max-width: 960px;
	}

	.contact-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-6);
		margin-top: var(--space-8);
	}

	@media (min-width: 768px) {
		.contact-grid {
			grid-template-columns: 1fr 1fr;
			align-items: start;
		}
	}

	.contact-info {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
	}

	.info-item {
		display: flex;
		gap: var(--space-4);
		align-items: flex-start;
	}

	.info-item :global(svg) {
		color: var(--accent-1);
		flex-shrink: 0;
		margin-top: 2px;
	}

	.info-item h3 {
		font-size: var(--text-base);
		font-weight: 700;
		margin-bottom: var(--space-1);
	}

	.info-item p {
		font-size: var(--text-sm);
		color: var(--text-muted);
		line-height: 1.6;
	}

	.info-item a {
		color: var(--accent-1);
		text-decoration: underline;
	}

	.form-title {
		font-size: var(--text-lg);
		font-weight: 700;
		margin-bottom: var(--space-4);
	}

	.melibo-form-wrap {
		min-height: 300px;
	}

	.form-placeholder {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--space-3);
		padding: var(--space-10);
		color: var(--text-muted);
		text-align: center;
	}
</style>
