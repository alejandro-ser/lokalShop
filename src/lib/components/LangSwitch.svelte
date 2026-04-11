<script lang="ts">
	import { locale, setLocale, locales, type Locale } from '$lib/store/i18n.js';
	import Icon from './Icon.svelte';

	let open = $state(false);

	const labels: Record<Locale, string> = {
		en: 'EN',
		de: 'DE',
		es: 'ES'
	};

	function pick(l: Locale) {
		setLocale(l);
		open = false;
	}
</script>

<svelte:window onclick={() => (open = false)} />

<div class="lang-wrap">
	<button
		class="lang-btn"
		onclick={(e) => { e.stopPropagation(); open = !open; }}
		aria-label="Change language"
	>
		<span class="lang-code">{labels[$locale]}</span>
	</button>
	{#if open}
		<div class="lang-dropdown" role="listbox" tabindex="-1" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.key === 'Escape' && (open = false)}>
			{#each locales as l (l)}
				<button
					class="lang-option"
					class:active={$locale === l}
					onclick={() => pick(l)}
				>
					{labels[l]}
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.lang-wrap {
		position: relative;
	}

	.lang-btn {
		display: grid;
		place-items: center;
		height: 2.25rem;
		padding-inline: var(--space-2);
		border-radius: var(--radius-md);
		transition: background var(--duration-fast);
	}

	.lang-btn:hover {
		background: var(--bg-secondary);
	}

	.lang-code {
		font-size: var(--text-xs);
		font-weight: 700;
		letter-spacing: 0.05em;
	}

	.lang-dropdown {
		position: absolute;
		top: calc(100% + var(--space-2));
		right: 0;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		padding: var(--space-1);
		box-shadow: var(--shadow-lg);
		z-index: 50;
		min-width: 64px;
	}

	.lang-option {
		display: block;
		width: 100%;
		padding: var(--space-2) var(--space-3);
		border-radius: var(--radius-sm);
		font-size: var(--text-sm);
		font-weight: 600;
		text-align: center;
		transition: background var(--duration-fast);
	}

	.lang-option:hover {
		background: var(--bg-secondary);
	}

	.lang-option.active {
		color: var(--accent-1);
	}
</style>
