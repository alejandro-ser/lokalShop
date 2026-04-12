<script lang="ts">
	import '$lib/styles/app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { cart } from '$lib/store/cart.js';
	import { themeMode } from '$lib/store/theme.js';
	import { ts } from '$lib/i18n/index.svelte.js';
	import { onMount } from 'svelte';
	import { PUBLIC_MELIBO_WIDGET_KEY } from '$env/static/public';

	let { children } = $props();

	onMount(() => {
		cart.init();

		if (PUBLIC_MELIBO_WIDGET_KEY) {
			const script = document.createElement('script');
			script.src = 'https://cdn.gomelibo.com/v2/widget.js';
			script.defer = true;
			script.onload = () => {
				const widget = document.createElement('melibo-widget');
				widget.setAttribute('key', PUBLIC_MELIBO_WIDGET_KEY);
				document.body.appendChild(widget);
			};
			document.body.appendChild(script);
			return () => {
				script.remove();
				document.querySelector('melibo-widget')?.remove();
			};
		}
	});
</script>

<svelte:head>
	<link rel="preconnect" href="https://api.escuelajs.co" />
	<meta name="description" content={ts('seo.default_description')} />
	<title>{ts('seo.default_title')}</title>
</svelte:head>

<div class="aurora-bg"></div>

<Navbar />

<main class="main">
	{@render children()}
</main>

<Footer />

<style>
	.main {
		min-height: calc(100dvh - var(--nav-height));
	}
</style>
