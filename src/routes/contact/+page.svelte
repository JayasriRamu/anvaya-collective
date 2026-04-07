<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let isEditing = $state(false);
	let isSubmitting = $state(false);
	let selectedLocation = $state('India');
	let rememberMe = $state(true);
	let activeDescription = $state('');

	let localUser = $state<{
		name: string;
		phone: string;
		ageGroup?: string;
		location?: string;
		interest?: string;
	} | null>(null);

	let currentUser = $derived(data?.userInquiry || localUser);

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
		formData.append('rememberMe', rememberMe ? 'on' : 'off');

		const profile = {
			name: formData.get('name') as string,
			phone: formData.get('mobile') as string,
			location: formData.get('location') as string,
			ageGroup: formData.get('ageGroup') as string,
			interest: formData.getAll('interest').join(', ')
		};

		if (rememberMe) {
			localStorage.setItem('user_profile_backup', JSON.stringify(profile));
		} else {
			localStorage.removeItem('user_profile_backup');
		}

		try {
			const response = await fetch(formElement.action, {
				method: 'POST',
				body: formData
			});
			if (response.ok) {
				if (!rememberMe) {
					localUser = null;
				} else {
					localUser = profile;
				}
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

	let showCopyToast = $state(false);
	function copyToClipboard(text: string) {
		navigator.clipboard.writeText(text).then(() => {
			showCopyToast = true;
			setTimeout(() => {
				showCopyToast = false;
			}, 2000);
		});
	}

	async function handleLogout() {
		localStorage.removeItem('user_profile_backup');
		localUser = null;
	}
</script>

<div
	class="relative flex min-h-screen w-full flex-col bg-[#070707] font-sans text-white md:flex-row"
>
	<div
		class="relative h-[40vh] w-full shrink-0 overflow-hidden md:sticky md:top-0 md:h-screen md:w-[35%]"
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

	<div class="flex w-full flex-col items-center px-8 py-16 md:w-[65%] md:px-20 md:py-24">
		<div class="w-full max-w-5xl">
			<header class="mb-16 md:mb-20">
				<h1 class="font-serif text-5xl tracking-tight text-[#C5A059] italic md:text-8xl">
					{currentUser && !isEditing ? 'Your Profile' : 'Anvaya Collectives'}
				</h1>
				<p class="mt-4 text-[12px] font-bold tracking-[0.5em] text-white/50 uppercase">
					Bio-Somatic Workshop Inquiry
				</p>
			</header>

			{#if currentUser && !isEditing}
				<div
					in:fade
					class="mx-auto max-w-lg space-y-12 border border-white/10 bg-white/[0.03] p-10 shadow-xl"
				>
					<div class="border-b border-white/10 pb-8">
						<p class="mb-2 text-[11px] font-bold tracking-widest text-[#C5A059] uppercase">
							Stored Details
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
							>Edit Details</button
						>
						<form method="POST" action="?/logout" onsubmit={handleLogout}>
							<button
								type="submit"
								class="border border-white/10 px-8 py-3 text-xs tracking-widest text-white/40 uppercase transition-all duration-300 hover:bg-white/5"
								>Forget Me</button
							>
						</form>
					</div>
				</div>
			{:else}
				<form
					method="POST"
					action="?/submit"
					onsubmit={handleSubmit}
					class="space-y-16 md:space-y-24"
					in:fade
				>
					<div in:fly={{ y: 20, delay: 100 }} class="space-y-8">
						<div class="flex items-center gap-3">
							<span class="text-[12px] font-black tracking-[0.3em] text-[#C5A059] uppercase"
								>01</span
							>
							<h3 class="text-[12px] font-bold tracking-[0.3em] text-white/50 uppercase">
								Identity & Connection
							</h3>
							<div class="h-[1px] flex-grow bg-white/10"></div>
						</div>

						<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
							<div
								class="group relative border-b border-white/20 pb-2 transition-colors focus-within:border-[#C5A059]"
							>
								<label
									for="name"
									class="block text-[12px] font-bold tracking-widest text-white/60 uppercase group-focus-within:text-[#C5A059]"
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
									class="block text-[12px] font-bold tracking-widest text-white/60 uppercase group-focus-within:text-[#C5A059]"
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
						</div>

						<div class="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
							<div class="space-y-2">
								<label
									for="location"
									class="block text-[12px] font-bold tracking-widest text-white/60 uppercase"
									>Region of Residence</label
								>
								<p class="text-xs tracking-wide text-white/30">
									Determines applicable fee and scheduling.
								</p>
							</div>
							<select
								name="location"
								bind:value={selectedLocation}
								class="w-full cursor-pointer border border-white/10 bg-white/5 p-4 text-sm outline-none focus:border-[#C5A059]"
							>
								<option value="India">🇮🇳 Inside India</option>
								<option value="Outside">🌍 Outside India</option>
							</select>
						</div>
					</div>

					<div in:fly={{ y: 20, delay: 200 }} class="space-y-8">
						<div class="flex items-center gap-3">
							<span class="text-[12px] font-black tracking-[0.3em] text-[#C5A059] uppercase"
								>02</span
							>
							<h3 class="text-[12px] font-bold tracking-[0.3em] text-white/50 uppercase">
								Biography & Alignment
							</h3>
							<div class="h-[1px] flex-grow bg-white/10"></div>
						</div>

						<div class="space-y-4">
							<label class="block text-[12px] font-bold tracking-widest text-white/60 uppercase"
								>Age Group</label
							>
							<div class="grid grid-cols-4 gap-2 md:grid-cols-7">
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
											class="flex h-10 items-center justify-center border border-white/10 bg-white/[0.02] text-[10px] font-bold tracking-widest text-white/40 transition-all duration-300 peer-checked:border-[#C5A059] peer-checked:bg-[#C5A059]/10 peer-checked:text-[#C5A059] hover:border-white/20"
											>{age}</span
										>
									</label>
								{/each}
							</div>
						</div>

						<div class="space-y-6">
							<label class="block text-[12px] font-bold tracking-widest text-white/60 uppercase"
								>Bio-Somatic Track & Mode</label
							>
							<div
								class="flex min-h-[50px] items-center justify-center border border-[#C5A059]/10 bg-[#C5A059]/5 px-6 py-3 text-center transition-all duration-300"
							>
								{#if activeDescription}
									<p
										in:fade={{ duration: 150 }}
										class="text-[12px] font-bold tracking-wide text-[#C5A059] italic"
									>
										{activeDescription}
									</p>
								{:else}
									<p in:fade class="text-[9px] tracking-[0.3em] text-white/20 uppercase">
										Hover over a track for curriculum details
									</p>
								{/if}
							</div>
							<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
								{#each interests as item}
									<label
										onmouseenter={() => (activeDescription = item.desc)}
										onmouseleave={() => (activeDescription = '')}
										class="group flex h-[64px] cursor-pointer items-center justify-between border border-white/10 bg-white/5 px-4 transition-all hover:border-[#C5A059]/40 hover:bg-[#C5A059]/10"
									>
										<span
											class="text-[13px] font-medium text-white/70 transition-colors group-hover:text-white"
											>{item.name}</span
										>
										<input
											type="checkbox"
											name="interest"
											value={item.name}
											class="h-4 w-4 cursor-pointer accent-[#C5A059]"
											checked={currentUser?.interest?.includes(item.name)}
										/>
									</label>
								{/each}
							</div>
						</div>
					</div>

					<div in:fly={{ y: 20, delay: 300 }} class="space-y-8">
						<div class="flex items-center gap-3">
							<span class="text-[12px] font-black tracking-[0.3em] text-[#C5A059] uppercase"
								>03</span
							>
							<h3 class="text-[12px] font-bold tracking-[0.3em] text-white/50 uppercase">
								Registration & Confirmation
							</h3>
							<div class="h-[1px] flex-grow bg-white/10"></div>
						</div>

						<div
							class="relative border border-white/5 bg-white/[0.01] p-8 transition-all hover:bg-white/[0.03] md:p-12"
						>
							<div class="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
								<div class="flex flex-col gap-2">
									<span class="text-[10px] font-bold tracking-widest text-white/20 uppercase"
										>Workshop Fee</span
									>
									<span class="font-serif text-5xl font-light text-white"
										>{selectedLocation === 'India' ? '₹500' : '$15'}</span
									>
								</div>
								<div class="max-w-lg flex-grow space-y-4 md:text-right">
									<div class="flex items-center justify-between md:justify-end md:gap-6">
										<p class="text-[9px] font-bold tracking-[0.2em] text-white/30 uppercase">
											UPI Transfer ID
										</p>
										<span class="text-[8px] font-bold tracking-widest text-[#C5A059] uppercase"
											>Tap to Copy</span
										>
									</div>
									<button
										type="button"
										onclick={() => copyToClipboard('alamelustudio27@okhdfcbank')}
										class="group relative flex w-full cursor-pointer items-center justify-center border-b-2 border-[#C5A059]/30 bg-black/60 py-6 transition-all hover:border-[#C5A059] hover:bg-black/80 md:w-auto md:px-10"
									>
										<code class="font-sans text-[15px] font-bold tracking-[0.1em] text-white"
											>alamelustudio27@okhdfcbank</code
										>
									</button>
								</div>
							</div>
						</div>
					</div>

					<div
						class="flex flex-col gap-8 border-t border-white/5 pt-12 md:flex-row md:items-center md:justify-between"
					>
						<div class="flex items-center gap-4">
							<label class="relative inline-flex cursor-pointer items-center">
								<input type="checkbox" bind:checked={rememberMe} class="peer hidden" />
								<div
									class="h-6 w-11 rounded-full bg-white/10 transition-colors peer-checked:bg-[#C5A059]/40"
								></div>
								<div
									class="absolute top-1 left-1 h-4 w-4 rounded-full bg-white/40 transition-all peer-checked:translate-x-5 peer-checked:bg-[#C5A059]"
								></div>
							</label>
							<div class="flex flex-col">
								<span class="text-[11px] font-bold tracking-[0.1em] text-white/50 uppercase"
									>Remember My Profile</span
								>
								<span class="text-[10px] font-medium tracking-wider text-[#C5A059]/60 uppercase"
									>Secure local storage</span
								>
							</div>
						</div>

						<button
							type="submit"
							disabled={isSubmitting}
							class="w-full bg-[#C5A059] px-16 py-6 text-[11px] font-bold tracking-[0.4em] text-black uppercase transition-all hover:bg-white active:scale-[0.98] disabled:opacity-50 md:w-auto"
						>
							{isSubmitting ? 'Syncing...' : 'Submit Inquiry'}
						</button>
					</div>
				</form>
			{/if}
		</div>
	</div>
</div>

{#if showCopyToast}
	<div
		transition:fade
		class="fixed bottom-10 left-1/2 z-[200] -translate-x-1/2 border border-[#C5A059]/30 bg-[#121212] px-8 py-4 shadow-2xl backdrop-blur-md"
	>
		<p class="text-[10px] font-bold tracking-[0.4em] text-[#C5A059] uppercase">UPI ID Copied</p>
	</div>
{/if}

<style>
	:global(body) {
		background-color: #070707;
		-webkit-font-smoothing: antialiased;
	}
	select option {
		background-color: #1a1a1a;
		color: white;
		padding: 12px;
	}
	select:focus {
		outline: none;
		border-color: #c5a059;
	}
	code {
		font-family: inherit;
	}
	.font-serif {
		font-family: 'Cinzel', serif;
	}
</style>
