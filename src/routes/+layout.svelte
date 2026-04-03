<script lang="ts">
	import './layout.css';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: any } = $props();
	let isMenuOpen = $state(false);

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	// NEW: Check if we are on an admin page to hide the main nav/footer
	let isAdminPage = $derived(page.url.pathname.startsWith('/admin'));

	onMount(() => {
		const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
		if (navEntries.length > 0 && navEntries[0].type === 'reload') {
			console.log('Syncing stats on reload...');
		}
	});
</script>

<div class="relative flex min-h-screen flex-col overflow-x-hidden bg-[#070707] text-white">
	{#if !isAdminPage}
		<nav
			class="fixed top-0 z-[100] flex w-full items-center justify-between border-b border-white/5 bg-[#070707]/90 px-8 py-6 backdrop-blur-md md:px-20 md:py-8"
		>
			<a href="/" class="group flex items-center gap-3">
				<img src="/images/logo.png" alt="Logo" class="h-8 w-auto object-contain md:h-14" />
				<div
					class="font-serif text-[13px] tracking-[0.1em] whitespace-nowrap text-[#C5A059] uppercase md:text-xl md:tracking-[0.2em]"
				>
					Anvaya Collectives
				</div>
			</a>

			<div class="flex items-center gap-4">
				{#if data.stats && data.stats.views > 0}
					<div class="flex flex-col items-end pr-2 text-right md:hidden">
						<span class="text-[8px] leading-none font-bold text-[#C5A059] uppercase">Visit</span>
						<span class="text-[10px] font-black text-white uppercase">#{data.stats.views + 1}</span>
					</div>

					<div class="hidden flex-col items-end border-r border-white/10 pr-8 text-right md:flex">
						<span class="text-[9px] tracking-[0.2em] text-[#C5A059] uppercase"
							>Visit #{data.stats.views + 1}</span
						>
						<span class="text-[8px] text-gray-500 uppercase">Last: {data.stats.lastVisit}</span>
					</div>
				{/if}

				<div class="hidden items-center space-x-10 lg:flex">
					<a
						href="/"
						class="text-xs tracking-[0.2em] uppercase {page.url.pathname === '/'
							? 'font-black text-white'
							: 'font-medium text-gray-400 hover:text-[#C5A059]'}">Home</a
					>
					<a
						href="/about"
						class="text-xs tracking-[0.2em] uppercase {page.url.pathname === '/about'
							? 'font-black text-white'
							: 'font-medium text-gray-400 hover:text-[#C5A059]'}">About</a
					>
					<a
						href="/vision"
						class="text-xs tracking-[0.2em] uppercase {page.url.pathname === '/vision'
							? 'font-black text-white'
							: 'font-medium text-gray-400 hover:text-[#C5A059]'}">The Director</a
					>
					<a
						href="/courses"
						class="text-xs tracking-[0.2em] uppercase {page.url.pathname === '/courses'
							? 'font-black text-white'
							: 'font-medium text-gray-400 hover:text-[#C5A059]'}">Courses</a
					>
					<a
						href="/contact"
						class="bg-[#C5A059] px-6 py-2 text-[10px] font-black text-black uppercase transition-colors hover:bg-white"
						>Connect</a
					>
				</div>

				<button class="p-2 text-white lg:hidden" onclick={toggleMenu}>
					<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16m-7 6h7"
						></path></svg
					>
				</button>
			</div>
		</nav>

		{#if isMenuOpen}
			<div
				class="fixed inset-0 z-[101] flex flex-col items-center justify-center gap-8 bg-[#121212] px-8 text-center md:hidden"
			>
				{#if data.stats && data.stats.views > 0}
					<div class="mb-4 border-b border-white/10 pb-4">
						<p class="text-[10px] tracking-[0.2em] text-[#C5A059] uppercase">Global Recognition</p>
						<p class="text-xs font-light text-gray-400">Visitor #{data.stats.views + 1}</p>
					</div>
				{/if}
				<a href="/" class="font-serif text-2xl tracking-widest uppercase" onclick={toggleMenu}
					>Home</a
				>
				<a href="/about" class="font-serif text-2xl tracking-widest uppercase" onclick={toggleMenu}
					>About</a
				>
				<a href="/vision" class="font-serif text-2xl tracking-widest uppercase" onclick={toggleMenu}
					>The Director</a
				>
				<a
					href="/courses"
					class="font-serif text-2xl tracking-widest uppercase"
					onclick={toggleMenu}>Courses</a
				>
				<a
					href="/contact"
					class="mt-4 w-full bg-[#C5A059] py-4 text-xs font-black text-black uppercase"
					onclick={toggleMenu}>Connect</a
				>
				<button
					class="mt-8 text-[10px] tracking-widest text-gray-500 uppercase"
					onclick={toggleMenu}>Close</button
				>
			</div>
		{/if}
	{/if}

	<main class="flex-grow {isAdminPage ? 'pt-0' : 'pt-24 pb-16'}">
		{@render children()}
	</main>

	{#if !isAdminPage}
		<footer class="mt-auto border-t border-white/5 px-8 py-10 md:px-16">
			<div class="grid grid-cols-1 items-center gap-8 md:grid-cols-3">
				<div class="hidden md:block"></div>

				<div class="flex flex-wrap items-center justify-center gap-6">
					<a
						href="https://www.youtube.com/@anvaya.tattvum"
						target="_blank"
						class="text-gray-400 transition-colors hover:text-[#C5A059]"
						aria-label="YouTube"
					>
						<svg class="h-5 w-5 fill-current" viewBox="0 0 24 24">
							<path
								d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
							/>
						</svg>
					</a>

					<a
						href="https://instagram.com/anvaya.collectives"
						target="_blank"
						class="text-gray-400 transition-colors hover:text-[#C5A059]"
						aria-label="Instagram"
					>
						<svg class="h-5 w-5 fill-current" viewBox="0 0 24 24">
							<path
								d="M12 2.163c3.204 0 3.584.012 4.85.07 1.266.058 1.644.07 4.849.07 3.205 0 3.584-.012 4.849-.07 1.266-.058 1.644-.07 4.849-.07s.384.012.485.07c1.266.058 1.644.07 4.849.07s3.584-.012 4.849-.07c.058-1.266.07-1.644.07-4.849 0-3.204-.012-3.584-.07-4.85-.058-1.266-.07-1.644-.07-4.849 0-3.204-.012-3.584.07-4.85.058-1.266.07-1.644.07-4.849zm0-2.163c-3.259 0-3.667.014-4.947.072-1.277.057-2.15.26-2.914.557a5.908 5.908 0 0 0-2.133 1.39 5.908 5.908 0 0 0-1.39 2.133c-.298.764-.501 1.637-.558 2.914-.058 1.28-.072 1.688-.072 4.947s.014 3.667.072 4.947c.057 1.277.26 2.15.558 2.914.307.789.717 1.459 1.39 2.133s1.344 1.083 2.133 1.39c.764.298 1.637.501 2.914.558 1.28.058 1.688.072 4.947.072s3.667-.014 4.947-.072c1.277-.057 2.15-.26 2.914-.558a5.908 5.908 0 0 0 2.133-1.39 5.908 5.908 0 0 0 1.39-2.133c.298-.764.501-1.637.558-2.914.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.057-1.277-.26-2.15-.558-2.914a5.908 5.908 0 0 0-1.39-2.133 5.908 5.908 0 0 0-2.133-1.39c-.764-.298-1.637-.501-2.914-.558-1.28-.058-1.688-.072-4.947-.072zM12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z"
							/>
						</svg>
					</a>

					<a
						href="https://facebook.com/anvayacollectives"
						target="_blank"
						class="text-gray-400 transition-colors hover:text-[#C5A059]"
						aria-label="Facebook"
					>
						<svg class="h-5 w-5 fill-current" viewBox="0 0 24 24">
							<path
								d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
							/>
						</svg>
					</a>

					<a
						href="https://wa.me/918073536708"
						target="_blank"
						class="text-gray-400 transition-colors hover:text-[#C5A059]"
						aria-label="WhatsApp"
					>
						<svg class="h-5 w-5 fill-current" viewBox="0 0 24 24">
							<path
								d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
							/>
						</svg>
					</a>

					<a
						href="https://linkedin.com/company/anvayacollectives"
						target="_blank"
						class="text-gray-400 transition-colors hover:text-[#C5A059]"
						aria-label="LinkedIn"
					>
						<svg class="h-5 w-5 fill-current" viewBox="0 0 24 24">
							<path
								d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-1.337-.025-3.062-1.865-3.062-1.867 0-2.153 1.459-2.153 2.966v5.7h-3v-11h2.88v1.503h.04c.401-.759 1.381-1.554 2.83-1.554 3.03 0 3.59 1.994 3.59 4.585v6.466z"
							/>
						</svg>
					</a>
				</div>

				<div
					class="flex flex-col items-center gap-1 font-serif text-[13px] font-bold tracking-[0.1em] text-gray-200 uppercase md:items-end"
				>
					<a href="mailto:anvaya@tattvum.com" class="transition-all hover:text-[#C5A059]"
						>anvaya@tattvum.com</a
					>
					<a href="tel:+918073536708" class="transition-all hover:text-[#C5A059]">+91 80735 36708</a
					>
				</div>
			</div>

			<div class="mt-20 pb-12 text-center">
				<p class="font-serif text-[10px] tracking-[0.3em] text-white/50 uppercase">
					Copyright &copy; {new Date().getFullYear()} Tattvum Automations Pvt Ltd All Rights Reserved
				</p>
			</div>
		</footer>
	{/if}
</div>

<style>
	:global(.font-serif) {
		font-family: 'Cinzel', serif;
	}
</style>
