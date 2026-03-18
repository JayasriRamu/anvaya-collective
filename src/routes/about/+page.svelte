<script lang="ts">
	import { fly, fade } from 'svelte/transition';
</script>

<div class="min-h-screen bg-[#121212] font-sans text-white">
	<section
		class="relative flex h-[75vh] items-end justify-center overflow-hidden border-b border-white/5 pb-12"
	>
		<div class="absolute inset-0">
			<img
				src="/images/background-hero.jpg"
				alt="Anvaya Collectives Artistic Director"
				class="h-full w-full object-cover object-[center_12%] opacity-100 brightness-105"
			/>
			<div
				class="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/40 to-transparent"
			></div>
		</div>

		<div class="relative z-10 px-6 text-center" in:fly={{ y: 30, duration: 1000 }}>
			<h2 class="mb-2 text-[10px] font-bold tracking-[0.5em] text-[#C5A059] uppercase">
				Institute of Classical Arts
			</h2>
			<h1 class="font-serif text-5xl leading-tight italic drop-shadow-lg md:text-7xl">
				ABOUT ANVAYA
			</h1>
			<p class="mt-4 text-[10px] font-light tracking-[0.4em] text-white uppercase">
				Connection • Lineage • Evolution
			</p>
		</div>
	</section>

	<section class="mx-auto max-w-6xl px-8 py-24">
		<div class="grid gap-16 md:grid-cols-2">
			<div class="space-y-8" in:fade={{ delay: 300, duration: 1000 }}>
				<h3 class="text-[10px] font-bold tracking-[0.4em] text-[#C5A059] uppercase">
					The Significance
				</h3>
				<h2 class="font-serif text-4xl leading-tight text-white italic">Why "Anvaya"?</h2>

				<p class="text-xl leading-relaxed font-light text-gray-300">
					Anvaya Collectives is a <span class="font-medium text-white">premier institute</span> dedicated
					to the preservation and evolution of Bharatanatyam and Carnatic Music.
				</p>

				<p class="leading-relaxed text-gray-400">
					The word <span class="font-medium text-[#C5A059] italic">"Anvaya"</span> signifies connection
					and lineage. True to its name, our mission is to foster a deep connection between the artist
					and the art form. The institute serves as a bridge between the ancient wisdom of the Kalakshetra
					Bani and modern artistic inquiry.
				</p>
			</div>

			<div class="space-y-12" in:fade={{ delay: 600, duration: 1000 }}>
				<div class="rounded-sm border border-white/10 bg-white/[0.03] p-10 shadow-2xl">
					<p class="mb-8 font-serif text-lg leading-relaxed text-gray-300 italic">
						"At Anvaya Collectives, we believe that dance is a holistic discipline where rhythm,
						melody, and expression converge to tell timeless stories."
					</p>

					<div class="space-y-6 text-sm leading-relaxed text-gray-400">
						<p>
							We go beyond mere performance, delving into the <span class="text-white"
								>kinetics of movement</span
							>
							and the scientific aesthetics of
							<span class="font-bold text-[#C5A059]">Abhinaya</span>.
						</p>

						<p>
							Convergence: We believe that <span class="text-white italic">Rhythm (Thallam)</span>,
							<span class="text-white italic">Melody (Music)</span>, and
							<span class="text-white italic">Expression (Bhava)</span> are inseparable.
						</p>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="border-t border-white/5 bg-white/[0.01] py-20">
		<div class="mx-auto max-w-4xl px-8 text-center">
			<h3 class="mb-6 text-[10px] font-bold tracking-[0.5em] text-[#C5A059] uppercase">
				Our Mission
			</h3>
			<p class="font-serif text-2xl leading-relaxed text-white italic md:text-3xl">
				"To serve as a living medium for storytelling and heritage, bridging the gap between
				technical precision and raw, authentic emotion."
			</p>
			<div class="mt-10 flex flex-col items-center gap-4">
				<p class="text-[11px] font-bold tracking-widest text-gray-500 uppercase">
					Alamelu Sethuraman • Artistic Director
				</p>
				<a
					href="/vision"
					class="group flex items-center gap-3 text-[10px] font-black tracking-[0.3em] text-[#C5A059] uppercase"
				>
					Read Artistic Profile
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4 transition-transform group-hover:translate-x-2"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M17 8l4 4m0 0l-4 4m4-4H3"
						/></svg
					>
				</a>
			</div>
		</div>
	</section>
</div>

<style>
	:global(.font-serif) {
		font-family: 'Cinzel', serif;
	}
</style>
