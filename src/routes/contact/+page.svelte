<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let isEditing = $state(false);
	let isSubmitting = $state(false);

	// Local fallback interface updated to include all fields
	let localUser = $state<{
		name: string;
		email: string;
		ageGroup?: string;
		interest?: string;
		message?: string;
	} | null>(null);

	const interests = [
		'Choreography',
		'Bharatanatyam (Kalashetra Style)',
		'Natya Sastra',
		'Storytelling',
		'Music',
		'Others'
	];

	onMount(() => {
		const saved = localStorage.getItem('user_profile_backup');
		if (saved) {
			localUser = JSON.parse(saved);
		}
	});

	function saveLocally(event: Event) {
		isSubmitting = true;
		const formData = new FormData(event.target as HTMLFormElement);
		const rememberMe = formData.get('rememberMe') === 'on';

		if (rememberMe) {
			const profile = {
				name: formData.get('name') as string,
				email: formData.get('mobile') as string,
				ageGroup: formData.get('ageGroup') as string,
				message: formData.get('message') as string,
				interest: formData.getAll('interest').join(', ')
			};
			localStorage.setItem('user_profile_backup', JSON.stringify(profile));
		}
	}

	function handleLogout() {
		localStorage.removeItem('user_profile_backup');
		window.location.href = '/contact';
	}

	function validateMobile(event: Event) {
		const input = event.target as HTMLInputElement;
		input.value = input.value.replace(/\D/g, '');
	}
</script>

<div
	class="relative flex min-h-screen w-full flex-col bg-[#121212] font-sans text-white md:flex-row"
