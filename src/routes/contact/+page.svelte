<script lang="ts">
	import { fly } from 'svelte/transition';
	let { form } = $props();

	function validateMobile(event: Event) {
		const input = event.target as HTMLInputElement;
		input.value = input.value.replace(/\D/g, '');
		input.reportValidity();
	}
</script>

<div class="relative flex min-h-screen w-full bg-[#121212] font-sans text-white">
	<div class="flex w-full items-start justify-center px-8 pt-12 md:w-[45%] lg:px-20">
		<div class="w-full max-w-lg">
			<div class="mb-10">
				<h1 class="font-serif text-5xl tracking-tight text-white italic">Get In Touch</h1>
				<p class="mt-3 text-sm tracking-[0.2em] text-gray-500 uppercase">
					Start your artistic journey today.
				</p>
			</div>

			{#if form?.success}
				<div
					in:fly={{ y: 20 }}
					class="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-12 text-center"
				>
					<h2 class="mb-2 font-serif text-3xl text-white italic">Thank you</h2>
					<p class="text-sm tracking-wide text-gray-400">Your inquiry has been received.</p>
				</div>
			{:else}
				<form method="POST" class="space-y-8">
					<div class="group space-y-2">
						<label
							for="name"
							class="block text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase transition-colors group-focus-within:text-yellow-500"
							>Full Name</label
						>
						<input
							id="name"
							name="name"
							type="text"
							required
							class="w-full border-b border-gray-800 bg-transparent py-3 text-lg text-white placeholder-gray-800 transition-colors outline-none focus:border-yellow-500"
							placeholder="Enter your name"
						/>
					</div>

					<div class="group space-y-2">
						<label
							for="mobile"
							class="block text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase transition-colors group-focus-within:text-yellow-500"
							>WhatsApp Number</label
						>
						<div
							class="flex items-center border-b border-gray-800 transition-colors focus-within:border-yellow-500"
						>
							<span class="pr-2 text-lg text-gray-600">+91</span>
							<input
								id="mobile"
								name="mobile"
								type="tel"
								maxlength="10"
								required
								oninput={validateMobile}
								class="w-full bg-transparent py-3 text-lg text-white outline-none"
								placeholder="00000 00000"
							/>
						</div>
					</div>

					<div class="space-y-4">
						<label class="block text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase"
							>Age Group</label
						>
						<div class="flex flex-wrap gap-3">
							{#each ['6-12', '13-21', '22-30', '31-40', '40+'] as age}
								<label class="relative">
									<input type="radio" name="ageGroup" value={age} class="peer sr-only" required />
									<span
										class="block cursor-pointer rounded-full border border-gray-700 px-6 py-2 text-xs font-medium text-gray-400 transition-all
                                        peer-checked:border-yellow-500 peer-checked:text-yellow-500 hover:border-gray-500"
									>
										{age}
									</span>
								</label>
							{/each}
						</div>
					</div>

					<div class="group space-y-2">
						<label
							for="interest"
							class="block text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase transition-colors group-focus-within:text-yellow-500"
							>Area of Interest</label
						>
						<select
							id="interest"
							name="interest"
							required
							class="w-full cursor-pointer appearance-none border-b border-gray-800 bg-transparent py-3 text-lg text-white transition-colors outline-none focus:border-yellow-500"
						>
							<option value="" disabled selected class="bg-[#121212]">Select your interest</option>
							<option value="Solo Performance Depth" class="bg-[#121212]"
								>Solo Performance Depth</option
							>
							<option value="Choreography" class="bg-[#121212]">Choreography</option>
							<option value="Natya Shastra" class="bg-[#121212]">Natya Shastra</option>
							<option value="Karnas" class="bg-[#121212]">Karnas</option>
							<option value="Bassictoadvance" class="bg-[#121212]"
								>Basic to Advanced Bharatanatyam</option
							>
							<option value="Others" class="bg-[#121212]">Others</option>
						</select>
					</div>

					<div class="group space-y-2">
						<label
							for="message"
							class="block text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase transition-colors group-focus-within:text-yellow-500"
							>Message</label
						>
						<textarea
							id="message"
							name="message"
							rows="3"
							class="w-full border-b border-gray-800 bg-transparent py-3 text-lg text-white placeholder-gray-800 transition-colors outline-none focus:border-yellow-500"
							placeholder="Tell us what you're looking for..."
						></textarea>
					</div>

					<button
						type="submit"
						class="w-full bg-yellow-600 py-5 text-xs font-black tracking-[0.3em] text-black uppercase transition-all hover:bg-white active:scale-[0.98]"
					>
						Submit
					</button>
				</form>
			{/if}
		</div>
	</div>

	<div class="relative hidden w-[55%] overflow-hidden md:block">
		<img
			src="/images/background-hero.jpg"
			alt="Dancer"
			class="h-full w-full object-cover opacity-60"
		/>
		<div
			class="absolute inset-0 bg-gradient-to-r from-[#121212] via-transparent to-transparent"
		></div>
	</div>
</div>
