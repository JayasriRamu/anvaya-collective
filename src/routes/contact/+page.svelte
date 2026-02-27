<script lang="ts">
	import { fly } from 'svelte/transition';
	let { form } = $props();

	function validateMobile(event: Event) {
		const input = event.target as HTMLInputElement;
		input.value = input.value.replace(/\D/g, '');
		input.reportValidity();
	}
</script>

<div class="relative flex min-h-screen w-full bg-[#121212] font-sans">
	<div class="flex w-full items-center justify-center px-8 py-20 md:w-[45%]">
		<div class="w-full max-w-lg">
			<h1 class="mb-2 font-serif text-4xl text-white">Masterclass Inquiry</h1>
			<p class="mb-16 text-sm text-gray-500">Please fill in your details to start your journey.</p>

			{#if form?.success}
				<div
					in:fly={{ y: 20 }}
					class="rounded-lg border border-blue-500/50 bg-blue-500/10 p-8 text-center"
				>
					<h2 class="font-serif text-2xl text-white">Thank you</h2>
					<p class="text-sm text-gray-300">Your inquiry has been received.</p>
				</div>
			{:else}
				<form method="POST" class="space-y-10">
					<div class="space-y-3">
						<label
							for="name"
							class="block text-[11px] font-bold tracking-widest text-white uppercase"
							>Full Name</label
						>
						<input
							id="name"
							name="name"
							type="text"
							required
							class="w-full border-b border-gray-600 bg-transparent py-4 text-lg text-white placeholder-gray-700 transition-all outline-none focus:border-blue-500"
							placeholder="Enter your full name"
						/>
					</div>

					<div class="space-y-3">
						<label
							for="mobile"
							class="block text-[11px] font-bold tracking-widest text-white uppercase"
							>WhatsApp</label
						>
						<div class="flex items-center border-b border-gray-600 focus-within:border-blue-500">
							<span class="text-lg text-gray-400">+91</span>
							<input
								id="mobile"
								name="mobile"
								type="tel"
								maxlength="10"
								required
								on:input={validateMobile}
								class="w-full bg-transparent py-4 pl-3 text-lg text-white outline-none"
								placeholder="00000 00000"
							/>
						</div>
					</div>

					<div class="space-y-4">
						<label class="block text-[11px] font-bold tracking-widest text-white uppercase"
							>Age Group</label
						>
						<div class="flex flex-nowrap gap-2">
							{#each ['6-12', '13-21', '22-30', '31-40', '40+'] as age}
								<label class="relative flex-1">
									<input type="radio" name="ageGroup" value={age} class="peer sr-only" required />
									<span
										class="block cursor-pointer rounded-full border border-gray-600 bg-white/5 px-2 py-3 text-center text-xs font-bold text-white transition-all peer-checked:border-blue-500 peer-checked:bg-blue-500 hover:border-blue-400"
									>
										{age}
									</span>
								</label>
							{/each}
						</div>
					</div>

					<div class="space-y-3">
						<label
							for="interest"
							class="block text-[11px] font-bold tracking-widest text-white uppercase"
							>Focus Area</label
						>
						<select
							id="interest"
							name="interest"
							required
							class="w-full border-b border-gray-600 bg-transparent py-4 text-lg text-white outline-none focus:border-blue-500"
						>
							<option value="" disabled selected class="bg-[#121212]">Select Area</option>
							<option value="Solo Performance Depth" class="bg-[#121212]"
								>Solo Performance Depth</option
							>
							<option value="Natya Shastra" class="bg-[#121212]">Natya Shastra</option>
							<option value="Karnas" class="bg-[#121212]">Karnas</option>
							<option value="Others" class="bg-[#121212]">Others</option>
						</select>
					</div>

					<div class="space-y-3">
						<label
							for="message"
							class="block text-[11px] font-bold tracking-widest text-white uppercase"
							>Message</label
						>
						<textarea
							id="message"
							name="message"
							rows="3"
							class="w-full border-b border-gray-600 bg-transparent py-4 text-lg text-white outline-none focus:border-blue-500"
							placeholder="Tell us more..."
						></textarea>
					</div>

					<button
						type="submit"
						class="w-full bg-blue-500 py-5 text-sm font-bold tracking-[0.2em] text-white uppercase transition-all hover:bg-blue-600"
					>
						Submit Inquiry
					</button>
				</form>
			{/if}
		</div>
	</div>

	<div class="relative hidden w-[55%] overflow-hidden md:block">
		<img
			src="/images/background-hero.jpg"
			alt="Dancer"
			class="h-full w-full object-cover opacity-80"
		/>
		<div
			class="absolute inset-0 bg-gradient-to-r from-[#121212] via-transparent to-transparent"
		></div>
	</div>
</div>
