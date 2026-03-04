<script lang="ts">
	import './layout.css';
	import { page } from '$app/state';
	let { children } = $props();
</script>

<div class="relative flex min-h-screen flex-col overflow-x-hidden bg-[#121212] text-white">
	<nav
		class="fixed top-0 z-[100] flex w-full items-center justify-between border-b border-white/5 bg-[#121212] px-8 py-6 backdrop-blur-md md:px-16 md:py-10"
	>
		<a href="/" class="group flex items-center gap-4">
			<img
				src="/images/logo.png"
				alt="Anvaya Collective"
				class="h-10 w-auto object-contain transition-transform group-hover:scale-105 md:h-14"
			/>
			<div class="font-serif text-xl tracking-[0.2em] text-yellow-100 uppercase">
				Anvaya Collective
			</div>
		</a>
		<div class="flex items-center space-x-12">
			<div class="hidden space-x-10 md:flex">
				<a
					href="/"
					class="text-xs tracking-[0.2em] uppercase transition-all duration-300 {page.url
						.pathname === '/'
						? 'font-black text-white'
						: 'font-medium text-gray-400 hover:font-bold hover:text-yellow-500'}">Home</a
				>
				<a
					href="/about"
					class="text-xs tracking-[0.2em] uppercase transition-all duration-300 {page.url
						.pathname === '/about'
						? 'font-black text-white'
						: 'font-medium text-gray-400 hover:font-bold hover:text-yellow-500'}">About</a
				>
				<a
					href="/courses"
					class="text-xs tracking-[0.2em] uppercase transition-all duration-300 {page.url
						.pathname === '/courses'
						? 'font-black text-white'
						: 'font-medium text-gray-400 hover:font-bold hover:text-yellow-500'}">Courses</a
				>
			</div>
			<a
				href="/contact"
				class="px-10 py-3 text-xs font-black tracking-[0.2em] uppercase shadow-xl transition-all active:scale-95 {page
					.url.pathname === '/contact'
					? 'border border-white bg-transparent text-white hover:bg-white hover:text-black'
					: 'bg-yellow-500 text-black hover:bg-yellow-600'}">Connect</a
			>
		</div>
	</nav>

	<main class="flex-grow pt-24 pb-16">
		{@render children()}
	</main>
	<footer class="flex flex-col items-center justify-center gap-8 border-t border-white/5 py-10">
		<div class="flex items-center gap-8">
			<a
				href="https://www.youtube.com/@anvaya.tattvum"
				target="_blank"
				class="text-gray-400 transition-all hover:scale-125 hover:text-red-600"
			>
				<svg class="h-5 w-5 fill-current" viewBox="0 0 24 24"
					><path
						d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
					/></svg
				>
			</a>
			<a
				href="https://instagram.com"
				target="_blank"
				class="text-gray-400 transition-all hover:scale-125 hover:text-pink-500"
			>
				<svg class="h-5 w-5 fill-current" viewBox="0 0 24 24"
					><path
						d="M12 2.163c3.204 0 3.584.012 4.85.07 1.266.058 1.644.07 4.849.07 3.205 0 3.584-.012 4.849-.07 1.266-.058 1.644-.07 4.849-.07 3.205 0 3.584-.012 4.849-.07 1.266-.058 1.644-.07 4.849.07 3.205 0 3.584-.012 4.849-.07 1.266-.058 1.644-.07 4.849-.07 3.205 0 3.584.012 4.849.07.058 1.266.07 1.644.07 4.849 0 3.205-.012 3.584-.07 4.849-.058 1.266-.07 1.644-.07 4.849 0 3.205.012 3.584.07 4.849.058 1.266.07 1.644.07 4.849zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm6.5-11.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"
					/></svg
				>
			</a>
			<a
				href="https://facebook.com/anvayacollectives"
				target="_blank"
				class="text-gray-400 transition-all hover:scale-125 hover:text-blue-600"
			>
				<svg class="h-5 w-5 fill-current" viewBox="0 0 24 24"
					><path
						d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
					/></svg
				>
			</a>
			<a
				href="https://wa.me/918073536708"
				target="_blank"
				class="text-gray-400 transition-all hover:scale-125 hover:text-green-500"
			>
				<svg class="h-5 w-5 fill-current" viewBox="0 0 24 24"
					><path
						d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
					/></svg
				>
			</a>
		</div>
	</footer>
</div>
