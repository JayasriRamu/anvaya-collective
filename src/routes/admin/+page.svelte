<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import type { PageData } from './$types';

	interface FormShape {
		success?: boolean;
		message?: string;
		errors?: Record<string, string | undefined>;
		values?: {
			type?: string;
			title?: string;
			url?: string;
			tags?: string;
			description?: string;
			syllabus?: string;
			difficulty?: string;
			enrollmentCta?: string;
			posterImage?: string;
			expiresAt?: string;
		};
	}

	interface ContentItem {
		id: number;
		type: string;
		title: string;
		url: string | null;
		tags: string | null;
		description: string | null;
		syllabus: string | null;
		difficulty: string | null;
		enrollmentCta: string | null;
		posterImage: string | null;
		expiresAt: string | null;
		createdAt: string | Date | null;
	}

	let { data, form }: { data: PageData; form: FormShape | undefined } = $props();

	let contentItems = $derived(data?.contentItems ?? []);

	const contentTypes = [
		{
			value: 'YouTube Video',
			label: 'YouTube URL',
			placeholder: 'https://youtube.com/watch?v=...'
		},
		{ value: 'Course Material', label: 'Material Link', placeholder: 'https://...' },
		{ value: 'Workshop Slides', label: 'Slide Deck Link', placeholder: 'https://...' },
		{ value: 'Poster', label: 'Poster Link', placeholder: 'https://...' },
		{ value: 'General Resource', label: 'Resource URL', placeholder: 'https://...' },
		{ value: 'Other...', label: 'Resource URL', placeholder: 'https://...' }
	];

	let selectedType = $state('YouTube Video');
	let customType = $state('');

	const isOtherSelected = $derived(selectedType === 'Other...');
	const typePayload = $derived(isOtherSelected ? customType : selectedType);
	let showDeleteModal = $state(false);
	let deletingId = $state<number | null>(null);
	let editingItem = $state<ContentItem | null>(null);

	let formAction = $derived(editingItem ? '?/updateContent' : '?/add');
	let submitLabel = $derived(editingItem ? 'Update Content' : 'Save');

	const linkLabel = $derived(
		contentTypes.find((c) => c.value === selectedType)?.label ?? 'Link URL'
	);
	const linkPlaceholder = $derived(
		contentTypes.find((c) => c.value === selectedType)?.placeholder ?? 'https://...'
	);
	const isCourseType = $derived(
		!!typePayload && (typePayload === 'Course Material' || typePayload.toLowerCase() === 'course')
	);

	const isPosterType = $derived(
		!!typePayload && (typePayload.toLowerCase().includes('workshop') || typePayload === 'Poster')
	);

	const difficultyLevels = ['Beginner', 'Intermediate', 'Advanced'];

	function handleTypeChange(event: Event) {
		const select = event.target as HTMLSelectElement;
		selectedType = select.value;
	}

	function startEdit(item: ContentItem) {
		editingItem = item;
		const known = contentTypes.find((c) => c.value === item.type);
		if (known) {
			selectedType = item.type;
			customType = '';
		} else {
			selectedType = 'Other...';
			customType = item.type;
		}
	}

	function cancelEdit() {
		editingItem = null;
		selectedType = 'YouTube Video';
		customType = '';
	}

	function formatDate(date: string | Date | null) {
		if (!date) return '—';
		return new Date(date).toLocaleDateString('en-IN', {
			day: '2-digit',
			month: 'short',
			year: 'numeric'
		});
	}

	const todayStr = $derived(new Date().toISOString().split('T')[0]);

	function isExpired(expiresAt: string | null) {
		if (!expiresAt) return false;
		return expiresAt < todayStr;
	}

	let toast = $state<{ type: 'success' | 'error'; message: string } | null>(null);
	let toastTimer: ReturnType<typeof setTimeout> | undefined;

	function showToast(type: 'success' | 'error', message: string) {
		clearTimeout(toastTimer);
		toast = { type, message };
		toastTimer = setTimeout(() => {
			toast = null;
		}, 4000);
	}

	function dismissToast() {
		clearTimeout(toastTimer);
		toast = null;
	}

	$effect(() => {
		if (form?.success) {
			showToast('success', form.message ?? 'Done.');
			selectedType = 'YouTube Video';
			customType = '';
			editingItem = null;
			invalidateAll();
		} else if (form?.errors?.server) {
			showToast('error', form.errors.server);
		}
	});
</script>

