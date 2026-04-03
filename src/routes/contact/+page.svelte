<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation'; // Added for cookie syncing
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let isEditing = $state(false);
	let isSubmitting = $state(false);
	let selectedLocation = $state('India');
	let rememberMe = $state(true);

	let localUser = $state<{
		name: string;
		phone: string;
		ageGroup?: string;
		location?: string;
		interest?: string;
	} | null>(null);

	let currentUser = $derived(data?.userInquiry || localUser);

	const interests = [
		'✨ Choreography',
		'💃 Active Track (Standing)',
		'🪑 Chair Natyam (Seated)',
		'📜 Natya Sastra',
		'📖 Storytelling',
		'🎵 Music',
		'➕ Others'
	];

	const ageGroups = ['5-10', '10-20', '20-30', '40-50', '51-60', '61-70', '71+'];

	onMount(() => {
		const saved = localStorage.getItem('user_profile_backup');
		if (saved) {
			localUser = JSON.parse(saved);
			if (localUser?.location) selectedLocation = localUser.location;
			rememberMe = true;
		}
	});

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		isSubmitting = true;

		const formElement = event.currentTarget as HTMLFormElement;
		const formData = new FormData(formElement);

		// FIX: Explicitly send the rememberMe state to the server
		formData.append('rememberMe', rememberMe ? 'on' : 'off');

		const profile = {
			name: formData.get('name') as string,
			phone: formData.get('mobile') as string,
			location: formData.get('location') as string,
			ageGroup: formData.get('ageGroup') as string,
			interest: formData.getAll('interest').join(', ')
		};

		// 1. Handle LocalStorage
		if (rememberMe) {
			localStorage.setItem('user_profile_backup', JSON.stringify(profile));
		} else {
			localStorage.removeItem('user_profile_backup');
		}

		// 2. Send to Server Action
		try {
			const response = await fetch(formElement.action, {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				// If user didn't want to be remembered, clear local state immediately
				if (!rememberMe) {
					localUser = null;
				} else {
					localUser = profile;
				}

				// Re-run the 'load' function to sync server data/cookies
				await invalidateAll();

				setTimeout(() => {
					isSubmitting = false;
					isEditing = false;
				}, 500);
			}
		} catch (e) {
			console.error('Submission failed', e);
			isSubmitting = false;
		}
	}

	function validateMobile(event: Event) {
		const input = event.target as HTMLInputElement;
		input.value = input.value.replace(/[^\d+]/g, '');
	}

	// New function to handle manual logout
	async function handleLogout() {
		localStorage.removeItem('user_profile_backup');
		localUser = null;
		// This will trigger the logout action in page.server.ts
	}
</script>

<div
	class="relative flex min-h-screen w-full flex-col bg-[#070707] font-sans text-white md:flex-row"
