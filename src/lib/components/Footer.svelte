<script lang="ts">
	import { base } from '$app/paths';
	import { t } from '$lib/store/i18n.js';
</script>

<footer class="footer">
	<div class="container footer-inner">
		<div class="footer-brand">
			<span class="logo-text">obraNativa</span>
			<p class="footer-tagline">{$t.footer.tagline}</p>
		</div>

		<nav class="footer-nav">
			<div class="footer-col">
				<h4>{$t.footer.shop}</h4>
				<ul>
					<li><a href="{base}/products">{$t.footer.all_products}</a></li>
					<li><a href="{base}/categories">{$t.nav.categories}</a></li>
				</ul>
			</div>
			<div class="footer-col">
				<h4>{$t.footer.company}</h4>
				<ul>
					<li><a href="{base}/about">{$t.nav.about}</a></li>
					<li><a href="{base}/faq">FAQ</a></li>
					<li><a href="{base}/contacto">{$t.footer.contact}</a></li>
					<li><a href="{base}/impressum">{$t.footer.impressum}</a></li>
				</ul>
			</div>
		</nav>

		<div class="footer-bottom">
			<p>&copy; {new Date().getFullYear()} obraNativa. {$t.footer.rights}</p>
		</div>
	</div>
</footer>

<style>
	.footer {
		border-top: 1px solid var(--border);
		padding-block: var(--space-12) var(--space-8);
		margin-top: var(--space-16);
	}

	.footer-inner {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-8);
	}

	.logo-text {
		font-size: var(--text-xl);
		font-weight: 800;
		letter-spacing: -0.03em;
		background: linear-gradient(135deg, var(--accent-1), var(--accent-2));
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.footer-tagline {
		color: var(--text-muted);
		font-size: var(--text-sm);
		margin-top: var(--space-2);
	}

	.footer-nav {
		display: flex;
		gap: var(--space-12);
	}

	.footer-col h4 {
		font-size: var(--text-sm);
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--text-muted);
		margin-bottom: var(--space-3);
	}

	.footer-col ul {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.footer-col a {
		font-size: var(--text-sm);
		color: var(--text-muted);
		transition: color var(--duration-fast);
	}

	.footer-col a:hover {
		color: var(--text);
	}

	.footer-bottom {
		padding-top: var(--space-6);
		border-top: 1px solid var(--border);
	}

	.footer-bottom p {
		font-size: var(--text-xs);
		color: var(--text-muted);
	}

	@media (min-width: 768px) {
		.footer-inner {
			grid-template-columns: 1fr auto;
			grid-template-rows: auto auto;
		}

		.footer-bottom {
			grid-column: 1 / -1;
		}
	}
</style>
