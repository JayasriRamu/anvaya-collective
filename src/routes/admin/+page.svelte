<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import {
		CONTENT_TYPE_OPTIONS,
		dedupeTags,
		dedupeValues,
		normalizeContentType,
		parseTags
	} from '$lib/content';
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
	let existingTypes = $derived(data?.existingTypes ?? []);
	let existingTags = $derived(data?.existingTags ?? []);
	let hiddenTypes = $derived(data?.hiddenTypes ?? ([] as string[]));

	// --- Content type: type-ahead field that also accepts anything custom ---
	let contentType = $state('YouTube Video');
	let typeDraft = $state('');
	let typeOpen = $state(false);
	let typeHighlight = $state(-1);

	/** All selectable pills: the 5 seed types plus every type already in the DB,
	 *  minus any the admin removed, plus the current selection (so an item using a
	 *  removed type can still be edited/seen). */
	const typePills = $derived(
		dedupeValues([
			...CONTENT_TYPE_OPTIONS.map((o) => o.value),
			...existingTypes,
			...(contentType.trim() ? [contentType] : [])
		]).filter((pill) => pill === contentType || !hiddenTypes.includes(pill.toLowerCase()))
	);

	const typeSuggestions = $derived.by(() => {
		const all = typePills;
		const term = typeDraft.trim().toLowerCase();
		if (!term) return all;
		return all.filter((value) => value.toLowerCase().includes(term));
	});

	/** Show what a typed value will actually be stored as, so snapping isn't magic. */
	const snappedType = $derived(typeDraft.trim() ? normalizeContentType(typeDraft) : '');
	const snapChanged = $derived(
		!!snappedType && snappedType.toLowerCase() !== typeDraft.trim().toLowerCase()
	);

	function chooseType(value: string) {
		contentType = normalizeContentType(value);
		typeDraft = '';
		typeOpen = false;
		typeHighlight = -1;
	}

	/** The pill currently waiting on the remove confirmation dialog. */
	let typeToDelete = $state<string | null>(null);

	/** Ask before removing a content type from the pick list. */
	function deleteType(pill: string) {
		typeToDelete = pill;
	}

	/** Perform the soft delete once confirmed in the dialog. */
	async function confirmDeleteType() {
		const pill = typeToDelete;
		if (!pill) return;

		try {
			const res = await fetch('?/deleteContentType', {
				method: 'POST',
				headers: { Accept: 'application/json' },
				body: new URLSearchParams({ name: pill })
			});
			const result = (await res.json()) as { type?: string };
			typeToDelete = null;
			if (res.ok && result.type === 'success') {
				showToast('success', `"${pill}" removed from the list.`);
				if (contentType === pill) chooseType('YouTube Video');
				await invalidateAll();
			} else {
				showToast('error', 'Could not remove the content type.');
			}
		} catch (e) {
			console.error('Delete type error:', e);
			typeToDelete = null;
			showToast('error', 'Could not remove the content type.');
		}
	}

	/** Commit whatever was typed into a custom type (blur, or Enter to submit). */
	function commitType() {
		typeOpen = false;
		typeHighlight = -1;
		if (!typeDraft.trim()) return;
		contentType = normalizeContentType(typeDraft);
		typeDraft = '';
	}

	function handleTypeKeydown(event: KeyboardEvent) {
		const count = typeSuggestions.length;

		if (event.key === 'ArrowDown') {
			event.preventDefault();
			typeOpen = true;
			typeHighlight = Math.min(typeHighlight + 1, count - 1);
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			typeHighlight = Math.max(typeHighlight - 1, -1);
		} else if (event.key === 'Enter' && typeOpen && typeHighlight >= 0) {
			// Pick the highlighted suggestion instead of submitting the form.
			event.preventDefault();
			chooseType(typeSuggestions[typeHighlight]);
		} else if (event.key === 'Escape') {
			typeOpen = false;
			typeHighlight = -1;
		} else if (event.key === 'Enter') {
			commitType();
		}
	}

	// --- Tags: chip input ---
	let tags = $state<string[]>([]);
	let tagDraft = $state('');
	let tagInputEl = $state<HTMLInputElement | null>(null);

	const tagSuggestions = $derived.by(() => {
		const term = tagDraft.trim().toLowerCase();
		if (!term) return [];
		return existingTags.filter(
			(tag) =>
				tag.toLowerCase().includes(term) && !tags.some((t) => t.toLowerCase() === tag.toLowerCase())
		);
	});

	function addTag(value: string) {
		const tag = value.trim().replace(/\s+/g, ' ');
		if (!tag) return;
		if (tags.some((t) => t.toLowerCase() === tag.toLowerCase())) {
			tagDraft = '';
			return;
		}
		tags = [...tags, tag];
		tagDraft = '';
	}

	function removeTag(tag: string) {
		tags = tags.filter((t) => t !== tag);
	}

	function handleTagKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ',') {
			event.preventDefault();
			addTag(tagDraft);
		} else if (event.key === 'Backspace' && !tagDraft) {
			if (tags.length) tags = tags.slice(0, -1);
		}
	}

	let showDeleteModal = $state(false);
	let deletingId = $state<number | null>(null);
	let editingItem = $state<ContentItem | null>(null);

	let formAction = $derived(editingItem ? '?/updateContent' : '?/add');
	let submitLabel = $derived(editingItem ? 'Update Content' : 'Save');

	const linkLabel = $derived(
		CONTENT_TYPE_OPTIONS.find((c) => c.value === contentType)?.label ?? 'Link URL'
	);
	const linkPlaceholder = $derived(
		CONTENT_TYPE_OPTIONS.find((c) => c.value === contentType)?.placeholder ?? 'https://...'
	);
	const isCourseType = $derived(
		!!contentType && (contentType === 'Course Material' || contentType.toLowerCase() === 'course')
	);

	const isPosterType = $derived(
		!!contentType && (contentType.toLowerCase().includes('workshop') || contentType === 'Poster')
	);

	const difficultyLevels = ['Beginner', 'Intermediate', 'Advanced'];

	function startEdit(item: ContentItem) {
		editingItem = item;
		contentType = normalizeContentType(item.type);
		typeDraft = '';
		typeOpen = false;
		tags = dedupeTags(parseTags(item.tags));
		tagDraft = '';
	}

	function cancelEdit() {
		editingItem = null;
		contentType = 'YouTube Video';
		typeDraft = '';
		typeOpen = false;
		tags = [];
		tagDraft = '';
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
			contentType = 'YouTube Video';
			typeDraft = '';
			tags = [];
			tagDraft = '';
			editingItem = null;
			invalidateAll();
		} else if (form?.errors?.server) {
			showToast('error', form.errors.server);
		} else if (form?.values && !editingItem) {
			// Validation failed: put back the custom type / tags that were typed.
			contentType = normalizeContentType(form.values.type ?? 'YouTube Video');
			typeDraft = '';
			tags = dedupeTags(parseTags(form.values.tags));
			tagDraft = '';
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
			<h1 class="mb-8 font-serif text-3xl font-bold text-[#C5A059] uppercase">
				{editingItem ? 'Edit Content' : 'Add Content'}
			</h1>

			<form method="POST" action={formAction} class="grid grid-cols-1 gap-6 md:grid-cols-2">
				{#if editingItem}
					<input type="hidden" name="id" value={editingItem.id} />
				{/if}

				<div class="md:col-span-2">
					<p class="mb-1 text-[11px] font-black tracking-widest text-[#C5A059] uppercase">
						Content type <span class="text-[#C5A059]">*</span>
					</p>
					<p class="mb-3 text-[13px] leading-relaxed text-white/80">
						Tap one to select it — this decides where the item shows up on the website. Anything you
						have created before is listed here too.
					</p>

					<div class="flex flex-wrap items-center gap-2">
						{#each typePills as pill (pill)}
							{@const active = contentType === pill}
							<span
								class="inline-flex items-center rounded-full border transition-all {active
									? 'border-[#C5A059] bg-[#C5A059] shadow-[0_0_12px_rgba(197,160,89,0.35)]'
									: 'border-white/25 bg-white/[0.04] hover:border-[#C5A059]/60 hover:bg-[#C5A059]/15'}"
							>
								<button
									type="button"
									aria-pressed={active}
									onclick={() => chooseType(pill)}
									class="py-2 pr-1 pl-4 text-[11px] font-black tracking-wider uppercase transition-colors {active
										? 'text-black'
										: 'text-white/90 hover:text-[#C5A059]'}"
								>
									{pill}
								</button>
								<button
									type="button"
									aria-label="Remove {pill} from content types"
									title={`Remove "${pill}" from the list`}
									onclick={() => deleteType(pill)}
									class="py-2 pr-2.5 pl-1.5 transition-colors {active
										? 'text-black/50 hover:text-black'
										: 'text-white/70 hover:text-red-400'}"
								>
									<svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="3"
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</button>
							</span>
						{/each}
					</div>

					<div class="relative mt-3">
						<input
							id="type"
							type="text"
							role="combobox"
							aria-expanded={typeOpen}
							aria-controls="type-suggestions"
							aria-autocomplete="list"
							aria-label="Or type your own content type"
							autocomplete="off"
							bind:value={typeDraft}
							oninput={() => {
								typeOpen = true;
								typeHighlight = -1;
							}}
							onfocus={() => (typeOpen = true)}
							onblur={commitType}
							onkeydown={handleTypeKeydown}
							placeholder="…or type your own and press Enter"
							class="w-full rounded border border-stone-700 bg-stone-900 px-4 py-3 text-base font-light text-amber-100 transition-colors outline-none placeholder:text-white/70 focus:border-[#C5A059] focus:bg-stone-800"
						/>
						<input type="hidden" name="type" value={contentType} />

						{#if typeOpen && typeSuggestions.length > 0}
							<ul
								id="type-suggestions"
								role="listbox"
								class="absolute inset-x-0 top-full z-40 mt-1 max-h-56 overflow-y-auto rounded border border-[#C5A059]/50 bg-stone-900 shadow-2xl"
							>
								{#each typeSuggestions as suggestion, index (suggestion)}
									<li role="presentation">
										<button
											type="button"
											role="option"
											aria-selected={index === typeHighlight}
											onmousedown={(e) => {
												e.preventDefault();
												chooseType(suggestion);
											}}
											onmouseenter={() => (typeHighlight = index)}
											class="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm font-light transition-colors {index ===
											typeHighlight
												? 'bg-[#C5A059]/25 text-[#C5A059]'
												: 'text-white/95 hover:bg-white/5'}"
										>
											{suggestion}
											{#if suggestion === contentType}
												<span class="text-[10px] tracking-widest text-[#C5A059] uppercase"
													>Current</span
												>
											{/if}
										</button>
									</li>
								{/each}
							</ul>
						{/if}
					</div>

					{#if snapChanged}
						<p class="mt-2 text-[11px] text-[#C5A059]">
							Will be saved as <span class="font-bold">{snappedType}</span>
						</p>
					{/if}
				</div>

				<div class="relative md:col-span-2">
					<p class="mb-1 text-[11px] font-black tracking-widest text-[#C5A059] uppercase">Tags</p>
					<p class="mb-3 text-[13px] leading-relaxed text-white/80">
						Optional. Press Enter after each one — used to group and filter content.
					</p>

					<div
						class="flex min-h-[3rem] flex-wrap items-center gap-2 rounded border border-stone-700 bg-stone-900 px-3 py-2 transition-colors focus-within:border-[#C5A059] focus-within:bg-stone-800"
					>
						{#each tags as tag (tag)}
							<span
								class="inline-flex items-center gap-1.5 rounded-full bg-[#C5A059] px-3 py-1.5 text-[11px] font-black tracking-wider text-black uppercase"
							>
								{tag}
								<button
									type="button"
									aria-label="Remove tag {tag}"
									onclick={() => removeTag(tag)}
									class="rounded-full p-0.5 text-black/50 transition-colors hover:bg-black hover:text-[#C5A059]"
								>
									<svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="3"
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</button>
							</span>
						{/each}
						<input
							bind:this={tagInputEl}
							id="tags"
							type="text"
							autocomplete="off"
							aria-label="Add a tag"
							bind:value={tagDraft}
							onkeydown={handleTagKeydown}
							onblur={() => addTag(tagDraft)}
							placeholder={tags.length ? 'Add another…' : 'e.g. Beginner, then press Enter'}
							class="min-w-[12rem] flex-1 bg-transparent py-1 text-base font-light text-white outline-none placeholder:text-white/70"
						/>
					</div>
					<input type="hidden" name="tags" value={tags.join(', ')} />

					{#if tagDraft.trim() && tagSuggestions.length > 0}
						<ul
							role="listbox"
							class="absolute inset-x-0 top-full z-40 mt-1 max-h-48 overflow-y-auto rounded border border-[#C5A059]/50 bg-stone-900 shadow-2xl"
						>
							{#each tagSuggestions as suggestion (suggestion)}
								<li role="presentation">
									<button
										type="button"
										role="option"
										aria-selected="false"
										onmousedown={(e) => {
											e.preventDefault();
											addTag(suggestion);
											tagInputEl?.focus();
										}}
										class="block w-full px-4 py-2.5 text-left text-sm font-light text-white/95 transition-colors hover:bg-[#C5A059]/20 hover:text-[#C5A059]"
									>
										{suggestion}
									</button>
								</li>
							{/each}
						</ul>
					{/if}
				</div>

				<div class="border-b border-white/20 pb-3 focus-within:border-[#C5A059] md:col-span-2">
					<label
						for="title"
						class="mb-1 block text-[11px] font-black tracking-widest text-[#C5A059] uppercase"
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
						class="mb-1 block text-[11px] font-black tracking-widest text-[#C5A059] uppercase"
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
						class="mb-1 block text-[11px] font-black tracking-widest text-[#C5A059] uppercase"
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
						class="mb-1 block text-[11px] font-black tracking-widest text-[#C5A059] uppercase"
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
							class="mb-1 block text-[11px] font-black tracking-widest text-[#C5A059] uppercase"
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
							class="mb-1 block text-[11px] font-black tracking-widest text-[#C5A059] uppercase"
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
							class="mb-1 block text-[11px] font-black tracking-widest text-[#C5A059] uppercase"
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
							class="mb-1 block text-[11px] font-black tracking-widest text-[#C5A059] uppercase"
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
							class="border border-white/20 px-6 py-3 text-xs font-black text-white/95 uppercase transition-all hover:bg-white/10"
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
				<h2 class="font-serif text-2xl font-bold text-[#C5A059] uppercase">
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
								<td class="px-6 py-5 text-[11px] text-white/80">
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
									class="max-w-[200px] truncate px-6 py-5 text-[11px] text-white/80"
									title={item.description ?? ''}
								>
									{item.description || '—'}
								</td>
								<td class="px-6 py-5 text-[11px] text-white/65">
									{formatDate(item.createdAt)}
								</td>
								<td
									class="px-6 py-5 text-[11px] {isExpired(item.expiresAt)
										? 'text-red-400/70'
										: 'text-white/70'}"
								>
									{formatDate(item.expiresAt)}
								</td>
								<td class="px-6 py-5 text-right">
									<div class="flex items-center justify-end gap-2">
										<button
											onclick={() => startEdit(item)}
											title="Edit Content"
											class="rounded p-1.5 text-white/75 transition-colors hover:text-amber-400"
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
											class="rounded p-1.5 text-white/75 transition-colors hover:text-red-400"
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
									class="py-20 text-center text-[10px] font-bold tracking-[0.3em] text-white/65 uppercase"
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
			<p class="mt-3 text-sm leading-relaxed text-white/75">
				Are you sure you want to remove this item? This action cannot be undone.
			</p>
			<div class="mt-8 flex gap-3">
				<button
					onclick={() => (showDeleteModal = false)}
					class="flex-1 border border-white/20 py-3 text-xs font-bold text-white/95 uppercase transition-all hover:bg-white/10"
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

{#if typeToDelete}
	<div
		role="presentation"
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
		onclick={() => (typeToDelete = null)}
		onkeydown={(e) => {
			if (e.key === 'Escape') typeToDelete = null;
		}}
	>
		<div
			role="alertdialog"
			aria-modal="true"
			aria-labelledby="remove-type-title"
			aria-describedby="remove-type-desc"
			tabindex="-1"
			class="relative w-full max-w-sm border border-amber-900/50 bg-stone-900 p-8 shadow-2xl"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
		>
			<button
				onclick={() => (typeToDelete = null)}
				aria-label="Close dialog"
				class="absolute top-4 right-4 rounded p-1 text-white/70 transition-colors hover:text-white"
			>
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>

			<div
				class="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#ff3e3e]/40 bg-[#ff3e3e]/10"
			>
				<svg class="h-6 w-6 text-[#ff3e3e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.8"
						d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
					/>
				</svg>
			</div>

			<h3
				id="remove-type-title"
				class="mt-5 text-center font-serif text-2xl text-[#C5A059] uppercase italic"
			>
				Remove content type
			</h3>

			<p id="remove-type-desc" class="mt-3 text-center text-sm leading-relaxed text-white/75">
				Remove
				<span class="font-bold text-white">{typeToDelete}</span>
				from the pick list? Saved items keep this type and stay on the site — you can add it back anytime.
			</p>

			<div class="mt-8 flex gap-3">
				<button
					onclick={() => (typeToDelete = null)}
					class="flex-1 border border-white/20 py-3 text-xs font-bold text-white/95 uppercase transition-all hover:bg-white/10"
				>
					Cancel
				</button>
				<button
					onclick={confirmDeleteType}
					class="flex-1 border border-[#ff3e3e] bg-[#ff3e3e]/10 py-3 text-xs font-black tracking-widest text-[#ff3e3e] uppercase transition-all hover:bg-[#ff3e3e] hover:text-white"
				>
					Remove
				</button>
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