>
	<div
		class="relative h-[45vh] w-full shrink-0 overflow-hidden md:sticky md:top-0 md:h-screen md:w-1/2"
	>
		<img
			src="/images/background-hero.jpg"
			alt="Dancer"
			class="h-full w-full object-cover object-top brightness-90"
		/>
		<div
			class="absolute inset-0 bg-gradient-to-t from-[#070707] via-transparent md:bg-gradient-to-r md:from-[#070707]"
		></div>
	</div>

	<div class="flex w-full flex-col items-center px-8 py-16 md:w-1/2 md:px-20 md:py-24">
		<div class="w-full max-w-lg">
			<header class="mb-16">
				<h1 class="font-serif text-5xl tracking-tight text-[#C5A059] italic md:text-6xl">
					{currentUser && !isEditing ? 'Your Profile' : 'Anvaya Collectives'}
				</h1>
				<p class="mt-4 text-[12px] font-bold tracking-[0.5em] text-white/50 uppercase">
					Connect with us
				</p>
			</header>

			{#if currentUser && !isEditing}
				<div in:fade class="space-y-12 border border-white/10 bg-white/[0.03] p-10 shadow-xl">
					<div class="border-b border-white/10 pb-8">
						<p class="mb-2 text-[11px] font-bold tracking-widest text-[#C5A059] uppercase">
							Contact Details
						</p>
						<h2 class="text-3xl font-light tracking-tight text-white">Stored Information</h2>
					</div>

					<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
						<div class="space-y-1">
							<p class="text-xs tracking-wider text-white/40 uppercase">Full Name</p>
							<p class="text-lg text-white">{currentUser.name || 'N/A'}</p>
						</div>
						<div class="space-y-1">
							<p class="text-xs tracking-wider text-white/40 uppercase">WhatsApp Number</p>
							<p class="text-lg text-white">+91 {currentUser.phone || 'N/A'}</p>
						</div>
					</div>

					<div class="flex gap-4 pt-6">
						<button
							onclick={() => (isEditing = true)}
							class="border border-[#C5A059] px-8 py-3 text-xs tracking-widest text-[#C5A059] uppercase transition-all duration-300 hover:bg-[#C5A059] hover:text-black"
						>
							Edit Details
						</button>

						<form method="POST" action="?/logout" onsubmit={handleLogout}>
							<button
								type="submit"
								class="border border-white/10 px-8 py-3 text-xs tracking-widest text-white/40 uppercase transition-all duration-300 hover:bg-white/5"
							>
								Forget Me
							</button>
						</form>
					</div>
				</div>
			{:else}
				<form method="POST" action="?/submit" onsubmit={handleSubmit} class="space-y-10" in:fade>
					<div
						class="group relative border-b border-white/20 pb-2 transition-colors focus-within:border-[#C5A059]"
					>
						<label
							for="name"
							class="block text-[10px] font-bold tracking-widest text-white/40 uppercase group-focus-within:text-[#C5A059]"
							>Full Name</label
						>
						<input
							type="text"
							name="name"
							id="name"
							required
							value={currentUser?.name || ''}
							class="w-full bg-transparent py-3 text-xl font-light outline-none placeholder:text-white/10"
							placeholder="Your Name"
						/>
					</div>

					<div
						class="group relative border-b border-white/20 pb-2 transition-colors focus-within:border-[#C5A059]"
					>
						<label
							for="mobile"
							class="block text-[10px] font-bold tracking-widest text-white/40 uppercase group-focus-within:text-[#C5A059]"
							>WhatsApp Number</label
						>
						<div class="flex items-center gap-3">
							<span class="text-2xl font-light text-[#C5A059]">+91</span>
							<input
								type="tel"
								name="mobile"
								id="mobile"
								required
								oninput={validateMobile}
								value={currentUser?.phone?.replace('+91', '') || ''}
								class="w-full bg-transparent py-3 text-xl font-light outline-none placeholder:text-white/10"
								placeholder="98765 43210"
							/>
						</div>
					</div>

					<div class="grid grid-cols-1 gap-10 md:grid-cols-2">
						<div class="space-y-4">
							<label
								for="location"
								class="block text-[10px] font-bold tracking-widest text-white/40 uppercase"
								>Region</label
							>
							<select
								name="location"
								bind:value={selectedLocation}
								class="w-full border border-white/10 bg-white/5 p-4 text-sm outline-none focus:border-[#C5A059]"
							>
								<option value="India">🇮🇳 Inside India</option>
								<option value="Outside">🌍 Outside India</option>
							</select>
						</div>

						<div class="space-y-4">
							<label class="block text-[10px] font-bold tracking-widest text-white/40 uppercase"
								>Age Group</label
							>
							<div class="grid grid-cols-3 gap-2">
								{#each ageGroups as age}
									<label class="cursor-pointer">
										<input
											type="radio"
											name="ageGroup"
											value={age}
											class="peer hidden"
											checked={currentUser?.ageGroup === age}
										/>
										<span
											class="flex items-center justify-center border border-white/10 bg-white/5 py-2 text-[10px] text-white/40 transition-all peer-checked:border-[#C5A059] peer-checked:bg-[#C5A059]/10 peer-checked:text-[#C5A059]"
										>
											{age}
										</span>
									</label>
								{/each}
							</div>
						</div>
					</div>

					<div class="space-y-6">
						<label class="block text-[10px] font-bold tracking-widest text-white/40 uppercase"
							>Track & Mode</label
						>
						<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
							{#each interests as item}
								<label
									class="group flex cursor-pointer items-center justify-between border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10"
								>
									<span class="text-sm font-light text-white/70 group-hover:text-white">{item}</span
									>
									<input
										type="checkbox"
										name="interest"
										value={item}
										class="accent-[#C5A059]"
										checked={currentUser?.interest?.includes(item)}
									/>
								</label>
							{/each}
						</div>
					</div>

					<div class="flex items-center gap-4 py-4">
						<label class="relative inline-flex cursor-pointer items-center">
							<input type="checkbox" bind:checked={rememberMe} class="peer hidden" />
							<div
								class="h-6 w-11 rounded-full bg-white/10 transition-colors peer-checked:bg-[#C5A059]/40"
							></div>
							<div
								class="absolute top-1 left-1 h-4 w-4 rounded-full bg-white/40 transition-all peer-checked:translate-x-5 peer-checked:bg-[#C5A059]"
							></div>
						</label>
						<span class="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">
							Remember Me
						</span>
					</div>

					<div class="pt-6">
						<button
							type="submit"
							disabled={isSubmitting}
							class="w-full bg-[#C5A059] py-5 text-[11px] font-bold tracking-[0.3em] text-black uppercase transition-transform active:scale-[0.98] disabled:opacity-50"
						>
							{isSubmitting ? 'Sending...' : 'Submit Inquiry'}
						</button>
					</div>
				</form>
			{/if}
		</div>
	</div>
</div>

<style>
	:global(body) {
		background-color: #070707;
	}
</style>
