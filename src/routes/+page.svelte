<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let activePoster = $derived(data?.activePoster ?? null);
	let recentItems = $derived(data?.recentItems ?? []);
	let showPosterModal = $state(true);

	function formatDate(date: string | Date | null) {
		if (!date) return '—';
		return new Date(date).toLocaleDateString('en-IN', {
			day: '2-digit',
			month: 'short',
			year: 'numeric'
		});
	}

	onMount(() => {
		if (activePoster) {
			const timer = setTimeout(() => {
				showPosterModal = false;
			}, 5000);
			return () => clearTimeout(timer);
		}
	});
</script>

{#if activePoster && showPosterModal}
	<div
		role="presentation"
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
		onclick={() => (showPosterModal = false)}
		onkeydown={(e) => {
			if (e.key === 'Escape') showPosterModal = false;
		}}
	>
		<div
			role="dialog"
			aria-modal="true"
			aria-label={activePoster.title}
			tabindex="-1"
			class="relative w-full max-w-lg border border-amber-900/50 bg-stone-900 p-6 shadow-2xl"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
		>
			<button
				onclick={() => (showPosterModal = false)}
				class="absolute -top-3 -right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-stone-800 text-xs font-black text-white/70 shadow-lg transition-colors hover:bg-red-500 hover:text-white"
				aria-label="Close"
			>
				X
			</button>
			<img
				src={activePoster.posterImage}
				alt={activePoster.title}
				class="w-full rounded border border-amber-900/30 object-cover"
			/>
			<div class="mt-4">
				<h3 class="font-serif text-lg text-[#C5A059] uppercase italic">{activePoster.type}</h3>
				<h4 class="mt-1 text-base font-bold text-white">{activePoster.title}</h4>
				{#if activePoster.description}
					<p class="mt-2 text-xs leading-relaxed text-white/60">{activePoster.description}</p>
				{/if}
				{#if activePoster.expiresAt}
					<p class="mt-2 text-[10px] font-bold tracking-widest text-[#C5A059] uppercase">
						Expires: {formatDate(activePoster.expiresAt)}
					</p>
				{/if}
				<div class="mt-4 flex gap-3">
					<button
						onclick={() => (showPosterModal = false)}
						class="flex-1 border border-white/20 py-2.5 text-xs font-bold text-white/70 uppercase transition-all hover:bg-white/10"
					>
						Close
					</button>
					{#if activePoster.url}
						<a
							href={activePoster.url}
							target="_blank"
							class="block flex-1 bg-[#C5A059] py-2.5 text-center text-xs font-black text-black uppercase transition-all hover:bg-white"
						>
							Learn More
						</a>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}

<div
	class="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#070707] px-8 text-white md:flex-row md:px-12"
>
	<div class="z-30 mb-8 flex w-full justify-center md:mb-0 md:w-[40%]">
		<img
			src="/images/main-dancer.jpg"
			alt="Artistic Director"
			class="w-64 rounded-2xl border border-white/20 object-cover shadow-[0_10px_40px_rgba(197,160,89,0.15)] brightness-[0.88] contrast-[1.0] saturate-[0.9] md:w-80 lg:w-[420px]"
		/>
	</div>

	<div class="z-40 w-full text-center md:w-[50%] md:pl-16 md:text-left lg:pl-24">
		<h1
			class="mb-10 font-serif text-4xl leading-[1.1] tracking-[0.15em] text-[#C5A059] uppercase drop-shadow-[0_0_14px_rgba(197,160,89,0.4)] md:text-5xl lg:text-6xl"
		>
			Anvaya <br />
			<span class="text-white">Collectives</span>
		</h1>

		<div class="mb-14 font-serif">
			<p
				class="text-xs leading-loose font-bold tracking-[0.3em] text-white/95 uppercase md:text-sm"
			>
				Choreography <span class="mx-2 text-[#C5A059]">•</span>
				Bharatanatyam <span class="mx-2 text-[#C5A059]">•</span>
				Natya Sastra <span class="mx-2 text-[#C5A059]">•</span>
				Music <span class="mx-2 text-[#C5A059]">•</span>
				Storytelling
			</p>

			<p
				class="mt-10 max-w-sm text-xs leading-relaxed font-semibold tracking-[0.2em] text-white/75 uppercase italic md:text-[13px]"
			>
				Beyond the stage (Strength, cardio, and emotional elevation through the lens of tradition)
			</p>
		</div>

		<a
			href="/contact"
			class="inline-block border border-[#C5A059] bg-[#C5A059] px-10 py-4 text-[10px] font-black tracking-[0.4em] text-black uppercase shadow-[0_6px_24px_rgba(197,160,89,0.45)] transition-all duration-500 hover:bg-transparent hover:text-[#C5A059]"
		>
			Start Your Journey
		</a>
	</div>

	<div class="pointer-events-none absolute inset-0 z-10 overflow-hidden bg-[#070707] opacity-75">
		<img
			src="/images/background-hero.jpg"
			alt="Dancer Background"
			class="absolute top-0 right-0 h-full w-auto object-contain brightness-[0.9]"
			style="transform: translateX(-25%);"
		/>

		<div
			class="absolute inset-0"
			style="background: linear-gradient(to right, #070707 0%, #070707 30%, rgba(7,7,7,0.35) 55%, transparent 100%);"
		></div>
	</div>
</div>

{#if recentItems.length > 0}
	<div class="bg-[#0a0a0a] px-8 py-20 md:px-20">
		<div class="mx-auto max-w-6xl">
			<header class="mb-12 border-l-2 border-[#C5A059] pl-6">
				<h2 class="text-[10px] font-bold tracking-[0.5em] text-[#C5A059] uppercase">Highlights</h2>
				<h1
					class="mt-1 font-serif text-3xl font-bold tracking-tight text-white uppercase italic md:text-4xl"
				>
					Recent Activity
				</h1>
			</header>

			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each recentItems as item (item.id)}
					<div
						class="group flex flex-col border border-white/10 bg-white/[0.02] p-6 transition-all hover:border-[#C5A059]/40"
					>
						<div class="mb-2">
							<span
								class="inline-block border border-[#C5A059]/40 bg-[#C5A059]/10 px-2 py-0.5 text-[9px] font-black tracking-widest text-[#C5A059] uppercase"
							>
								{item.type}
							</span>
						</div>
						{#if item.url}
							<a href={item.url} target="_blank" rel="noopener noreferrer" class="no-underline">
								<h3
									class="text-base font-bold text-white transition-colors group-hover:text-[#C5A059]"
								>
									{item.title}
								</h3>
							</a>
						{:else}
							<h3
								class="text-base font-bold text-white transition-colors group-hover:text-[#C5A059]"
							>
								{item.title}
							</h3>
						{/if}
						{#if item.description}
							<p class="mt-2 line-clamp-2 text-sm leading-relaxed text-white/50">
								{item.description}
							</p>
						{/if}
						<div class="mt-auto flex items-center justify-between pt-4">
							<span class="text-[10px] font-bold tracking-widest text-white/30 uppercase">
								{formatDate(item.createdAt)}
							</span>
							{#if item.url}
								<a
									href={item.url}
									target="_blank"
									rel="noopener noreferrer"
									class="inline-flex items-center gap-1 rounded-sm border border-[#C5A059]/60 px-3 py-1 text-[10px] font-black tracking-widest text-[#C5A059] uppercase transition-all hover:bg-[#C5A059] hover:text-black"
								>
									{item.type === 'YouTube Video' ? 'Watch Video' : 'View Resource'}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="12"
										height="12"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									>
										<path d="M7 7h10v10" />
										<path d="M7 17 21 3" />
									</svg>
								</a>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
{/if}
