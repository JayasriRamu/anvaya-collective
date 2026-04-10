<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	// Navigation & UI State
	let currentStep = $state(1);
	const totalSteps = 5;
	let isEditing = $state(false);
	let isSubmitting = $state(false);
	let formSubmitted = $state(false);
	let activeDescription = $state('');

	// Dropdown state
	let isLocationOpen = $state(false);

	// App Logic State
	let hasExistingProfile = $state(false);
	let rememberMe = $state(true);

	// Data Source
	let localUser = $state({
		name: '',
		phone: '',
		location: 'India',
		ageGroup: '40-50',
		interest: [] as string[],
		healthHistory: [] as string[],
		medications: '',
		signature: ''
	});

	const interests = [
		{ name: '✨ Choreography', desc: 'Creative composition and sequence building.' },
		{ name: '💃 Active Track', desc: 'Standing and full movement.' },
		{ name: '🦵 Modified Track', desc: 'Low-impact, knee-safe adjustments.' },
		{ name: '🪑 Chair Natyam', desc: 'Fully seated (ideal for limited mobility).' },
		{ name: '📜 Natya Sastra', desc: 'Theoretical study of ancient texts.' },
		{ name: '📖 Storytelling', desc: 'Abhinaya and narrative expression.' },
		{ name: '🎵 Music', desc: 'Rhythmic and melodic foundations.' },
		{ name: '➕ Others', desc: 'Other specific interests or requirements.' }
	];

	const healthOptions = [
		'Osteoporosis',
		'Rheumatoid Arthritis',
		'Knee Replacement',
		'Hip/Back Surgery',
		'Ligament Tear',
		'High Blood Pressure',
		'Cardiovascular',
		'Sarcopenia',
		'Diabetes',
		'Chronic Pain'
	];

	const ageGroups = ['5-10', '10-20', '20-30', '40-50', '51-60', '61-70', '71+'];

	onMount(() => {
		const saved = localStorage.getItem('user_profile_backup');
		if (saved) {
			try {
				const parsed = JSON.parse(saved);
				if (parsed && parsed.name) {
					localUser = {
						...localUser,
						...parsed,
						interest: Array.isArray(parsed.interest)
							? parsed.interest
							: parsed.interest?.split(', ') || [],
						healthHistory: Array.isArray(parsed.healthHistory)
							? parsed.healthHistory
							: parsed.healthHistory?.split(', ') || []
					};
					hasExistingProfile = true;
				}
			} catch (e) {
				localStorage.removeItem('user_profile_backup');
			}
		}
	});

	function goToStep(step: number) {
		if (step >= 1 && step <= totalSteps) currentStep = step;
	}

	function validateMobile(event: Event) {
		const input = event.target as HTMLInputElement;
		input.value = input.value.replace(/[^\d+]/g, '');
		localUser.phone = input.value;
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		isSubmitting = true;

		const submissionData = {
			...localUser,
			interest: localUser.interest.join(', '),
			healthHistory: localUser.healthHistory.join(', ')
		};

		if (rememberMe) localStorage.setItem('user_profile_backup', JSON.stringify(submissionData));
		else localStorage.removeItem('user_profile_backup');

		try {
			const formElement = event.currentTarget as HTMLFormElement;
			const formData = new FormData(formElement);
			formData.set('interest', submissionData.interest);
			formData.set('healthHistory', submissionData.healthHistory);
			formData.set('location', localUser.location);
			formData.set('ageGroup', localUser.ageGroup);

			const response = await fetch(formElement.action, { method: 'POST', body: formData });
			if (response.ok) {
				await invalidateAll();
				setTimeout(() => {
					isSubmitting = false;
					isEditing = false;
					formSubmitted = true;
					hasExistingProfile = true;
				}, 500);
			}
		} catch (e) {
			isSubmitting = false;
		}
	}

	async function handleLogout() {
		localStorage.removeItem('user_profile_backup');
		localUser = {
			name: '',
			phone: '',
			location: 'India',
			ageGroup: '40-50',
			interest: [],
			healthHistory: [],
			medications: '',
			signature: ''
		};
		hasExistingProfile = false;
		isEditing = false;
		currentStep = 1;
	}

	function copyToClipboard(text: string) {
		navigator.clipboard.writeText(text);
	}
</script>

<div
	class="relative flex min-h-screen w-full flex-col overflow-hidden bg-[#070707] font-sans text-white md:flex-row"
