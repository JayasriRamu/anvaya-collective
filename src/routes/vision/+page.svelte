<script lang="ts">
	import { fade, fly } from 'svelte/transition';
</script>

<div class="min-h-screen bg-[#121212] text-white">
	<section class="grid grid-cols-1 md:grid-cols-[1fr_1.2fr]">
		<div class="relative sticky top-0 h-[60vh] overflow-hidden md:h-screen">
			<img
				src="/images/background-hero.jpg"
				alt="Alamelu Sethuraman"
				class="h-full w-full object-cover object-[50%_12%] brightness-95"
			/>
			<div
				class="absolute inset-0 bg-gradient-to-r from-transparent via-[#121212]/10 to-[#121212]"
			></div>

			<div class="absolute bottom-12 left-12 z-10" in:fade={{ delay: 400 }}>
				<h2 class="mb-2 font-serif text-4xl text-white italic md:text-5xl">Alamelu Sethuraman</h2>
				<p class="text-[10px] font-bold tracking-[0.4em] text-[#C5A059] uppercase">
					Artistic Director, Anvaya Collectives
				</p>
				<div class="mt-4 inline-block border border-[#C5A059]/40 bg-[#C5A059]/10 px-4 py-1">
					<p class="text-[10px] font-black tracking-[0.2em] text-[#C5A059] uppercase">
						B-Grade Artist | Pedagogue
					</p>
				</div>
			</div>
		</div>

		<div class="space-y-24 px-10 py-20 md:px-20 md:py-32">
			<section class="space-y-6">
				<h3 class="text-[10px] font-bold tracking-[0.5em] text-[#C5A059] uppercase">
					Executive Profile
				</h3>
				<p class="font-serif text-3xl leading-tight text-white italic md:text-4xl">
					"Movement is my language, and the stage is my canvas."
				</p>
				<p class="text-lg leading-relaxed font-light text-gray-400">
					A distinguished <span class="font-bold text-[#C5A059] italic">B-Grade Artist</span> and Bharatanatyam
					exponent of the Kalakshetra Bani with over 25 years of experience. My career is dedicated to
					the preservation, scholarly research, and global propagation of the ancient arts, integrating
					traditional rigor with scientific movement kinetics.
				</p>
			</section>

			<section class="grid grid-cols-1 gap-12 border-t border-white/10 pt-16 md:grid-cols-2">
				<div class="space-y-6">
					<h4 class="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
						Academic Pursuit
					</h4>
					<ul class="space-y-4 text-base text-gray-300">
						<li>
							<span class="block text-lg font-medium text-white">MFA in Bharatanatyam</span>
							Annamalai University (2018)
						</li>
						<li class="border-l border-[#C5A059]/30 pl-4 text-sm text-gray-500 italic">
							Thesis: Benesh Movement Notation for Adavus
						</li>
						<li>
							<span class="block font-medium text-white">Ph.D. Candidate</span>
							Advancing research in Dance Notation & Kinetics
						</li>
					</ul>
				</div>
				<div class="space-y-6">
					<h4 class="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
						Artistic Lineage
					</h4>
					<ul class="space-y-4 text-base text-gray-300">
						<li>
							<span class="block text-lg font-medium text-white">Initial Training</span>
							Prof. Smt. Sikkil Vasanthakumari (Kalakshetra Bani)
						</li>
						<li>
							<span class="block font-medium text-white">Natya Sastra Studies</span>
							Direct disciple of Dr. Padma Subrahmanyam tradition
						</li>
					</ul>
				</div>
			</section>

			<section class="space-y-8">
				<h4 class="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
					Core Competencies
				</h4>
				<div class="flex flex-wrap gap-4">
					{#each ['Technical Mastery', 'Nattuvangam', 'Kinetics', 'Thematic Choreography', 'Research', 'Pedagogy', 'Carnatic Music'] as skill}
						<span
							class="border border-[#C5A059]/40 bg-white/[0.03] px-6 py-3 text-[11px] font-bold tracking-[0.2em] text-white uppercase transition-all hover:bg-[#C5A059] hover:text-black"
						>
							{skill}
						</span>
					{/each}
				</div>
			</section>

			<section class="space-y-8 border-t border-white/10 pt-16">
				<h4 class="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
					Prestigious Platforms
				</h4>
				<div
					class="grid grid-cols-1 gap-x-12 gap-y-6 font-serif text-xl text-gray-200 italic md:grid-cols-2"
				>
					<ul class="space-y-4">
						<li class="flex items-center gap-3">
							<span class="h-1.5 w-1.5 rounded-full bg-[#C5A059]"></span> Mylapore Fine Arts
						</li>
						<li class="flex items-center gap-3">
							<span class="h-1.5 w-1.5 rounded-full bg-[#C5A059]"></span> Karthik Fine Arts
						</li>
						<li class="flex items-center gap-3">
							<span class="h-1.5 w-1.5 rounded-full bg-[#C5A059]"></span> Tamil Isai Sangam
						</li>
					</ul>
					<ul class="space-y-4">
						<li class="flex items-center gap-3">
							<span class="h-1.5 w-1.5 rounded-full bg-[#C5A059]"></span> Natyanjali Festival
						</li>
						<li class="flex items-center gap-3">
							<span class="h-1.5 w-1.5 rounded-full bg-[#C5A059]"></span> Shankara Bharanam Trust
						</li>
						<li class="flex items-center gap-3">
							<span class="h-1.5 w-1.5 rounded-full bg-[#C5A059]"></span> Jagriti Theatre
						</li>
					</ul>
				</div>
			</section>
		</div>
	</section>
</div>

<style>
	:global(.font-serif) {
		font-family: 'Cinzel', serif;
	}
</style>
