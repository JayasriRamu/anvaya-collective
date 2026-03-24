<script lang="ts">
	import { slide } from 'svelte/transition';

	const courses = [
		{
			title: 'Mastering Karnas',
			description:
				'An in-depth scholarly study of the 108 Karanas from the Natya Shastra, focusing on structural accuracy and spiritual depth.'
		},
		{
			title: 'Natyashastra',
			description:
				'Comprehensive exploration of ancient Indian dramatic theory, aesthetics, and performance foundation.'
		},
		{
			title: 'Choreography & Production',
			description:
				'Bridging traditional techniques with contemporary stage composition and lighting aesthetics.',
			isOpen: false,
			modules: [
				{ title: 'The Pulse of Creation', sub: 'Finding your choreographic voice.' },
				{
					title: 'Visual Storytelling',
					sub: 'How to produce a dance piece from concept to execution.'
				},
				{ title: 'The Collective Lab', sub: 'Collaborative production and peer review.' }
			]
		},
		{
			title: 'Bharatanatyam Repertoire',
			description:
				'Structured progression from foundational steps to complex masterclass repertoire.'
		}
	];

	let courseList = $state(courses);

	function toggleModules(index: number) {
		courseList[index].isOpen = !courseList[index].isOpen;
	}
</script>

<div class="min-h-screen bg-[#0a0a0a] px-6 py-16 md:px-20">
	<div class="mx-auto max-w-6xl">
		<header class="mb-16 border-l-2 border-[#C5A059] pl-6">
			<h2 class="mb-1 text-[10px] font-bold tracking-[0.5em] text-[#C5A059] uppercase">Academy</h2>
			<h1
				class="font-serif text-4xl font-bold tracking-tight text-white uppercase italic md:text-6xl"
			>
				Curriculum
			</h1>
		</header>

		<div class="grid items-start gap-8 text-left md:grid-cols-2">
			{#each courseList as course, i}
				<div
					class="group flex flex-col border border-white/10 bg-white/[0.02] p-8 shadow-xl transition-all hover:border-[#C5A059]/40"
				>
					<div class="mb-6">
						<h2
							class="font-serif text-2xl font-bold tracking-wide text-[#C5A059] uppercase italic transition-colors group-hover:text-white"
						>
							{course.title}
						</h2>
						<div
							class="mt-2 h-[1px] w-12 bg-[#C5A059]/30 transition-all group-hover:w-20 group-hover:bg-[#C5A059]"
						></div>
					</div>

					<p class="mb-8 text-[15px] leading-relaxed font-medium text-gray-300 antialiased">
						{course.description}
					</p>

					{#if course.modules}
						<div class="mb-10 border-t border-white/5 pt-8">
							<button
								onclick={() => toggleModules(i)}
								class="group/btn mb-8 flex w-full items-center justify-between focus:outline-none"
							>
								<span
									class="text-[11px] font-black tracking-[0.4em] text-[#C5A059] uppercase transition-colors group-hover/btn:text-white"
								>
									{course.isOpen ? 'Hide Syllabus' : 'View Syllabus Details'}
								</span>
								<div
									class="flex h-6 w-6 items-center justify-center rounded-full border border-[#C5A059]/20 transition-all group-hover/btn:border-[#C5A059]"
								>
									<svg
										class="h-3 w-3 transition-transform duration-500 {course.isOpen
											? 'rotate-180'
											: ''}"
										fill="none"
										viewBox="0 0 24 24"
										stroke="#C5A059"
										stroke-width="3"
									>
										<path d="M19 9l-7 7-7-7" />
									</svg>
								</div>
							</button>

							{#if course.isOpen}
								<div
									transition:slide={{ duration: 400 }}
									class="relative ml-2 space-y-10 border-l border-[#C5A059]/30 pl-8"
								>
									{#each course.modules as module, idx}
										<div class="group/mod relative">
											<div
												class="absolute top-1.5 -left-[37px] h-3 w-3 rounded-full border-2 border-[#0a0a0a] bg-[#C5A059] transition-transform group-hover/mod:scale-125"
											></div>

											<h4 class="mb-2 text-[13px] font-bold tracking-widest text-white uppercase">
												{module.title}
											</h4>
											<p
												class="text-[14px] leading-relaxed font-medium text-gray-300 normal-case italic opacity-90 transition-all group-hover/mod:text-white"
											>
												{module.sub}
											</p>
										</div>
									{/each}
								</div>
							{/if}
						</div>
					{/if}

					<div class="mt-auto border-t border-white/5 pt-4">
						<a
							href="/contact"
							class="inline-flex items-center gap-4 text-[11px] font-black tracking-[0.4em] text-white uppercase transition-all hover:text-[#C5A059]"
						>
							Request Enrollment
							<span class="h-[1px] w-12 bg-[#C5A059] transition-all group-hover:w-20"></span>
						</a>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	:global(.font-serif) {
		font-family: 'Cinzel', serif;
	}
</style>
