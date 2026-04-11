<script>
	import GlassContainer from '$lib/components/GlassContainer.svelte';
</script>

<svelte:head>
	<title>Impressum — obraNativa</title>
</svelte:head>

<section class="section">
	<div class="container legal-page">
		<h1 class="page-title">Impressum</h1>
		<p class="page-subtitle">Legal information according to § 5 TMG</p>

		<div class="content">
			<GlassContainer>
				<h2>Company Information</h2>
				<p><strong>obraNativa</strong></p>
				<p>Demo E-Commerce Application</p>
				<p>Musterstraße 1<br />12345 Musterstadt<br />Germany</p>
			</GlassContainer>

			<GlassContainer>
				<h2>Contact</h2>
				<p>Email: info@obranativa.example.com</p>
				<p>Phone: +49 (0) 123 456 789</p>
			</GlassContainer>

			<GlassContainer>
				<h2>Disclaimer</h2>
				<p>
					This is a demo application built for educational and portfolio purposes.
					No real commercial transactions are processed. Product data is provided by the
					Platzi Fake Store API and does not represent real products or offerings.
				</p>
				<p>
					All trademarks and brand names mentioned belong to their respective owners.
				</p>
			</GlassContainer>

			<GlassContainer>
				<h2>Privacy</h2>
				<p>
					This application stores data exclusively in your browser using IndexedDB.
					No personal data is collected, transmitted, or stored on any server.
					API requests are made to the Platzi Fake Store API for product data only.
				</p>
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
</style>