>
	<div class="relative h-[30vh] w-full shrink-0 border-r border-white/5 md:h-screen md:w-[35%]">
		<img
			src="/images/background-hero.jpg"
			alt="Dancer"
			class="h-full w-full object-cover object-top brightness-75"
		/>
		<div
			class="absolute inset-0 bg-gradient-to-t from-[#070707] via-transparent md:bg-gradient-to-r md:from-[#070707]"
		></div>
	</div>

	<div
		class="flex h-screen w-full flex-col overflow-y-auto px-8 py-12 md:w-[65%] md:px-20 md:py-16"
	>
		<div class="mx-auto w-full max-w-4xl">
			{#if formSubmitted}
				<div in:fly={{ y: 30 }} class="space-y-8 py-20 text-center">
					<div
						class="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-2 border-[#C5A059] text-4xl shadow-[0_0_20px_rgba(197,160,89,0.2)]"
					>
						✨
					</div>
					<h2 class="font-serif text-5xl text-[#C5A059] italic">Registered</h2>
					<button
						onclick={() => (formSubmitted = false)}
						class="bg-[#C5A059] px-12 py-5 text-sm font-black text-black uppercase transition-all hover:bg-white"
						>View Stored Profile</button
					>
				</div>
			{:else if hasExistingProfile && !isEditing}
				<div
					in:fade
					class="space-y-10 border border-white/10 bg-white/[0.03] p-12 shadow-2xl backdrop-blur-sm"
				>
					<div class="border-b border-white/10 pb-8 text-center">
						<p class="mb-2 text-[11px] font-bold tracking-[0.4em] text-[#C5A059] uppercase">
							Workshop Profile
						</p>
						<h2 class="font-serif text-4xl tracking-tight text-white italic">
							Namaste, {localUser.name}
						</h2>
					</div>
					<div class="grid grid-cols-2 gap-10">
						<div>
							<p class="mb-1 text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">
								WhatsApp
							</p>
							<p class="text-2xl font-light text-white">
								+{localUser.location === 'Outside' ? '' : '91 '}{localUser.phone}
							</p>
						</div>
						<div>
							<p class="mb-1 text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">
								Track
							</p>
							<p class="text-xl font-medium text-[#C5A059]">
								{localUser.interest.join(', ') || 'General'}
							</p>
						</div>
					</div>
					<div class="flex gap-4 pt-6">
						<button
							onclick={() => (isEditing = true)}
							class="flex-1 bg-[#C5A059] py-5 text-xs font-black text-black uppercase transition-all hover:bg-white"
							>Edit Details</button
						>
						<button
							onclick={handleLogout}
							class="border border-white/20 px-10 text-xs font-bold text-white uppercase transition-all hover:bg-white/10"
							>Forget Me</button
						>
					</div>
				</div>
			{:else}
				<header class="mb-10 border-b border-white/10 pb-8">
					<div class="mb-6 flex items-center justify-between">
						<span class="text-[12px] font-black tracking-[0.4em] text-[#C5A059] uppercase"
							>Step {currentStep} / {totalSteps}</span
						>
						<div class="flex gap-3">
							{#each Array(totalSteps) as _, i}
								<button
									onclick={() => goToStep(i + 1)}
									class="h-1.5 rounded-full transition-all {currentStep === i + 1
										? 'w-12 bg-[#C5A059]'
										: 'w-8 bg-white/10'}"
								></button>
							{/each}
						</div>
					</div>
					<h1 class="font-serif text-6xl tracking-tight text-[#C5A059] italic">Anvaya Inquiry</h1>
				</header>

				<form method="POST" action="?/submit" onsubmit={handleSubmit} class="space-y-14">
					{#if currentStep === 1}
						<div in:fade class="space-y-12">
							<div class="grid grid-cols-1 gap-12 md:grid-cols-2">
								<div
									class="border-b border-white/30 pb-3 transition-colors focus-within:border-[#C5A059]"
								>
									<label
										class="mb-1 block text-[12px] font-black tracking-widest text-white/50 uppercase"
										>Full Name</label
									>
									<input
										type="text"
										bind:value={localUser.name}
										required
										class="w-full bg-transparent py-2 text-2xl font-light text-white outline-none"
									/>
								</div>
								<div
									class="border-b border-white/30 pb-3 transition-colors focus-within:border-[#C5A059]"
								>
									<label
										class="mb-1 block text-[12px] font-black tracking-widest text-white/50 uppercase"
										>WhatsApp</label
									>
									<div class="flex items-center gap-3">
										<span class="text-2xl font-light text-[#C5A059]"
											>{localUser.location === 'Outside' ? '+' : '+91'}</span
										>
										<input
											type="tel"
											bind:value={localUser.phone}
											required
											oninput={validateMobile}
											class="w-full bg-transparent py-2 text-2xl font-light text-white outline-none"
										/>
									</div>
								</div>
							</div>

							<div class="max-w-sm space-y-4">
								<label class="text-[12px] font-black tracking-widest text-white/50 uppercase"
									>Region of Residence</label
								>
								<div class="relative">
									<button
										type="button"
										onclick={() => (isLocationOpen = !isLocationOpen)}
										class="flex w-full items-center justify-between border border-white/20 bg-[#151515] p-5 text-base font-bold text-white shadow-xl"
									>
										<span
											>{localUser.location === 'Outside'
												? '🌍 Outside India'
												: '🇮🇳 Inside India'}</span
										>
										<span class="text-[#C5A059]">{isLocationOpen ? '▲' : '▼'}</span>
									</button>
									{#if isLocationOpen}
										<div
											class="absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden border border-white/20 bg-[#1a1a1a] shadow-2xl"
										>
											<button
												type="button"
												onclick={() => {
													localUser.location = 'India';
													isLocationOpen = false;
												}}
												class="w-full p-5 text-left text-base font-bold text-white transition-colors hover:bg-[#C5A059] hover:text-black"
												>🇮🇳 Inside India</button
											>
											<button
												type="button"
												onclick={() => {
													localUser.location = 'Outside';
													isLocationOpen = false;
												}}
												class="w-full p-5 text-left text-base font-bold text-white transition-colors hover:bg-[#C5A059] hover:text-black"
												>🌍 Outside India</button
											>
										</div>
									{/if}
								</div>
							</div>

							<div class="space-y-6">
								<label class="text-[12px] font-black tracking-widest text-white/50 uppercase"
									>Select Age Group</label
								>
								<div class="grid grid-cols-4 gap-3 sm:grid-cols-7">
									{#each ageGroups as age}
										<button
											type="button"
											onclick={() => (localUser.ageGroup = age)}
											class="h-14 border text-sm font-black uppercase transition-all {localUser.ageGroup ===
											age
												? 'border-[#C5A059] bg-[#C5A059] text-black shadow-[0_0_15px_rgba(197,160,89,0.3)]'
												: 'border-white/10 bg-white/5 text-white hover:border-white/40'}"
											>{age}</button
										>
									{/each}
								</div>
							</div>

							<div class="border-t border-white/10 pt-8">
								<label class="group flex cursor-pointer items-center gap-5">
									<div class="relative">
										<input type="checkbox" bind:checked={rememberMe} class="peer hidden" />
										<div
											class="h-6 w-12 rounded-full border border-white/5 bg-white/10 peer-checked:bg-[#C5A059]/40"
										></div>
										<div
											class="absolute top-1 left-1 h-4 w-4 rounded-full bg-white/60 transition-all peer-checked:translate-x-6 peer-checked:bg-[#C5A059]"
										></div>
									</div>
									<div class="flex flex-col">
										<span
											class="text-[12px] font-black tracking-widest text-white/70 uppercase transition-colors group-hover:text-white"
											>Remember Me</span
										>
										<span class="text-[10px] font-bold tracking-tighter text-[#C5A059] uppercase"
											>Save details locally</span
										>
									</div>
								</label>
							</div>
						</div>
					{:else if currentStep === 2}
						<div in:fade class="space-y-12">
							<h3 class="text-[13px] font-black tracking-[0.3em] text-white/60 uppercase">
								02. Body Intelligence
							</h3>
							<div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
								{#each healthOptions as option}
									<label
										class="group flex cursor-pointer items-center gap-4 border border-white/10 bg-white/[0.03] p-5 transition-all hover:border-[#C5A059]"
									>
										<input
											type="checkbox"
											bind:group={localUser.healthHistory}
											value={option}
											class="h-5 w-5 accent-[#C5A059]"
										/>
										<span
											class="text-[11px] font-black tracking-tight text-white/70 uppercase group-hover:text-white"
											>{option}</span
										>
									</label>
								{/each}
							</div>
							<div class="space-y-4">
								<label class="text-[12px] font-black tracking-widest text-white/50 uppercase"
									>Medical Notes</label
								>
								<textarea
									bind:value={localUser.medications}
									rows="5"
									class="w-full border border-white/20 bg-white/5 p-5 text-xl font-light text-white transition-colors outline-none focus:border-[#C5A059]"
									placeholder="List medications or restrictions..."
								></textarea>
							</div>
						</div>
					{:else if currentStep === 3}
						<div in:fade class="space-y-10">
							<h3 class="text-[13px] font-black tracking-[0.3em] text-white/60 uppercase">
								03. Track Preference
							</h3>
							<div
								class="border border-[#C5A059]/40 bg-black p-6 text-center shadow-[inset_0_0_20px_rgba(197,160,89,0.1)]"
							>
								<p class="text-base font-black tracking-widest text-[#C5A059] uppercase italic">
									{activeDescription || 'Curriculum details will appear here'}
								</p>
							</div>
							<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
								{#each interests as item}
									<label
										onmouseenter={() => (activeDescription = item.desc)}
										onmouseleave={() => (activeDescription = '')}
										class="group flex cursor-pointer items-center justify-between border border-white/10 bg-white/5 px-8 py-6 transition-all hover:border-[#C5A059]"
									>
										<span class="text-lg font-medium text-white group-hover:text-[#C5A059]"
											>{item.name}</span
										>
										<input
											type="checkbox"
											bind:group={localUser.interest}
											value={item.name}
											class="h-6 w-6 accent-[#C5A059]"
										/>
									</label>
								{/each}
							</div>
						</div>
					{:else if currentStep === 4}
						<div in:fade class="space-y-12 py-6 text-center">
							<div class="space-y-8 border border-white/10 bg-white/[0.02] p-10 shadow-2xl">
								<div class="mx-auto h-64 w-64 bg-white p-4 shadow-inner">
									<img
										src="/images/payqrcodeimage.jpeg"
										alt="QR"
										class="h-full w-full object-contain"
									/>
								</div>
								<div class="space-y-3">
									<p class="font-serif text-7xl tracking-tighter text-white">
										{localUser.location === 'India' ? '₹500' : '$15'}
									</p>
									<button
										type="button"
										onclick={() => copyToClipboard('alamelustudio27@okicici')}
										class="text-sm font-black tracking-[0.3em] text-[#C5A059] hover:text-white"
										>ALAMELUSTUDIO27@OKICICI 📋</button
									>
								</div>
							</div>
							<div class="space-y-4">
								<a
									href="https://wa.me/918907845234?text={encodeURIComponent(
										'Namaste, I am ' + localUser.name + '. I have paid registration fee.'
									)}"
									target="_blank"
									class="flex w-full items-center justify-center gap-4 bg-[#C5A059] py-6 text-sm font-black text-black uppercase shadow-xl transition-all hover:bg-white"
									>✅ I HAVE PAID (WHATSAPP CONFIRM)</a
								>
								<p class="text-[12px] font-black tracking-widest text-[#C5A059] uppercase">
									A screenshot is required for confirmation
								</p>
							</div>
						</div>
					{:else if currentStep === 5}
						<div in:fade class="space-y-12">
							<h3 class="text-[13px] font-black tracking-[0.3em] text-white/60 uppercase">
								05. Waiver & Consent
							</h3>
							<div
								class="h-80 space-y-6 overflow-y-auto border border-white/20 bg-black p-8 text-base leading-relaxed text-white/80 shadow-inner"
							>
								<p>
									<strong class="text-[#C5A059] uppercase">Medical Clearance:</strong> I confirm I have
									consulted with my Doctor and have permission to participate.
								</p>
								<p>
									<strong class="text-[#C5A059] uppercase">Liability:</strong> I agree that Anvaya Collectives
									shall NOT be held liable for any injury during participation.
								</p>
							</div>
							<div
								class="border-b border-white/30 pb-3 transition-colors focus-within:border-[#C5A059]"
							>
								<label
									class="mb-1 block text-[12px] font-black tracking-widest text-white/50 uppercase"
									>Digital Signature</label
								>
								<input
									type="text"
									bind:value={localUser.signature}
									required
									class="w-full bg-transparent py-3 font-serif text-4xl text-white italic outline-none"
									placeholder="Type Full Name"
								/>
							</div>
						</div>
					{/if}

					<div class="mt-auto flex items-center justify-between border-t border-white/10 pt-12">
						{#if currentStep > 1}
							<button
								type="button"
								onclick={() => goToStep(currentStep - 1)}
								class="py-4 text-sm font-black tracking-[0.3em] text-white uppercase transition-colors hover:text-[#C5A059]"
								>← Back</button
							>
						{:else}<div></div>{/if}

						{#if currentStep < totalSteps}
							<button
								type="button"
								onclick={() => goToStep(currentStep + 1)}
								class="bg-white px-14 py-6 text-sm font-black tracking-[0.3em] text-black uppercase shadow-xl transition-all hover:bg-[#C5A059]"
								>Continue →</button
							>
						{:else}
							<button
								type="submit"
								disabled={isSubmitting}
								class="bg-[#C5A059] px-16 py-6 text-sm font-black tracking-[0.3em] text-black uppercase shadow-xl transition-all hover:bg-white disabled:opacity-50"
								>Finalize Inquiry</button
							>
						{/if}
					</div>
				</form>
			{/if}
		</div>
	</div>
</div>

<style>
	:global(body) {
		background-color: #070707;
		-webkit-font-smoothing: antialiased;
	}
	.font-serif {
		font-family: 'Cinzel', serif;
	}
</style>
