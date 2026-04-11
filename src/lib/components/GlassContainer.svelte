<script>
	let { tag = 'div', children, ...rest } = $props();
</script>

<svelte:element this={tag} class="glass-container" {...rest}>
	{@render children()}
</svelte:element>

<style>
	.glass-container {
		background: var(--glass-bg);
		backdrop-filter: blur(var(--glass-blur));
		-webkit-backdrop-filter: blur(var(--glass-blur));
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-lg);
		padding: var(--space-6);
	}
</style>