>
	{#if form?.success}
		<div
			transition:fade
			class="fixed inset-0 z-[500] flex items-center justify-center bg-black/95 px-6 backdrop-blur-xl"
		>
			<div
				transition:fly={{ y: 20 }}
				class="w-full max-w-sm border border-[#C5A059]/30 bg-[#1A1A1A] p-8 text-center shadow-2xl"
			>
				<div class="mb-6 flex justify-center">
					<div
						class="flex h-16 w-16 items-center justify-center rounded-full border border-[#C5A059] text-[#C5A059]"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-8 w-8"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M5 13l4 4L19 7"
							/></svg
						>
					</div>
				</div>
				<h2 class="font-serif text-3xl text-white italic">Inquiry Received</h2>
				<button
					onclick={() => window.location.reload()}
					class="mt-10 block w-full bg-[#C5A059] py-4 text-[10px] font-black tracking-[0.3em] text-black uppercase transition-colors hover:bg-white"
				>
					View My Profile
				</button>
			</div>
		</div>
	{/if}

	<div
		class="relative order-first h-[35vh] w-full overflow-hidden md:order-last md:h-screen md:w-1/2"
	>
		<img
			src="/images/background-hero.jpg"
			alt="Dancer"
			class="h-full w-full object-cover object-[50%_15%] brightness-[0.5] md:brightness-[0.7]"
		/>
		<div
			class="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent md:bg-gradient-to-r md:from-[#121212] md:to-transparent"
		></div>
	</div>

	<div class="flex w-full flex-col items-center px-6 py-10 md:w-1/2 md:px-12 md:py-20">
		<div class="w-full max-w-md">
			<div class="mb-10 text-center md:text-left">
				{#if (data?.userInquiry || localUser) && !isEditing}
					<h1 class="font-serif text-4xl text-[#C5A059] italic md:text-5xl">Your Profile</h1>
				{:else}
					<h1 class="font-serif text-4xl tracking-tight text-white italic md:text-5xl">
						Get In Touch
					</h1>
				{/if}
			</div>

			{#if (data?.userInquiry || localUser) && !isEditing}
				{@const user = data?.userInquiry || localUser}
				<div in:fade class="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl md:p-8">
					<div class="space-y-6">
						<div class="flex items-start justify-between">
							<div>
								<p class="text-[9px] font-bold tracking-widest text-gray-500 uppercase">
									Full Name
								</p>
								<p class="font-serif text-xl text-white">{user.name}</p>
							</div>
							<div class="text-right">
								<p class="text-[9px] font-bold tracking-widest text-gray-500 uppercase">
									Age Group
								</p>
								<p class="text-xs font-bold text-[#C5A059]">{user.ageGroup || '—'}</p>
							</div>
						</div>

						<div>
							<p class="text-[9px] font-bold tracking-widest text-gray-500 uppercase">WhatsApp</p>
							<p class="text-lg text-white">+91 {user.email}</p>
						</div>

						<div>
							<p class="mb-3 text-[9px] font-bold tracking-widest text-gray-500 uppercase">
								Interests
							</p>
							<div class="flex flex-wrap gap-2">
								{#if user.interest}
									{#each user.interest.split(', ') as item}
										<span
											class="rounded-full border border-[#C5A059]/30 bg-[#C5A059]/10 px-3 py-1 text-[8px] font-bold tracking-tighter text-[#C5A059] uppercase"
										>
											{item}
										</span>
									{/each}
								{:else}
									<span class="text-[10px] text-gray-600 italic">No interests selected</span>
								{/if}
							</div>
						</div>

						{#if user.message}
							<div class="rounded-lg border-l-2 border-[#C5A059] bg-black/20 p-4">
								<p class="mb-1 text-[9px] font-bold tracking-widest text-gray-500 uppercase">
									Your Message
								</p>
								<p class="text-xs leading-relaxed text-gray-300 italic">"{user.message}"</p>
							</div>
						{/if}

						<div class="space-y-4 pt-4">
							<button
								onclick={() => (isEditing = true)}
								class="w-full border border-gray-700 py-4 text-[10px] font-bold tracking-widest text-gray-400 uppercase transition-all hover:border-[#C5A059] hover:text-[#C5A059]"
							>
								Update Details
							</button>
							<button
								onclick={handleLogout}
								class="w-full text-[9px] tracking-tighter text-gray-600 uppercase underline transition-colors hover:text-red-400"
							>
								Sign Out / Clear Device
							</button>
						</div>
					</div>
				</div>
			{:else}
				<form
					method="POST"
					action="?/submit"
					onsubmit={saveLocally}
					class="space-y-8 {isSubmitting ? 'pointer-events-none opacity-50' : ''}"
				>
					<div class="space-y-2">
						<label class="block text-[11px] font-bold tracking-widest text-gray-200 uppercase"
							>Full Name</label
						>
						<input
							name="name"
							type="text"
							value={data?.userInquiry?.name || localUser?.name || ''}
							required
							class="w-full border-b border-gray-600 bg-transparent py-3 text-lg transition-colors outline-none focus:border-[#C5A059]"
						/>
					</div>

					<div class="space-y-2">
						<label class="block text-[11px] font-bold tracking-widest text-gray-200 uppercase"
							>WhatsApp</label
						>
						<div
							class="flex items-stretch overflow-hidden rounded-lg border border-gray-600 transition-colors focus-within:border-[#C5A059]"
						>
							<div class="flex items-center bg-white/5 px-4 font-bold text-[#C5A059]">+91</div>
							<input
								name="mobile"
								type="tel"
								maxlength="10"
								value={data?.userInquiry?.email || localUser?.email || ''}
								required
								oninput={validateMobile}
								class="w-full bg-transparent px-4 py-3 text-lg outline-none"
							/>
						</div>
					</div>

					<div class="space-y-3">
						<label class="block text-[11px] font-bold tracking-widest text-gray-200 uppercase"
							>Age Group</label
						>
						<div class="flex flex-wrap gap-2">
							{#each ['6-12', '13-21', '22-30', '31-40', '40+'] as age}
								<label class="min-w-[60px] flex-1">
									<input
										type="radio"
										name="ageGroup"
										value={age}
										class="peer sr-only"
										required
										checked={data?.userInquiry?.ageGroup === age || localUser?.ageGroup === age}
									/>
									<span
										class="block cursor-pointer rounded-full border border-gray-600 py-2 text-center text-[10px] text-gray-400 transition-all peer-checked:border-[#C5A059] peer-checked:text-[#C5A059]"
										>{age}</span
									>
								</label>
							{/each}
						</div>
					</div>

					<div class="space-y-4">
						<label class="block text-[11px] font-bold tracking-widest text-gray-200 uppercase"
							>Interests</label
						>
						<div class="grid grid-cols-2 gap-2">
							{#each interests as item}
								<label class="cursor-pointer">
									<input
										type="checkbox"
										name="interest"
										value={item}
										class="peer sr-only"
										checked={data?.userInquiry?.interest?.includes(item) ||
											localUser?.interest?.includes(item)}
									/>
									<span
										class="block border border-gray-600 px-3 py-2 text-center text-[9px] text-gray-400 uppercase transition-all peer-checked:border-[#C5A059] peer-checked:bg-[#C5A059] peer-checked:text-black"
										>{item}</span
									>
								</label>
							{/each}
						</div>
					</div>

					<div class="space-y-2">
						<label class="block text-[11px] font-bold tracking-widest text-gray-200 uppercase"
							>Your Message</label
						>
						<textarea
							name="message"
							rows="3"
							class="w-full border-b border-gray-600 bg-transparent py-3 text-lg transition-colors outline-none focus:border-[#C5A059]"
							placeholder="Tell us more about your background..."
							>{data?.userInquiry?.message || localUser?.message || ''}</textarea
						>
					</div>

					<div class="flex items-center gap-3">
						<label class="relative inline-flex cursor-pointer items-center">
							<input type="checkbox" name="rememberMe" class="peer sr-only" checked />
							<div
								class="h-5 w-9 rounded-full border border-gray-600 transition-all peer-checked:bg-[#C5A059]/20 after:absolute after:top-[4px] after:left-[4px] after:h-3 after:w-3 after:rounded-full after:bg-gray-500 peer-checked:after:translate-x-4 peer-checked:after:bg-[#C5A059]"
							></div>
						</label>
						<span class="text-[10px] font-bold tracking-widest text-gray-400 uppercase"
							>Remember me</span
						>
					</div>

					<button
						type="submit"
						disabled={isSubmitting}
						class="w-full bg-[#C5A059] py-4 text-[11px] font-black tracking-[0.2em] text-black uppercase transition-all hover:bg-white active:scale-[0.98] disabled:bg-gray-800"
					>
						{isSubmitting ? 'Sending...' : 'Submit Inquiry'}
					</button>
				</form>
			{/if}
		</div>
	</div>
</div>

<style>
	/* Custom scrollbar for the form section if needed */
	:global(.custom-scrollbar::-webkit-scrollbar) {
		width: 3px;
	}
	:global(.custom-scrollbar::-webkit-scrollbar-thumb) {
		background: #c5a05933;
		border-radius: 10px;
	}
</style>
