<script lang="ts">
	let { data } = $props();
	let totalInquiries = $derived(data.inquiries.length);

	// State for the modal
	let showModal = $state(false);
	let itemToDelete = $state(null);

	function openModal(item: any) {
		itemToDelete = item;
		showModal = true;
	}
</script>

<div class="min-h-screen bg-[#121212] p-8 text-white">
	{#if showModal}
		<div class="pointer-events-none fixed inset-0 z-[200] flex items-center justify-center">
			<div
				class="pointer-events-auto w-full max-w-sm rounded-lg border border-white/10 bg-[#1a1a1a] p-8 text-center shadow-2xl"
			>
				<h3 class="font-serif text-xl text-yellow-500 uppercase">Confirm Deletion</h3>
				<p class="mt-4 text-xs text-gray-400">
					Are you sure? This inquiry from {itemToDelete?.name} will be permanently removed.
				</p>
				<div class="mt-8 flex gap-3">
					<button
						class="flex-1 rounded bg-white/10 py-2 text-xs font-bold text-white uppercase hover:bg-white/20"
						onclick={() => (showModal = false)}>Cancel</button
					>
					<form method="POST" action="?/deleteInquiry" class="flex-1">
						<input type="hidden" name="id" value={itemToDelete?.id} />
						<button
							class="w-full rounded bg-red-600 py-2 text-xs font-bold text-white uppercase hover:bg-red-700"
							>Delete</button
						>
					</form>
				</div>
			</div>
		</div>
	{/if}

	<div class="mx-auto max-w-7xl">
		<header class="mb-12 flex items-end justify-between border-b border-white/10 pb-6">
			<div>
				<h1 class="font-serif text-3xl tracking-widest text-yellow-500 uppercase">
					Inquiry Manager
				</h1>
				<p class="mt-2 text-[10px] tracking-[0.3em] text-gray-500 uppercase">
					Total Leads: <span class="font-bold text-white">{totalInquiries}</span>
				</p>
			</div>
			<a href="/" class="text-[10px] tracking-widest text-gray-500 uppercase hover:text-white"
				>← Back to Site</a
			>
		</header>

		<div class="overflow-x-auto rounded-sm border border-white/5 bg-[#1a1a1a]">
			<table class="w-full text-left">
				<thead
					class="bg-[#252525] text-[10px] font-bold tracking-[0.2em] text-yellow-500 uppercase"
				>
					<tr>
						<th class="p-5">Date</th>
						<th class="p-5">Name</th>
						<th class="p-5">WhatsApp</th>
						<th class="p-5">Age</th>
						<th class="p-5">Focus Area</th>
						<th class="p-5">Message</th>
						<th class="p-5 text-right">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-white/5">
					{#each data.inquiries as item}
						<tr class="transition-colors hover:bg-white/5">
							<td class="p-5 text-sm text-gray-500"
								>{new Date(item.createdAt).toLocaleDateString()}</td
							>
							<td class="p-5 font-bold">{item.name}</td>
							<td class="p-5 text-xs">
								<a
									href="https://wa.me/91{item.email}"
									target="_blank"
									class="text-green-500 transition-all hover:text-green-400 hover:underline"
								>
									+91 {item.email}
								</a>
							</td>
							<td class="p-5 text-xs">{item.ageGroup || '—'}</td>
							<td class="p-5 text-xs text-yellow-400 uppercase">{item.interest}</td>
							<td class="max-w-xs truncate p-5 text-xs text-gray-400" title={item.message}
								>{item.message || '—'}</td
							>
							<td class="p-5 text-right">
								<button
									onclick={() => openModal(item)}
									class="text-[10px] font-bold tracking-widest text-red-500/50 uppercase transition-colors hover:text-red-500"
									>Delete</button
								>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
