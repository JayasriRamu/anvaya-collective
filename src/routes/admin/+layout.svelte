<script lang="ts">
	import { page } from '$app/state';
	import { createAuthClient } from 'better-auth/svelte';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	const authClient = createAuthClient();

	const tabs = [
		{
			href: '/admin',
			label: 'Content Creation',
			paths: [
				'M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z',
				'M14 2v6h6',
				'M12 18v-6M9 15h6'
			]
		},
		{
			href: '/admin/inquiries',
			label: 'Inquiries',
			paths: [
				'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2',
				'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm10 10v-2a4 4 0 0 0-3-3.87',
				'M16 3.13a4 4 0 0 1 0 7.75'
			]
		}
	];

	let pathname = $derived(page.url.pathname);

	function isActive(href: string) {
		if (href === '/admin') return pathname === '/admin' || pathname === '/admin/';
		return pathname.startsWith(href);
	}

	const isLoginPage = $derived(pathname.startsWith('/admin/login'));

	async function handleSignOut() {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					window.location.href = '/admin/login';
				}
			}
		});
	}
</script>

<div
	class="min-h-screen bg-[#0b0a08] font-sans text-white selection:bg-[#C5A059] selection:text-black"
>
	{#if !isLoginPage}
		<header
			class="sticky top-0 z-[100] border-b border-[#C5A059]/25 bg-[#131110]/95 shadow-[0_4px_24px_rgba(0,0,0,0.6)] backdrop-blur-md"
		>
			<div
				class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 py-4"
			>
				<div class="flex items-center gap-4">
					<img src="/images/logo.png" alt="Anvaya" class="h-9 w-auto object-contain" />
					<div
						class="h-6 w-px bg-gradient-to-b from-transparent via-[#C5A059]/70 to-transparent"
					></div>
					<div>
						<h1
							class="font-serif text-base tracking-[0.2em] text-[#C5A059] uppercase italic drop-shadow-[0_0_10px_rgba(197,160,89,0.4)]"
						>
							Admin Panel
						</h1>
						{#if data.user}
							<p class="mt-0.5 text-[9px] font-bold tracking-[0.25em] text-white/50 uppercase">
								{data.user.email}
							</p>
						{/if}
					</div>
				</div>

				<nav class="flex items-center gap-2" aria-label="Admin sections">
					{#each tabs as tab (tab.href)}
						<a
							href={tab.href}
							aria-current={isActive(tab.href) ? 'page' : undefined}
							class="group inline-flex items-center gap-2 rounded-md border px-5 py-2.5 text-[11px] font-black tracking-[0.18em] uppercase transition-all duration-200 {isActive(
								tab.href
							)
								? 'border-[#C5A059] bg-gradient-to-b from-[#E0BC71] to-[#C5A059] text-black shadow-[0_0_16px_rgba(197,160,89,0.45)]'
								: 'border-white/20 bg-white/[0.06] text-white/75 hover:-translate-y-px hover:border-[#C5A059]/70 hover:text-[#C5A059] hover:shadow-[0_0_14px_rgba(197,160,89,0.2)]'}"
						>
							<svg
								class="h-4 w-4 {isActive(tab.href) ? '' : 'text-[#C5A059]'}"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								stroke-width="2.2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								{#each tab.paths as d (d)}
									<path {d} />
								{/each}
							</svg>
							{tab.label}
						</a>
					{/each}
				</nav>

				<div class="flex items-center gap-3">
					<a
						href="/"
						class="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/[0.06] px-4 py-2.5 text-[10px] font-black tracking-[0.2em] text-white/75 uppercase transition-all hover:border-[#C5A059]/70 hover:text-[#C5A059]"
					>
						<svg
							class="h-3.5 w-3.5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							stroke-width="2.2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
							<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
						</svg>
						View Site
					</a>
					<button
						onclick={handleSignOut}
						class="inline-flex items-center gap-2 rounded-md border border-[#C5A059]/80 bg-gradient-to-b from-[#E0BC71] to-[#C5A059] px-6 py-2.5 text-[11px] font-black tracking-[0.12em] text-black uppercase shadow-[0_4px_16px_rgba(197,160,89,0.45)] transition-all hover:from-[#EED08B] hover:to-[#D4B062] hover:shadow-[0_6px_24px_rgba(197,160,89,0.7)] active:scale-95"
					>
						<svg
							class="h-4 w-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							stroke-width="2.2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
							<path d="m16 17 5-5-5-5" />
							<path d="M21 12H9" />
						</svg>
						Sign Out
					</button>
				</div>
			</div>
		</header>
	{/if}

	{@render children()}
</div>

<style>
	:global(.font-serif) {
		font-family: 'Cinzel', serif;
	}
</style>
