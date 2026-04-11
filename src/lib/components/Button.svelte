<script>
	let {
		variant = 'primary',
		size = 'md',
		href = undefined,
		disabled = false,
		children,
		...rest
	} = $props();
</script>

{#if href}
	<a {href} class="btn {variant} {size}" class:disabled {...rest}>
		{@render children()}
	</a>
{:else}
	<button class="btn {variant} {size}" {disabled} {...rest}>
		{@render children()}
	</button>
{/if}

<style>
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		font-weight: 600;
		border-radius: var(--radius-md);
		transition:
			transform var(--duration-fast) var(--ease-out),
			box-shadow var(--duration-fast) var(--ease-out),
			opacity var(--duration-fast);
		white-space: nowrap;
		text-decoration: none;
	}

	.btn:active:not(:disabled) {
		transform: scale(0.97);
	}

	.sm {
		padding: var(--space-1) var(--space-3);
		font-size: var(--text-sm);
	}
	.md {
		padding: var(--space-2) var(--space-5);
		font-size: var(--text-base);
	}
	.lg {
		padding: var(--space-3) var(--space-8);
		font-size: var(--text-lg);
	}

	.primary {
		background: linear-gradient(135deg, var(--accent-1), var(--accent-2));
		color: oklch(1 0 0);
		box-shadow: var(--shadow-md);
	}
	.primary:hover:not(:disabled) {
		box-shadow: var(--shadow-glow);
	}

	.secondary {
		background: var(--surface);
		border: 1px solid var(--border);
		color: var(--text);
	}
	.secondary:hover:not(:disabled) {
		border-color: var(--accent-1);
	}

	.ghost {
		background: transparent;
		color: var(--text-muted);
	}
	.ghost:hover:not(:disabled) {
		background: var(--bg-secondary);
		color: var(--text);
	}

	.danger {
		background: var(--danger);
		color: oklch(1 0 0);
	}

	.btn:disabled,
	.disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
