<script lang="ts">
	import { fade } from 'svelte/transition';
</script>

<div class="min-h-screen bg-[#121212] text-white">
	<section class="grid grid-cols-1 md:grid-cols-2">
		<div class="relative h-[60vh] overflow-hidden md:h-screen">
			<img
				src="/images/background-hero.jpg"
				alt="Dance Pose"
				class="h-full w-full object-cover object-[63%_17%] brightness-90 contrast-110"
				in:fade={{ duration: 1500 }}
			/>
			<div
				class="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/40 to-transparent"
			></div>
		</div>

		<div
			class="flex items-center justify-center px-12 py-24 md:px-20 md:py-32"
			in:fade={{ delay: 500, duration: 1500 }}
		>
			<div class="max-w-2xl space-y-12">
				<div class="text-center md:text-left">
					<h3 class="mb-6 text-[10px] font-bold tracking-[0.5em] text-yellow-500 uppercase">
						Our Visionary Manifesto
					</h3>
					<h1 class="font-serif text-5xl leading-tight text-white italic md:text-6xl">
						The Architecture <br /> of Ancient Wellness
					</h1>
				</div>

				<div class="mx-auto h-px w-20 bg-yellow-500/50 md:mx-0"></div>

				<div class="space-y-10 leading-loose font-light text-gray-300 md:text-xl">
					<p>
						At our school, we decode the Natya Shastra to reclaim the body’s natural vitality. We
						treat Bharatanatyam as a profound science of movement, where every Adavu is a
						physiotherapy-informed strength exercise.
					</p>

					<p>
						Through our original Choreography, we weave Storytelling and the evocative power of Rasa
						to serve as a deep-seated mood elevator.
					</p>

					<p class="border-l border-yellow-500/30 pt-6 pl-6 font-medium text-white italic">
						"This is a holistic journey of wellness for all—proving that tradition is the ultimate
						path to modern health."
					</p>
				</div>
			</div>
		</div>
	</section>
</div>

<style>
	:global(.font-serif) {
		font-family: 'Cinzel', serif;
	}
</style>
