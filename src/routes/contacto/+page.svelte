<script lang="ts">
	import { base } from '$app/paths';
	import GlassContainer from '$lib/components/GlassContainer.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { t } from '$lib/store/i18n.js';
	import { onMount } from 'svelte';

	let formContainer = $state<HTMLDivElement | null>(null);

	onMount(() => {
		const script = document.createElement('script');
		script.src = 'https://cdn.gomelibo.com/v1/form.js';
		script.async = true;
		script.onload = () => {
			if (formContainer) {
				const el = document.createElement('melibo-contact');
				el.setAttribute('channel-key', 'c297cf07-73ef-4aa0-8ceb-344462a03bd1');
				el.setAttribute('language', 'de');
				formContainer.appendChild(el);
			}
		};
		document.head.appendChild(script);

		return () => {
			script.remove();
		};
	});
</script>

<svelte:head>
	<title>{$t.contact.title} — obraNativa</title>
</svelte:head>

<section class="section">
	<div class="container contact-page">
		<h1 class="page-title">{$t.contact.title}</h1>
		<p class="page-subtitle">{$t.contact.subtitle}</p>

		<div class="contact-grid">
			<GlassContainer>
				<div class="contact-info">
					<div class="info-item">
						<Icon name="mail" size={24} />
						<div>
							<h3>{$t.contact.email}</h3>
							<p>info@obranativa.example.com</p>
						</div>
					</div>
					<div class="info-item">
						<Icon name="message-circle" size={24} />
						<div>
							<h3>{$t.contact.live_chat}</h3>
							<p>{$t.contact.live_chat_desc}</p>
						</div>
					</div>
					<div class="info-item">
						<Icon name="help-circle" size={24} />
						<div>
							<h3>{$t.contact.faq}</h3>
							<p>{$t.contact.faq_desc} <a href="{base}/faq">FAQ</a></p>
						</div>
					</div>
				</div>
			</GlassContainer>

			<GlassContainer>
				<h2 class="form-title">{$t.contact.send_message}</h2>
				<div bind:this={formContainer} class="melibo-form-wrap">
					<div class="form-placeholder">
						<Icon name="mail" size={32} />
						<p>{$t.contact.loading_form}</p>
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
