<script>
	const courses = [
		{
			title: 'Mastering Karnas',
			description: 'In-depth study of the 108 Karanas from the Natya Shastra.'
		},
		{
			title: 'Natyashastra',
			description: 'Comprehensive exploration of ancient Indian dramatic theory and aesthetics.'
		},
		{
			title: 'Choreography',
			description: 'Bridging traditional techniques with contemporary stage composition.'
		},
		{
			title: 'Basic to Advanced Bharatnatyam',
			description:
				'Structured progression from foundational steps to complex masterclass repertoire.'
		}
	];
</script>

<div class="min-h-screen bg-[#121212] px-8 py-24 md:px-20">
	<div class="mx-auto max-w-4xl">
		<h1 class="mb-16 font-serif text-5xl tracking-tighter text-white uppercase italic md:text-7xl">
			Our Courses
		</h1>
		<div class="grid gap-8 md:grid-cols-2">
			{#each courses as course}
				<div
					class="border border-white/10 bg-white/5 p-8 transition-all hover:border-yellow-500/50 hover:bg-yellow-500/5"
				>
					<h2 class="mb-4 font-serif text-2xl text-yellow-500 uppercase italic">{course.title}</h2>
					<p class="text-sm leading-relaxed font-light text-gray-300">{course.description}</p>
					<a
						href="/contact"
						class="mt-6 inline-block text-xs font-black tracking-[0.2em] text-white uppercase transition-all duration-300 hover:text-yellow-500 hover:underline"
					>
						Inquire Now →
					</a>
				</div>
			{/each}
		</div>
	</div>
</div>
