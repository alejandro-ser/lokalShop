<script lang="ts">
	let { content, tag = 'p' }: { content: string; tag?: string } = $props();
</script>

<svelte:element this={tag} class="rt">{@html content}</svelte:element>

<style>
	.rt {
		white-space: pre-line;
		line-height: 1.8;
		color: var(--text-muted);
	}

	.rt :global(a) {
		color: var(--accent-1);
		text-decoration: underline;
	}

	.rt :global(strong) {
		color: var(--text);
		font-weight: 700;
	}
</style>
