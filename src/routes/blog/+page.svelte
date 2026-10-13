<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { fade, fly } from 'svelte/transition';

	const blogUrl = env.PUBLIC_BLOG_URL?.trim();
</script>

<div class="mx-auto flex max-w-3xl flex-col items-center px-8 py-32 text-center">
	<p
		class="text-[10px] font-bold tracking-[0.5em] text-[#C5A059] uppercase"
		in:fade={{ duration: 1000 }}
	>
		Journal &amp; Musings
	</p>

	<h1
		class="mt-4 font-serif text-5xl leading-tight italic drop-shadow-lg md:text-6xl"
		in:fly={{ y: 30, duration: 1000 }}
	>
		THE BLOG
	</h1>

	<p
		class="mt-8 text-lg leading-relaxed font-light text-gray-300"
		in:fade={{ delay: 300, duration: 1000 }}
	>
		Essays, performance notes and stories from behind the stage are on their way.
	</p>

	<div in:fade={{ delay: 600, duration: 1000 }}>
		{#if blogUrl}
			<a
				href={blogUrl}
				target="_blank"
				rel="noopener noreferrer"
				class="mt-12 inline-block bg-[#C5A059] px-10 py-4 text-[10px] font-black text-black uppercase transition-colors hover:bg-white"
			>
				Read on the blog
			</a>
		{:else}
			<p class="mt-12 text-[10px] tracking-[0.3em] text-white/40 uppercase">Coming soon</p>
		{/if}
	</div>
</div>
