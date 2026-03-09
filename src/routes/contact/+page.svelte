<script lang="ts">
	import { fly } from 'svelte/transition';
	let { form } = $props();

	function validateMobile(event: Event) {
		const input = event.target as HTMLInputElement;
		input.value = input.value.replace(/\D/g, '');
	}
</script>

<div class="flex min-h-screen w-full flex-col bg-[#121212] font-sans text-white md:flex-row">
	<div class="flex w-full items-center justify-center px-8 py-16 md:w-1/2 md:py-24">
		<div class="w-full max-w-md">
			<div class="mb-10 text-center md:text-left">
				<h1 class="font-serif text-4xl tracking-tight text-white italic md:text-5xl">
					Get In Touch
				</h1>
				<p class="mt-3 text-xs tracking-[0.2em] text-gray-400 uppercase">
					Start your artistic journey today.
				</p>
			</div>

			<form method="POST" class="space-y-8">
				<div class="group space-y-2">
					<label class="block text-[11px] font-bold tracking-[0.2em] text-gray-200 uppercase"
						>Full Name</label
					>
					<input
						name="name"
						type="text"
						required
						class="w-full border-b border-gray-500 bg-transparent py-3 text-lg text-white placeholder-gray-500 outline-none focus:border-[#C5A059]"
						placeholder="Enter your name"
					/>
				</div>

				<div class="group space-y-2">
					<label class="block text-[11px] font-bold tracking-[0.2em] text-gray-200 uppercase"
						>WhatsApp Number</label
					>
					<div class="flex items-center border-b border-gray-500 focus-within:border-[#C5A059]">
						<span class="pr-2 text-lg text-gray-400">+91</span>
						<input
							name="mobile"
							type="tel"
							maxlength="10"
							required
							oninput={validateMobile}
							class="w-full bg-transparent py-3 text-lg text-white placeholder-gray-500 outline-none"
							placeholder="00000 00000"
						/>
					</div>
				</div>

				<div class="space-y-3">
					<label class="block text-[11px] font-bold tracking-[0.2em] text-gray-200 uppercase"
						>Age Group</label
					>
					<div class="flex flex-wrap gap-2">
						{#each ['6-12', '13-21', '22-30', '31-40', '40+'] as age}
							<label>
								<input type="radio" name="ageGroup" value={age} class="peer sr-only" required />
								<span
									class="block cursor-pointer rounded-full border border-gray-500 px-5 py-2 text-[11px] font-medium text-gray-400 transition-colors peer-checked:border-[#C5A059] peer-checked:text-[#C5A059] hover:border-gray-300"
								>
									{age}
								</span>
							</label>
						{/each}
					</div>
				</div>

				<div class="group space-y-2">
					<label class="block text-[11px] font-bold tracking-[0.2em] text-gray-200 uppercase"
						>Area of Interest</label
					>
					<select
						name="interest"
						required
						class="w-full appearance-none border-b border-gray-500 bg-[#121212] py-3 text-lg text-white outline-none focus:border-[#C5A059]"
					>
						<option value="" disabled selected class="text-gray-500">Select interest</option>
						<option value="Choreography">Choreography</option>
						<option value="Bharatanatyam (Kalashetra Style)"
							>Bharatanatyam (Kalashetra Style)</option
						>
						<option value="Natya Sastra (A complete teaching by Bharatha Muni)"
							>Natya Sastra (A complete teaching by Bharatha Muni)</option
						>
						<option value="Others">Others</option>
					</select>
				</div>
				<div class="group space-y-2">
					<label class="block text-[11px] font-bold tracking-[0.2em] text-gray-200 uppercase"
						>Your Message</label
					>
					<textarea
						name="message"
						rows="4"
						class="w-full border-b border-gray-500 bg-transparent py-3 text-lg text-white placeholder-gray-500 outline-none focus:border-[#C5A059]"
						placeholder="How can we help?"
					></textarea>
				</div>
				<button
					type="submit"
					class="w-full bg-[#C5A059] py-4 text-xs font-black tracking-[0.3em] text-black uppercase transition-all hover:bg-white active:scale-[0.98]"
				>
					Submit
				</button>
			</form>
		</div>
	</div>

	<div class="relative order-first h-72 w-full overflow-hidden md:order-last md:h-screen md:w-1/2">
		<img
			src="/images/background-hero.jpg"
			alt="Dancer"
			class="h-full w-full object-cover object-[50%_15%] brightness-90"
		/>
		<div
			class="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/70 to-transparent md:bg-gradient-to-r md:via-[#121212]/60"
		></div>
	</div>
</div>
