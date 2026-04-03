<script lang="ts">
	import { createAuthClient } from 'better-auth/svelte';
	import { invalidateAll } from '$app/navigation'; // For the Refresh button

	const authClient = createAuthClient();

	// Props and State
	let { data } = $props();
	let inquiries = $derived(data?.inquiries ?? []);
	let totalInquiries = $derived(inquiries.length);

	let showModal = $state(false);
	let itemToDelete = $state<any>(null);

	async function handleSignOut() {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					window.location.href = '/admin/login';
				}
			}
		});
	}

	function clearAllCookies() {
		const cookies = document.cookie.split(';');
		for (let i = 0; i < cookies.length; i++) {
			const cookie = cookies[i];
			const eqPos = cookie.indexOf('=');
			const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
			// Attempt to clear from multiple common path levels
			document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
			document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/admin;`;
		}
		window.location.href = '/admin/login';
	}

	function openModal(item: any) {
		itemToDelete = item;
		showModal = true;
	}

	function refreshData() {
		invalidateAll();
	}

	// Helper for date formatting
	function formatDate(dateStr: string) {
		if (!dateStr) return '—';
		return new Date(dateStr).toLocaleDateString('en-IN', {
			day: '2-digit',
			month: 'short',
			year: 'numeric'
		});
	}
</script>

<div
	class="min-h-screen bg-[#070707] font-sans text-white selection:bg-[#C5A059] selection:text-black"
>
	<header
		class="sticky top-0 z-[100] flex items-center justify-between border-b border-white/10 bg-[#0a0a0a]/80 px-8 py-3 backdrop-blur-md"
	>
		<div class="flex items-center gap-4">
			<img
				src="/images/logo.png"
				alt="Anvaya"
				class="h-8 w-auto object-contain brightness-200 grayscale invert"
			/>
			<div class="h-4 w-[1px] bg-white/20"></div>
			<h1 class="font-serif text-sm tracking-[0.2em] text-[#C5A059] uppercase italic">
				Admin Panel
			</h1>
		</div>

		<div class="flex items-center gap-6">
			<a
				href="/"
				class="text-[9px] font-bold tracking-[0.2em] text-white/60 uppercase hover:text-[#C5A059]"
				>View Site</a
			>
			<button
				onclick={handleSignOut}
				class="rounded-sm border border-[#ff3e3e] bg-[#ff3e3e]/10 px-5 py-1.5 text-[10px] font-black tracking-[0.1em] text-[#ff3e3e] uppercase transition-all hover:bg-[#ff3e3e] hover:text-white"
			>
				Sign Out
			</button>
		</div>
	</header>

	{#if showModal}
		<div
			class="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-sm"
		>
			<div class="w-full max-w-xs border border-white/10 bg-[#111] p-8 text-center shadow-2xl">
				<h3 class="font-serif text-lg tracking-widest text-[#C5A059] uppercase">Delete Inquiry?</h3>
				<p class="mt-2 text-[10px] font-bold text-white uppercase">{itemToDelete?.name}</p>
				<div class="mt-8 flex gap-3">
					<button
						class="flex-1 border border-white/20 py-2 text-[10px] font-bold text-white uppercase hover:bg-white/10"
						onclick={() => (showModal = false)}
					>
						Cancel
					</button>
					<form
						method="POST"
						action="?/deleteInquiry"
						class="flex-1"
						onsubmit={() => (showModal = false)}
					>
						<input type="hidden" name="id" value={itemToDelete?.id} />
						<button
							class="w-full bg-[#ff3e3e] py-2 text-[10px] font-bold text-white uppercase hover:bg-[#d63030]"
						>
							Delete
						</button>
					</form>
				</div>
			</div>
		</div>
	{/if}

	<main class="mx-auto max-w-7xl px-8 py-10">
		<div class="mb-10 flex items-end justify-between border-b border-white/10 pb-8">
			<div>
				<p class="text-[10px] font-bold tracking-[0.4em] text-[#C5A059] uppercase">
					Inquiry Volume
				</p>
				<h2 class="text-6xl font-light tracking-tighter text-white">
					{totalInquiries}
					<span class="ml-2 text-xs font-bold tracking-[0.3em] text-white/30 uppercase"
						>Total Leads</span
					>
				</h2>
			</div>
			<div class="flex gap-4">
				<button
					onclick={clearAllCookies}
					class="border border-white/10 bg-white/5 px-6 py-2 text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase transition-all hover:border-red-400/30 hover:text-red-400"
					title="Full reset"
				>
					Clear Cookies
				</button>
				<button
					onclick={refreshData}
					class="border border-white/20 bg-white/5 px-6 py-2 text-[10px] font-bold tracking-[0.2em] text-white uppercase transition-all hover:bg-white hover:text-black"
				>
					Refresh Data
				</button>
			</div>
		</div>

		<div class="overflow-x-auto border border-white/10 bg-[#0d0d0d]">
			<table class="w-full text-left">
				<thead
					class="bg-white/[0.05] text-[10px] font-black tracking-[0.2em] text-[#C5A059] uppercase"
				>
					<tr>
						<th class="px-6 py-5">Date Received</th>
						<th class="px-6 py-5">Client Name</th>
						<th class="px-6 py-5">Interest & Age</th>
						<th class="px-6 py-5">Message</th>
						<th class="px-8 py-5 text-right">Action</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-white/10">
					{#each inquiries as item (item.id)}
						<tr class="group transition-colors hover:bg-white/[0.02]">
							<td class="px-6 py-8">
								<span class="text-[12px] font-bold tracking-wider text-white">
									{formatDate(item.createdAt)}
								</span>
							</td>
							<td class="px-6 py-8">
								<div
									class="text-base font-bold text-white transition-colors group-hover:text-[#C5A059]"
								>
									{item.name ?? 'Guest'}
								</div>
								{#if item.email}
									<a
										href="tel:{item.email}"
										class="mt-1 inline-flex items-center gap-2 text-[11px] font-bold text-green-400 hover:text-green-300"
									>
										<span
											class="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"
										></span>
										{item.email}
									</a>
								{/if}
							</td>
							<td class="px-6 py-8">
								<div
									class="inline-block border border-[#C5A059]/40 bg-[#C5A059]/10 px-3 py-1 text-[10px] font-black tracking-widest text-[#C5A059] uppercase"
								>
									{item.interest ?? 'General'}
								</div>
								<div
									class="mt-2 text-[11px] font-black tracking-widest text-[#C5A059] uppercase italic opacity-90"
								>
									Age: {item.ageGroup ?? '—'}
								</div>
							</td>
							<td class="max-w-xs px-6 py-8 leading-relaxed">
								<p
									class="text-[12px] text-white/70 italic transition-colors group-hover:text-white"
								>
									"{item.message ?? 'No details'}"
								</p>
							</td>
							<td class="px-8 py-8 text-right">
								<button
									onclick={() => openModal(item)}
									class="rounded-sm border border-[#ff3e3e] bg-transparent px-4 py-1.5 text-[10px] font-black tracking-widest text-[#ff3e3e] uppercase transition-all hover:bg-[#ff3e3e] hover:text-white"
								>
									Remove
								</button>
							</td>
						</tr>
					{:else}
						<tr>
							<td
								colspan="5"
								class="py-20 text-center text-[10px] font-bold tracking-[0.3em] text-white/20 uppercase"
							>
								No inquiries found
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</main>
</div>

<style>
	:global(.font-serif) {
		font-family: 'Cinzel', serif;
	}
</style>
