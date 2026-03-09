<script lang="ts">
	import { fly } from 'svelte/transition';
</script>

<div class="min-h-screen bg-[#121212] text-white">
	<section
		class="relative flex h-[60vh] items-center justify-center overflow-hidden border-b border-white/5"
	>
		<div class="absolute inset-0 opacity-40">
			<img
				src="/images/background-hero.jpg"
				alt="Alamelu Sethuraman"
				class="h-full w-full object-cover object-[center_10%]"
			/>
			<div
				class="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-[#121212]/40"
			></div>
		</div>
		<div class="relative z-10 px-6 text-center" in:fly={{ y: 20, duration: 1000 }}>
			<h2 class="mb-4 text-[10px] font-bold tracking-[0.4em] text-yellow-500 uppercase">
				Anvaya Collectives
			</h2>
			<h1 class="font-serif text-4xl leading-tight italic md:text-7xl">
				THE ARCHITECTURE <br /> OF MOVEMENT
			</h1>
			<p class="mt-4 text-[10px] font-light tracking-[0.5em] text-gray-400 uppercase md:text-xs">
				A Masterclass in Choreography
			</p>
		</div>
	</section>

	<section class="mx-auto max-w-7xl px-6 py-20 md:px-12">
		<div class="grid gap-12 md:grid-cols-[280px_1fr] md:gap-20">
			<aside class="space-y-12">
				<div class="relative border-l border-yellow-500/50 pl-6">
					<h3 class="mb-4 text-[10px] font-bold tracking-[0.4em] text-yellow-500 uppercase">
						Artistic Director
					</h3>
					<h2
						class="font-serif text-3xl leading-tight tracking-tighter text-white uppercase md:text-4xl"
					>
						Alamelu <br /> Sethuraman
					</h2>
					<div class="mt-6 space-y-2 border-t border-white/10 pt-6">
						<p class="text-[10px] font-light tracking-[0.3em] text-gray-400 uppercase">
							M.A. Bharatanatyam
						</p>
						<p class="text-[10px] font-light tracking-[0.3em] text-gray-400 uppercase">
							M.Sc. Molecular Biology
						</p>
					</div>
				</div>

				<div class="pl-6">
					<p class="font-serif text-sm leading-relaxed text-gray-500 italic">
						"Tradition is the foundation. <br /> Innovation is the New Order."
					</p>
				</div>
			</aside>

			<main class="space-y-16">
				<div class="max-w-2xl space-y-8">
					<p class="text-lg leading-relaxed font-light text-gray-300">
						As the Artistic Director at <span class="font-bold text-white">Bala Natya Manjari</span>
						(the institution of my Guru,
						<span class="text-yellow-500/80">Prof. Smt. Sikkil Vasanthakumari</span>), I bring 40
						years of immersion in Bharatanatyam and 20 years of mentoring to this new chapter at
						<span class="border-b border-yellow-500/30">Anvaya Collectives</span>.
					</p>
					<p class="text-lg leading-relaxed font-light text-gray-300">
						I am inviting performers and budding teachers to explore a unique approach to dance—one
						that bridges the precision of solo mastery with the grand vision of group choreography.
					</p>
				</div>

				<div class="grid gap-6 sm:grid-cols-2">
					{#each [{ title: 'The Solo Command', desc: 'Refining Abhinaya and Angashuddha for a powerful solo presence.' }, { title: 'Dramas & Themes', desc: 'Crafting narratives from ancient Ithihasas to contemporary themes.' }, { title: 'Visual Geometry', desc: 'Understanding space and formations in group choreography.' }, { title: 'Laya & Shastra', desc: 'Deepening the rhythmic logic and theoretical foundations of Natya.' }] as card}
						<div
							class="border border-white/5 bg-white/[0.02] p-8 transition-colors hover:border-yellow-500/30"
						>
							<h4 class="mb-4 text-[10px] font-bold tracking-widest text-yellow-500 uppercase">
								{card.title}
							</h4>
							<p class="text-sm leading-relaxed font-light text-gray-400">{card.desc}</p>
						</div>
					{/each}
				</div>
			</main>
		</div>
	</section>
</div>

<style>
	:global(.font-serif) {
		font-family: 'Cinzel', serif;
	}
</style>
