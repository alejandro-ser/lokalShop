<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import Icon from './Icon.svelte';
	import ThemeSwitch from './ThemeSwitch.svelte';
	import LangSwitch from './LangSwitch.svelte';
	import { cart } from '$lib/store/cart.js';
	import { ts } from '$lib/i18n/index.svelte.js';

	let menuOpen = $state(false);
	let cartCount = $derived($cart.reduce((sum, i) => sum + i.qty, 0));

	let links = $derived([
		{ href: `${base}/`, label: ts('nav.home'), icon: 'home' },
		{ href: `${base}/categories`, label: ts('nav.categories'), icon: 'grid' },
		{ href: `${base}/products`, label: ts('nav.products'), icon: 'tag' },
		{ href: `${base}/about`, label: ts('nav.about'), icon: 'info' }
	]);

	function closeMenu() {
		menuOpen = false;
	}
</script>

<svelte:window onkeydown={(e) => e.key === 'Escape' && closeMenu()} />

<header class="navbar glass">
	<nav class="nav-inner container">
		<a href="{base}/" class="logo" onclick={closeMenu}>
			<span class="logo-text">obraNativa</span>
		</a>

		<ul class="nav-links" class:open={menuOpen}>
			{#each links as link (link.href)}
				<li>
					<a
						href={link.href}
						class="nav-link"
						class:active={page.url.pathname === link.href ||
							(page.url.pathname.startsWith(link.href) && link.href !== `${base}/`)}
						onclick={closeMenu}
					>
						{link.label}
					</a>
				</li>
			{/each}
		</ul>

		<div class="nav-actions">
			<LangSwitch />
			<ThemeSwitch />

			<a href="{base}/cart" class="cart-btn" aria-label="{ts('nav.cart')} ({cartCount})">
				<Icon name="shopping-cart" size={22} />
				{#if cartCount > 0}
					<span class="cart-badge">{cartCount}</span>
				{/if}
			</a>

			<a href="{base}/profile" class="profile-btn" aria-label={ts('nav.profile')}>
				<Icon name="user" size={22} />
			</a>

			<button class="menu-toggle" onclick={() => (menuOpen = !menuOpen)} aria-label="Toggle menu">
				<Icon name={menuOpen ? 'x' : 'menu'} size={24} />
			</button>
		</div>
	</nav>
</header>

{#if menuOpen}
	<div class="overlay" onclick={closeMenu} role="presentation"></div>
{/if}

<style>
	.navbar {
		position: sticky;
		top: 0;
		z-index: 100;
		height: var(--nav-height);
	}

	.nav-inner {
		display: flex;
		align-items: center;
		height: 100%;
		gap: var(--space-8);
	}

	.logo {
		flex-shrink: 0;
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

	.nav-links {
		display: flex;
		gap: var(--space-1);
		flex: 1;
	}

	.nav-link {
		display: block;
		padding: var(--space-2) var(--space-3);
		font-size: var(--text-sm);
		font-weight: 500;
		color: var(--text-muted);
		border-radius: var(--radius-md);
		transition:
			color var(--duration-fast),
			background var(--duration-fast);
	}

	.nav-link:hover,
	.nav-link.active {
		color: var(--text);
		background: var(--bg-secondary);
	}

	.nav-link.active {
		color: var(--accent-1);
	}

	.nav-actions {
		display: flex;
		align-items: center;
		gap: var(--space-1);
	}

	.cart-btn,
	.profile-btn {
		position: relative;
		display: grid;
		place-items: center;
		width: 2.25rem;
		height: 2.25rem;
		border-radius: var(--radius-full);
		transition: background var(--duration-fast);
	}

	.cart-btn:hover,
	.profile-btn:hover {
		background: var(--bg-secondary);
	}

	.cart-badge {
		position: absolute;
		top: 2px;
		right: 2px;
		min-width: 18px;
		height: 18px;
		display: grid;
		place-items: center;
		padding-inline: 4px;
		font-size: 0.65rem;
		font-weight: 700;
		color: oklch(1 0 0);
		background: linear-gradient(135deg, var(--accent-1), var(--accent-3));
		border-radius: var(--radius-full);
		line-height: 1;
	}

	.menu-toggle {
		display: none;
		width: 2.5rem;
		height: 2.5rem;
		place-items: center;
		border-radius: var(--radius-md);
	}

	.overlay {
		display: none;
	}

	@media (max-width: 768px) {
		.nav-links {
			position: fixed;
			top: var(--nav-height);
			left: 0;
			right: 0;
			bottom: 0;
			flex-direction: column;
			background: var(--bg);
			padding: var(--space-4);
			gap: var(--space-1);
			transform: translateX(-100%);
			transition: transform var(--duration-normal) var(--ease-out);
			z-index: 99;
		}

		.nav-links.open {
			transform: translateX(0);
		}

		.nav-link {
			font-size: var(--text-lg);
			padding: var(--space-3) var(--space-4);
		}

		.menu-toggle {
			display: grid;
		}

		.overlay {
			display: block;
			position: fixed;
			inset: 0;
			z-index: 98;
			background: oklch(0 0 0 / 0.3);
		}

		.profile-btn {
			display: none;
		}
	}
</style>