<div class="p-6">
	{#if toast}
		<div
			class="fixed top-6 left-1/2 z-[300] flex w-full max-w-md -translate-x-1/2 items-center gap-3 rounded border px-5 py-4 shadow-2xl backdrop-blur-md {toast.type ===
			'success'
				? 'border-emerald-700/60 bg-emerald-900/80 text-emerald-200'
				: 'border-red-700/60 bg-red-900/80 text-red-200'}"
		>
			{#if toast.type === 'success'}
				<svg
					class="h-5 w-5 shrink-0 text-emerald-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2.5"
						d="M5 13l4 4L19 7"
					/>
				</svg>
			{:else}
				<svg
					class="h-5 w-5 shrink-0 text-red-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2.5"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			{/if}
			<span class="flex-1 text-sm font-medium">{toast.message}</span>
			<button
				onclick={dismissToast}
				aria-label="Dismiss"
				class="shrink-0 opacity-60 transition-opacity hover:opacity-100"
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>
		</div>
	{/if}
	<div class="mx-auto mb-12 max-w-3xl">
		<div class="border border-t-2 border-white/10 border-t-[#C5A059] bg-white/[0.02] p-8">
			<h1 class="mb-8 font-serif text-3xl text-[#C5A059] uppercase italic">
				{editingItem ? 'Edit Content' : 'Add Content'}
			</h1>

			<form method="POST" action={formAction} class="grid grid-cols-1 gap-6 md:grid-cols-2">
				{#if editingItem}
					<input type="hidden" name="id" value={editingItem.id} />
				{/if}

				<div class="border-b border-white/20 pb-3 focus-within:border-[#C5A059]">
					<label
						for="type"
						class="mb-1 block text-[11px] font-black tracking-widest text-white/40 uppercase"
						>Content Type</label
					>
					<select
						id="type"
						onchange={handleTypeChange}
						class="w-full appearance-none bg-stone-900 py-1 text-xl font-light text-amber-100 outline-none"
					>
						{#each contentTypes as ct}
							<option
								value={ct.value}
								selected={selectedType === ct.value}
								class="bg-stone-900 text-amber-100">{ct.value}</option
							>
						{/each}
					</select>
					{#if isOtherSelected}
						<input
							type="text"
							placeholder="Custom Content Type Name"
							bind:value={customType}
							required
							class="mt-3 w-full bg-transparent py-1 text-xl font-light text-white outline-none"
						/>
					{/if}
					<input type="hidden" name="type" value={typePayload} />
				</div>

				<div class="border-b border-white/20 pb-3 focus-within:border-[#C5A059]">
					<label
						for="tags"
						class="mb-1 block text-[11px] font-black tracking-widest text-white/40 uppercase"
						>Category / Tags</label
					>
					<input
						id="tags"
						type="text"
						name="tags"
						placeholder="e.g. Beginner, Natya Sastra, Workshop"
						value={editingItem?.tags ?? form?.values?.tags ?? ''}
						class="w-full bg-transparent py-1 text-xl font-light text-white outline-none"
					/>
				</div>

				<div class="border-b border-white/20 pb-3 focus-within:border-[#C5A059] md:col-span-2">
					<label
						for="title"
						class="mb-1 block text-[11px] font-black tracking-widest text-white/40 uppercase"
						>Title</label
					>
					<input
						id="title"
						type="text"
						name="title"
						required
						value={editingItem?.title ?? form?.values?.title ?? ''}
						class="w-full bg-transparent py-1 text-xl font-light text-white outline-none"
					/>
				</div>

				<div class="border-b border-white/20 pb-3 focus-within:border-[#C5A059]">
					<label
						for="url"
						class="mb-1 block text-[11px] font-black tracking-widest text-white/40 uppercase"
						>{linkLabel}</label
					>
					<input
						id="url"
						type="url"
						name="url"
						placeholder={linkPlaceholder}
						value={editingItem?.url ?? form?.values?.url ?? ''}
						class="w-full bg-transparent py-1 text-xl font-light text-white outline-none"
					/>
				</div>

				<div>
					<label
						for="expiresAt"
						class="mb-1 block text-[11px] font-black tracking-widest text-white/40 uppercase"
						>Event Date / Expiry Date</label
					>
					<input
						id="expiresAt"
						type="date"
						name="expiresAt"
						value={editingItem?.expiresAt ?? form?.values?.expiresAt ?? ''}
						class="w-full rounded border border-stone-700 bg-stone-900 p-3 text-amber-200 [color-scheme:dark] outline-none focus:border-amber-500"
					/>
				</div>

				<div class="border-b border-white/20 pb-3 focus-within:border-[#C5A059] md:col-span-2">
					<label
						for="description"
						class="mb-1 block text-[11px] font-black tracking-widest text-white/40 uppercase"
						>Description</label
					>
					<textarea
						id="description"
						name="description"
						rows="5"
						value={editingItem?.description ?? form?.values?.description ?? ''}
						class="w-full bg-transparent py-1 text-xl font-light text-white outline-none"
					></textarea>
				</div>

				{#if isCourseType}
					<div class="border-b border-white/20 pb-3 focus-within:border-[#C5A059]">
						<label
							for="difficulty"
							class="mb-1 block text-[11px] font-black tracking-widest text-white/40 uppercase"
							>Difficulty Level</label
						>
						<select
							id="difficulty"
							name="difficulty"
							class="w-full appearance-none bg-stone-900 py-1 text-xl font-light text-amber-100 outline-none"
						>
							<option value="" class="bg-stone-900 text-amber-100">— Select —</option>
							{#each difficultyLevels as level}
								<option
									value={level}
									selected={(editingItem?.difficulty ?? form?.values?.difficulty) === level}
									class="bg-stone-900 text-amber-100">{level}</option
								>
							{/each}
						</select>
					</div>

					<div class="border-b border-white/20 pb-3 focus-within:border-[#C5A059]">
						<label
							for="enrollmentCta"
							class="mb-1 block text-[11px] font-black tracking-widest text-white/40 uppercase"
							>Enrollment CTA / Contact Info</label
						>
						<input
							id="enrollmentCta"
							type="text"
							name="enrollmentCta"
							value={editingItem?.enrollmentCta ?? form?.values?.enrollmentCta ?? ''}
							placeholder="e.g. WhatsApp link or email"
							class="w-full bg-transparent py-1 text-xl font-light text-white outline-none"
						/>
					</div>

					<div class="border-b border-white/20 pb-3 focus-within:border-[#C5A059] md:col-span-2">
						<label
							for="syllabus"
							class="mb-1 block text-[11px] font-black tracking-widest text-white/40 uppercase"
							>Module / Syllabus Summary</label
						>
						<textarea
							id="syllabus"
							name="syllabus"
							rows="4"
							value={editingItem?.syllabus ?? form?.values?.syllabus ?? ''}
							class="w-full bg-transparent py-1 text-xl font-light text-white outline-none"
							placeholder="Bulleted syllabus details..."
						></textarea>
					</div>
				{/if}

				{#if isPosterType}
					<div class="border-b border-white/20 pb-3 focus-within:border-[#C5A059] md:col-span-2">
						<label
							for="posterImage"
							class="mb-1 block text-[11px] font-black tracking-widest text-white/40 uppercase"
							>Image URL / Poster Image</label
						>
						<input
							id="posterImage"
							type="url"
							name="posterImage"
							value={editingItem?.posterImage ?? form?.values?.posterImage ?? ''}
							placeholder="https://example.com/poster.jpg"
							class="w-full bg-transparent py-1 text-xl font-light text-white outline-none"
						/>
					</div>
				{/if}

				{#if form?.errors?.type}
					<p class="text-xs text-red-400">{form.errors.type}</p>
				{/if}
				{#if form?.errors?.title}
					<p class="text-xs text-red-400">{form.errors.title}</p>
				{/if}
				{#if form?.errors?.url}
					<p class="text-xs text-red-400">{form.errors.url}</p>
				{/if}

				<div class="flex justify-end gap-4 md:col-span-2">
					<button
						type="submit"
						class="w-auto bg-[#C5A059] px-8 py-3 text-xs font-black text-black uppercase transition-all hover:bg-white"
					>
						{submitLabel}
					</button>
					{#if editingItem}
						<button
							type="button"
							onclick={cancelEdit}
							class="border border-white/20 px-6 py-3 text-xs font-black text-white/70 uppercase transition-all hover:bg-white/10"
						>
							Cancel Edit
						</button>
					{/if}
				</div>
			</form>
		</div>
	</div>

	<div class="mx-auto max-w-7xl">
		<div>
			<div class="mb-6 flex items-center gap-3">
				<div class="h-8 w-1 bg-gradient-to-b from-[#E0BC71] to-[#C5A059]"></div>
				<h2 class="font-serif text-2xl text-[#C5A059] uppercase italic">
					Content Library ({contentItems.length})
				</h2>
			</div>

			<div class="overflow-x-auto border border-white/10 bg-[#0d0d0d]">
				<table class="w-full table-auto text-left">
					<thead
						class="bg-white/[0.05] text-[10px] font-black tracking-[0.2em] text-[#C5A059] uppercase"
					>
						<tr>
							<th class="w-[22%] px-6 py-5">Title</th>
							<th class="w-[10%] px-6 py-5">Type</th>
							<th class="w-[10%] px-6 py-5">Tags</th>
							<th class="w-[15%] px-6 py-5">URL</th>
							<th class="w-[17%] px-6 py-5">Description</th>
							<th class="w-[9%] px-6 py-5">Date</th>
							<th class="w-[9%] px-6 py-5">Expiry Date</th>
							<th class="w-[8%] px-6 py-5 text-right">Action</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-white/10">
						{#each contentItems as item (item.id)}
							<tr class="group transition-colors hover:bg-white/[0.02]">
								<td class="px-6 py-5">
									<div
										class="text-sm font-bold text-white transition-colors group-hover:text-[#C5A059]"
									>
										{item.title}
									</div>
								</td>
								<td class="px-6 py-5">
									<span
										class="inline-block border border-[#C5A059]/40 bg-[#C5A059]/10 px-2 py-0.5 text-[10px] font-black tracking-widest text-[#C5A059] uppercase"
									>
										{item.type}
									</span>
								</td>
								<td class="px-6 py-5 text-[11px] text-white/60">
									{item.tags || '—'}
								</td>
								<td class="max-w-[200px] truncate px-6 py-5">
									<a
										href={item.url ?? '#'}
										target="_blank"
										class="text-[11px] text-[#C5A059] underline underline-offset-2 hover:text-white"
									>
										{item.url
											? item.url.replace(/^https?:\/\//, '').replace(/\/.*$/, '') + '…'
											: '—'}
									</a>
								</td>
								<td
									class="max-w-[200px] truncate px-6 py-5 text-[11px] text-white/60"
									title={item.description ?? ''}
								>
									{item.description || '—'}
								</td>
								<td class="px-6 py-5 text-[11px] text-white/40">
									{formatDate(item.createdAt)}
								</td>
								<td
									class="px-6 py-5 text-[11px] {isExpired(item.expiresAt)
										? 'text-red-400/70'
										: 'text-white/40'}"
								>
									{formatDate(item.expiresAt)}
								</td>
								<td class="px-6 py-5 text-right">
									<div class="flex items-center justify-end gap-2">
										<button
											onclick={() => startEdit(item)}
											title="Edit Content"
											class="rounded p-1.5 text-white/50 transition-colors hover:text-amber-400"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="16"
												height="16"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-width="2"
												stroke-linecap="round"
												stroke-linejoin="round"
											>
												<path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
												<path d="m15 5 4 4" />
											</svg>
										</button>
										<button
											onclick={() => {
												deletingId = item.id;
												showDeleteModal = true;
											}}
											title="Delete Content"
											class="rounded p-1.5 text-white/50 transition-colors hover:text-red-400"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="16"
												height="16"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-width="2"
												stroke-linecap="round"
												stroke-linejoin="round"
											>
												<path d="M3 6h18" />
												<path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
												<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
												<path d="M10 11v6" />
												<path d="M14 11v6" />
											</svg>
										</button>
									</div>
								</td>
							</tr>
						{:else}
							<tr>
								<td
									colspan="8"
									class="py-20 text-center text-[10px] font-bold tracking-[0.3em] text-white/20 uppercase"
								>
									No content yet
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>

{#if showDeleteModal}
	<div
		role="presentation"
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
		onclick={() => (showDeleteModal = false)}
		onkeydown={(e) => {
			if (e.key === 'Escape') showDeleteModal = false;
		}}
	>
		<div
			role="dialog"
			aria-modal="true"
			aria-label="Confirm deletion"
			tabindex="-1"
			class="w-full max-w-sm border border-amber-900/50 bg-stone-900 p-8 shadow-2xl"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
		>
			<h3 class="font-serif text-xl text-[#C5A059] uppercase italic">Confirm Deletion</h3>
			<p class="mt-3 text-sm leading-relaxed text-white/60">
				Are you sure you want to remove this item? This action cannot be undone.
			</p>
			<div class="mt-8 flex gap-3">
				<button
					onclick={() => (showDeleteModal = false)}
					class="flex-1 border border-white/20 py-3 text-xs font-bold text-white/70 uppercase transition-all hover:bg-white/10"
				>
					Cancel
				</button>
				<form method="POST" action="?/deleteContent" class="flex-1">
					<input type="hidden" name="id" value={deletingId ?? 0} />
					<button
						type="submit"
						class="w-full border border-[#ff3e3e] bg-[#ff3e3e]/10 py-3 text-xs font-black tracking-widest text-[#ff3e3e] uppercase transition-all hover:bg-[#ff3e3e] hover:text-white"
					>
						Delete
					</button>
				</form>
			</div>
		</div>
	</div>
{/if}

<style>
	select option {
		background-color: #1c1917;
		color: #fef3c7;
	}
	select option:hover,
	select option:focus {
		background-color: #292524;
	}
</style>
