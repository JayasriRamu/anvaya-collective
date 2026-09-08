<script lang="ts">
	import { slide } from 'svelte/transition';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let dynamicItems = $derived(data?.courseMaterials ?? []);

	const staticCourses = [
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
			title: 'Bio-Somatic Bharatanatyam',
			description:
				'A modern scientific approach to classical movement, focusing on body awareness, anatomical alignment, and sustainable dance practice.',
			isOpen: false,
			modules: [
				{
					title: 'Anatomy of Arimandi',
					sub: 'Deepening the basic half-sit posture through hip rotation, pelvic stability, and knee alignment.'
				},
				{
					title: 'Breath & Kinetic Flow',
					sub: 'Synchronizing Prana with adavu execution for fluid, effortless movement.'
				},
				{
					title: 'Somatic Recovery',
					sub: 'Techniques for injury prevention and longevity in a professional dance career.'
				}
			]
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

	let courseList = $state(staticCourses);

	let allItems = $derived([
		...courseList,
		...dynamicItems.map((item) => ({
			title: item.title,
			description: item.description ?? '',
			url: item.url ?? '',
			tags: item.tags ?? '',
			syllabus: item.syllabus ?? '',
			difficulty: item.difficulty ?? '',
			enrollmentCta: item.enrollmentCta ?? ''
		}))
	]);

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
			{#each allItems as item, i}
				<div
					class="group flex flex-col border border-white/10 bg-white/[0.02] p-8 shadow-xl transition-all hover:border-[#C5A059]/40"
				>
					<div class="mb-6">
						<h2
							class="font-serif text-2xl font-bold tracking-wide text-[#C5A059] uppercase italic transition-colors group-hover:text-white"
						>
							{item.title}
						</h2>
						<div
							class="mt-2 h-[1px] w-12 bg-[#C5A059]/30 transition-all group-hover:w-20 group-hover:bg-[#C5A059]"
						></div>
					</div>

					<p class="mb-8 text-[15px] leading-relaxed font-medium text-gray-300 antialiased">
						{item.description}
					</p>

					{#if 'tags' in item && item.tags}
						<div class="mb-6 flex flex-wrap gap-2">
							{#each item.tags.split(',').map((t: string) => t.trim()).filter(Boolean) as tag}
								<span class="inline-block border border-white/10 bg-white/5 px-2 py-0.5 text-[9px] font-black tracking-widest text-white/60 uppercase">{tag}</span>
							{/each}
						</div>
					{/if}

					{#if 'difficulty' in item && item.difficulty}
						<div class="mb-4">
							<span
								class="inline-block border border-[#C5A059]/40 bg-[#C5A059]/10 px-2 py-0.5 text-[9px] font-black tracking-widest text-[#C5A059] uppercase"
							>
								{item.difficulty}
							</span>
						</div>
					{/if}

					{#if 'syllabus' in item && item.syllabus}
						<div class="mb-6 border-l-2 border-[#C5A059]/30 pl-4">
							<p class="whitespace-pre-line text-[13px] leading-relaxed text-white/60">
								{item.syllabus}
							</p>
						</div>
					{/if}

					{#if 'modules' in item && item.modules}
						<div class="mb-10 border-t border-white/5 pt-8">
							<button
								onclick={() => toggleModules(i)}
								class="group/btn mb-8 flex w-full items-center justify-between focus:outline-none"
							>
								<span
									class="text-[11px] font-black tracking-[0.4em] text-[#C5A059] uppercase transition-colors group-hover/btn:text-white"
								>
									{item.isOpen ? 'Hide Syllabus' : 'View Syllabus Details'}
								</span>
								<div
									class="flex h-6 w-6 items-center justify-center rounded-full border border-[#C5A059]/20 transition-all group-hover/btn:border-[#C5A059]"
								>
									<svg
										class="h-3 w-3 transition-transform duration-500 {item.isOpen
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

							{#if item.isOpen}
								<div
									transition:slide={{ duration: 400 }}
									class="relative ml-2 space-y-10 border-l border-[#C5A059]/30 pl-8"
								>
									{#each item.modules as module, idx}
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
						{#if 'url' in item && item.url}
							<a
								href={item.url}
								target="_blank"
								rel="noopener noreferrer"
								class="inline-flex items-center gap-2 rounded-sm border border-[#C5A059]/60 px-4 py-2 text-[10px] font-black tracking-[0.3em] text-[#C5A059] uppercase transition-all hover:bg-[#C5A059] hover:text-black"
							>
								View Material
								<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
									<path d="M7 7h10v10"/>
									<path d="M7 17 21 3"/>
								</svg>
							</a>
						{:else if 'enrollmentCta' in item && item.enrollmentCta}
							<a
								href={item.enrollmentCta}
								target="_blank"
								rel="noopener noreferrer"
								class="inline-flex items-center gap-4 text-[11px] font-black tracking-[0.4em] text-white uppercase transition-all hover:text-[#C5A059]"
							>
								Enroll Now
								<span class="h-[1px] w-12 bg-[#C5A059] transition-all group-hover:w-20"></span>
							</a>
						{:else}
							<a
								href="/contact"
								class="inline-flex items-center gap-4 text-[11px] font-black tracking-[0.4em] text-white uppercase transition-all hover:text-[#C5A059]"
							>
								Request Enrollment
								<span class="h-[1px] w-12 bg-[#C5A059] transition-all group-hover:w-20"></span>
							</a>
						{/if}
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
