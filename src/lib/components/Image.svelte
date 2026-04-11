<script>
	let { src, alt, aspect = '4/3', ...rest } = $props();
	let loaded = $state(false);
	let error = $state(false);
</script>

<div class="image-wrap" style:aspect-ratio={aspect}>
	{#if !loaded && !error}
		<div class="skeleton-layer"></div>
	{/if}
	{#if error}
		<div class="fallback">
			<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
				<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
				<circle cx="8.5" cy="8.5" r="1.5"/>
				<polyline points="21 15 16 10 5 21"/>
			</svg>
		</div>
	{:else}
		<img
			{src}
			{alt}
			loading="lazy"
			decoding="async"
			class:visible={loaded}
			onload={() => (loaded = true)}
			onerror={() => (error = true)}
			{...rest}
		/>
	{/if}
</div>

<style>
	.image-wrap {
		position: relative;
		overflow: hidden;
		border-radius: var(--radius-md);
		background: var(--bg-secondary);
	}

	.skeleton-layer {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			110deg,
			var(--bg-secondary) 0%,
			var(--bg-secondary) 40%,
			oklch(0.85 0.06 280 / 0.3) 50%,
			var(--bg-secondary) 60%,
			var(--bg-secondary) 100%
		);
		background-size: 200% 100%;
		animation: shimmer 1.5s ease-in-out infinite;
	}

	:global(.dark) .skeleton-layer {
		background: linear-gradient(
			110deg,
			var(--bg-secondary) 0%,
			var(--bg-secondary) 40%,
			oklch(0.4 0.06 280 / 0.3) 50%,
			var(--bg-secondary) 60%,
			var(--bg-secondary) 100%
		);
		background-size: 200% 100%;
	}

	@keyframes shimmer {
		0% { background-position: 200% 0; }
		100% { background-position: -200% 0; }
	}

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		opacity: 0;
		transition: opacity var(--duration-normal) var(--ease-out);
	}

	img.visible {
		opacity: 1;
	}

	.fallback {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		color: var(--text-muted);
	}
</style>
