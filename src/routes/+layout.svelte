<script lang="ts">
	import './layout.css';
	import { page } from '$app/state';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: any } = $props();
	let isMenuOpen = $state(false);

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}
</script>

<div class="relative flex min-h-screen flex-col overflow-x-hidden bg-[#121212] text-white">
	<nav
		class="fixed top-0 z-[100] flex w-full items-center justify-between border-b border-white/5 bg-[#121212]/90 px-4 py-5 backdrop-blur-md md:px-16 md:py-10"
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

			<a href="/" class="font-serif text-2xl tracking-widest uppercase" onclick={toggleMenu}>Home</a
			>
			<a href="/about" class="font-serif text-2xl tracking-widest uppercase" onclick={toggleMenu}
				>About</a
			>
			<a href="/vision" class="font-serif text-2xl tracking-widest uppercase" onclick={toggleMenu}
				>The Director</a
			>
			<a href="/courses" class="font-serif text-2xl tracking-widest uppercase" onclick={toggleMenu}
				>Courses</a
			>
			<a
				href="/contact"
				class="mt-4 w-full bg-[#C5A059] py-4 text-xs font-black text-black uppercase"
				onclick={toggleMenu}>Connect</a
			>
			<button class="mt-8 text-[10px] tracking-widest text-gray-500 uppercase" onclick={toggleMenu}
				>Close</button
			>
		</div>
	{/if}

	<main class="flex-grow pt-24 pb-16">
		{@render children()}
	</main>

	<footer class="mt-auto border-t border-white/5 px-8 py-10 md:px-16">
		<div class="grid grid-cols-1 items-center gap-8 md:grid-cols-3">
			<div class="hidden md:block"></div>

			<div class="flex items-center justify-center gap-6">
				<a
					href="https://www.youtube.com/@anvaya.tattvum"
					target="_blank"
					class="text-gray-400 transition-colors hover:text-[#C5A059]"
				>
					<svg class="h-6 w-6 fill-current" viewBox="0 0 24 24"
						><path
							d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
						/></svg
					>
				</a>
			</div>

			<div
				class="flex flex-col items-center gap-1 font-serif text-[13px] font-bold tracking-[0.1em] text-gray-200 uppercase md:items-end"
			>
				<a href="mailto:anvaya@tattvum.com" class="transition-all hover:text-[#C5A059]"
					>anvaya@tattvum.com</a
				>
				<a href="tel:+918073536708" class="transition-all hover:text-[#C5A059]">+91 80735 36708</a>
			</div>
		</div>
	</footer>
</div>

<style>
	:global(.font-serif) {
		font-family: 'Cinzel', serif;
	}
</style>
