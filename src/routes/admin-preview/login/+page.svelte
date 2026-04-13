<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Button from '$lib/components/Button.svelte';
	import GlassContainer from '$lib/components/GlassContainer.svelte';
	import { login, isAuthenticated } from '$lib/services/auth.js';

	let user = $state('');
	let password = $state('');
	let error = $state('');
	let submitting = $state(false);
	let showPassword = $state(false);

	onMount(() => {
		if (isAuthenticated()) {
			goto(`${base}/admin-preview`);
		}
	});

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!user.trim() || !password.trim()) {
			error = 'Both fields are required.';
			return;
		}

		submitting = true;
		error = '';

		const ok = await login(user.trim(), password.trim());
		submitting = false;

		if (ok) {
			goto(`${base}/admin-preview`);
		} else {
			error = 'Invalid credentials.';
			password = '';
		}
	}
</script>

<svelte:head>
	<title>Admin Login — LokalShop</title>
</svelte:head>

<section class="section">
	<div class="container login-page">
		<GlassContainer>
			<div class="login-header">
				<div class="lock-icon">
					<Icon name="lock" size={32} />
				</div>
				<h1>Admin Preview</h1>
				<p>Enter your credentials to continue</p>
			</div>

			<form onsubmit={handleSubmit} class="login-form">
				<div class="field">
					<label for="user">User</label>
					<div class="input-wrap">
						<Icon name="user" size={16} />
						<input
							id="user"
							type="text"
							bind:value={user}
							autocomplete="username"
							placeholder="Username"
						/>
					</div>
				</div>

				<div class="field">
					<label for="password">Access Code</label>
					<div class="input-wrap">
						<Icon name="lock" size={16} />
						<input
							id="password"
							type={showPassword ? 'text' : 'password'}
							bind:value={password}
							autocomplete="current-password"
							placeholder="••••••••"
						/>
						<button
							type="button"
							class="toggle-pw"
							onclick={() => (showPassword = !showPassword)}
							aria-label={showPassword ? 'Hide password' : 'Show password'}
						>
							<Icon name={showPassword ? 'eye-off' : 'eye'} size={16} />
						</button>
					</div>
				</div>

				{#if error}
					<p class="error-msg">{error}</p>
				{/if}

				<Button variant="primary" size="lg" disabled={submitting}>
					{#if submitting}
						Verifying…
					{:else}
						<Icon name="shield" size={18} />
						Sign In
					{/if}
				</Button>
			</form>
		</GlassContainer>
	</div>
</section>

<style>
	.login-page {
		max-width: 420px;
		min-height: 60vh;
		display: flex;
		align-items: center;
	}

	.login-header {
		text-align: center;
		margin-bottom: var(--space-8);
	}

	.lock-icon {
		width: 64px;
		height: 64px;
		margin-inline: auto;
		margin-bottom: var(--space-4);
		display: grid;
		place-items: center;
		border-radius: var(--radius-full);
		background: linear-gradient(135deg, var(--accent-1), var(--accent-2));
		color: oklch(1 0 0);
	}

	.login-header h1 {
		font-size: var(--text-2xl);
		font-weight: 800;
	}

	.login-header p {
		color: var(--text-muted);
		margin-top: var(--space-2);
		font-size: var(--text-sm);
	}

	.login-form {
		display: flex;
		flex-direction: column;
		gap: var(--space-5);
	}

	.field label {
		display: block;
		font-size: var(--text-sm);
		font-weight: 600;
		margin-bottom: var(--space-2);
	}

	.input-wrap {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		padding: var(--space-3) var(--space-4);
		transition: border-color var(--duration-fast);
	}

	.input-wrap:focus-within {
		border-color: var(--accent-1);
	}

	.input-wrap input {
		flex: 1;
		background: transparent;
		border: none;
		outline: none;
		font-size: var(--text-base);
		color: var(--text);
		min-width: 0;
	}

	.input-wrap input::placeholder {
		color: var(--text-muted);
		opacity: 0.6;
	}

	.toggle-pw {
		display: grid;
		place-items: center;
		color: var(--text-muted);
		cursor: pointer;
		flex-shrink: 0;
	}

	.toggle-pw:hover {
		color: var(--text);
	}

	.error-msg {
		color: var(--danger);
		font-size: var(--text-sm);
		font-weight: 600;
		text-align: center;
	}

	.login-form :global(.btn) {
		width: 100%;
	}
</style>
