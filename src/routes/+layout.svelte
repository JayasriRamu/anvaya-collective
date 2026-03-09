<script lang="ts">
	import './layout.css';
	import { page } from '$app/state';
	let { children } = $props();

	// State for mobile menu
	let isMenuOpen = $state(false);

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}
</script>

<div class="relative flex min-h-screen flex-col overflow-x-hidden bg-[#121212] text-white">
	<nav
		class="fixed top-0 z-[100] flex w-full items-center justify-between border-b border-white/5 bg-[#121212]/90 px-8 py-6 backdrop-blur-md md:px-16 md:py-10"
	>
		<a href="/" class="group flex items-center gap-4">
			<img
				src="/images/logo.png"
				alt="Anvaya Collective"
				class="h-10 w-auto object-contain transition-transform group-hover:scale-105 md:h-14"
			/>
			<div class="font-serif text-xl tracking-[0.2em] text-[#C5A059] uppercase">
				Anvaya Collective
			</div>
		</a>

		<div class="hidden items-center space-x-12 md:flex">
			<div class="flex space-x-10">
				<a
					href="/"
					class="text-xs tracking-[0.2em] uppercase {page.url.pathname === '/'
						? 'font-black text-white'
						: 'font-medium text-gray-400 hover:text-yellow-500'}">Home</a
				>
				<a
					href="/about"
					class="text-xs tracking-[0.2em] uppercase {page.url.pathname === '/about'
						? 'font-black text-white'
						: 'font-medium text-gray-400 hover:text-yellow-500'}">About</a
				>
				<a
					href="/vision"
					class="text-xs tracking-[0.2em] uppercase {page.url.pathname === '/vision'
						? 'font-black text-white'
						: 'font-medium text-gray-400 hover:text-yellow-500'}">Vision</a
				>
				<a
					href="/courses"
					class="text-xs tracking-[0.2em] uppercase {page.url.pathname === '/courses'
						? 'font-black text-white'
						: 'font-medium text-gray-400 hover:text-yellow-500'}">Courses</a
				>
			</div>
			<a
				href="/contact"
				class="px-10 py-3 text-xs font-black tracking-[0.2em] uppercase shadow-xl transition-all active:scale-95 {page
					.url.pathname === '/contact'
					? 'border border-[#C5A059] bg-transparent text-[#C5A059] hover:bg-[#C5A059] hover:text-black'
					: 'bg-[#C5A059] text-black hover:bg-[#A88748]'}"
			>
				Connect
			</a>
		</div>

		<button class="p-2 text-white md:hidden" onclick={toggleMenu} aria-label="Toggle Menu">
			<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M4 6h16M4 12h16m-7 6h7"
				></path></svg
			>
		</button>
	</nav>

	{#if isMenuOpen}
		<div
			class="fixed inset-0 z-[90] flex flex-col items-center justify-center gap-8 bg-[#121212] pt-20 md:hidden"
		>
			<a href="/" class="font-serif text-2xl tracking-widest uppercase" onclick={toggleMenu}>Home</a
			>
			<a href="/about" class="font-serif text-2xl tracking-widest uppercase" onclick={toggleMenu}
				>About</a
			>
			<a href="/vision" class="font-serif text-2xl tracking-widest uppercase" onclick={toggleMenu}
				>Vision</a
			>
			<a href="/courses" class="font-serif text-2xl tracking-widest uppercase" onclick={toggleMenu}
				>Courses</a
			>
			<a
				href="/contact"
				class="bg-yellow-500 px-10 py-4 text-xs font-black tracking-[0.2em] text-black uppercase"
				onclick={toggleMenu}>Connect</a
			>
		</div>
	{/if}

	<main class="flex-grow pt-24 pb-16">
		{@render children()}
	</main>

	<footer class="border-t border-white/5 px-8 py-10 md:px-16"></footer>
</div>
