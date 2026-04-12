<script lang="ts">
	import '$lib/styles/app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { cart } from '$lib/store/cart.js';
	import { themeMode } from '$lib/store/theme.js';
	import { ts } from '$lib/i18n/index.svelte.js';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		cart.init();
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
