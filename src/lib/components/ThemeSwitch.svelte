<script lang="ts">
	import { themeMode, themeColor, toggleThemeMode, setColorTheme, type ColorTheme } from '$lib/store/theme.js';
	import { ts } from '$lib/i18n/index.svelte.js';
	import Icon from './Icon.svelte';

	let colorOpen = $state(false);

	const colors: { id: ColorTheme; label: string; hue: string }[] = [
		{ id: 'default', label: 'Violet', hue: 'oklch(0.65 0.28 280)' },
		{ id: 'green', label: 'Emerald', hue: 'oklch(0.65 0.26 155)' },
		{ id: 'yellow', label: 'Solar', hue: 'oklch(0.78 0.18 85)' }
	];

	function pickColor(c: ColorTheme) {
		setColorTheme(c);
		colorOpen = false;
	}
</script>

<div class="theme-controls">
	<button
		onclick={toggleThemeMode}
		class="theme-btn"
		aria-label={$themeMode === 'dark' ? ts('theme.light') : ts('theme.dark')}
		title={$themeMode === 'dark' ? ts('theme.light') : ts('theme.dark')}
	>
		{#if $themeMode === 'dark'}
			<Icon name="sun" size={20} />
		{:else}
			<Icon name="moon" size={20} />
		{/if}
	</button>

	<div class="color-picker">
		<button
			class="theme-btn"
			onclick={() => (colorOpen = !colorOpen)}
			aria-label="Change color theme"
		>
			<span class="color-dot"></span>
		</button>
		{#if colorOpen}
			<div class="color-dropdown">
				{#each colors as c (c.id)}
					<button
						class="color-option"
						class:active={$themeColor === c.id}
						onclick={() => pickColor(c.id)}
					>
						<span class="swatch" style:background={c.hue}></span>
						{c.label}
					</button>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.theme-controls {
		display: flex;
		align-items: center;
		gap: var(--space-1);
	}

	.theme-btn {
		display: grid;
		place-items: center;
		width: 2.25rem;
		height: 2.25rem;
		border-radius: var(--radius-full);
		transition:
			background var(--duration-fast) var(--ease-out),
			transform var(--duration-fast) var(--ease-spring);
	}

	.theme-btn:hover {
		background: var(--bg-secondary);
		transform: rotate(15deg);
	}

	.color-dot {
		width: 14px;
		height: 14px;
		border-radius: var(--radius-full);
		background: linear-gradient(135deg, var(--accent-1), var(--accent-2));
		border: 2px solid var(--border);
	}

	.color-picker {
		position: relative;
	}

	.color-dropdown {
		position: absolute;
		top: calc(100% + var(--space-2));
		right: 0;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		padding: var(--space-2);
		box-shadow: var(--shadow-lg);
		z-index: 50;
		min-width: 140px;
	}

	.color-option {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		width: 100%;
		padding: var(--space-2) var(--space-3);
		border-radius: var(--radius-sm);
		font-size: var(--text-sm);
		font-weight: 500;
		transition: background var(--duration-fast);
	}

	.color-option:hover {
		background: var(--bg-secondary);
	}

	.color-option.active {
		color: var(--accent-1);
		font-weight: 700;
	}

	.swatch {
		width: 12px;
		height: 12px;
		border-radius: var(--radius-full);
		flex-shrink: 0;
	}
</style>
