// Shared content-type + tag helpers.
// Used by the admin form (to suggest + snap values) and by the server actions
// (to normalise whatever actually arrives in the POST body).

export interface ContentTypeOption {
	value: string;
	label: string;
	placeholder: string;
}

/** How long an item with no date stays in the homepage Recent Activity. */
export const RECENT_WINDOW_DAYS = 60;

/** Ensure a stored URL always has a scheme so links open externally. */
export function safeUrl(input: string | null | undefined): string | null {
	const trimmed = (input ?? '').trim();
	if (!trimmed) return null;
	if (/^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)) return trimmed;
	if (trimmed.startsWith('mailto:') || trimmed.startsWith('tel:')) return trimmed;
	return `https://${trimmed}`;
}

/** The seed types shown as quick picks in the admin panel. */
export const CONTENT_TYPE_OPTIONS: ContentTypeOption[] = [
	{ value: 'YouTube Video', label: 'YouTube URL', placeholder: 'https://youtube.com/watch?v=...' },
	{ value: 'Course Material', label: 'Material Link', placeholder: 'https://...' },
	{ value: 'Workshop Slides', label: 'Slide Deck Link', placeholder: 'https://...' },
	{ value: 'Poster', label: 'Poster Link', placeholder: 'https://...' },
	{ value: 'General Resource', label: 'Resource URL', placeholder: 'https://...' }
];

/**
 * /courses and the homepage poster query compare `content.type` as an exact
 * string, so a hand-typed variant ("course", "workshops", "youtube") would
 * otherwise silently drop the item off those pages. These aliases snap the
 * likely inputs onto the canonical labels.
 */
const TYPE_ALIASES: Record<string, string> = {
	'youtube video': 'YouTube Video',
	youtube: 'YouTube Video',
	video: 'YouTube Video',
	videos: 'YouTube Video',
	yt: 'YouTube Video',
	'yt video': 'YouTube Video',

	'course material': 'Course Material',
	'course materials': 'Course Material',
	course: 'Course Material',
	courses: 'Course Material',
	material: 'Course Material',
	materials: 'Course Material',

	'workshop slides': 'Workshop Slides',
	'workshop slide': 'Workshop Slides',
	workshop: 'Workshop Slides',
	workshops: 'Workshop Slides',
	slides: 'Workshop Slides',
	'slide deck': 'Workshop Slides',

	poster: 'Poster',
	posters: 'Poster',
	'poster image': 'Poster',

	'general resource': 'General Resource',
	resource: 'General Resource',
	resources: 'General Resource',
	// Legacy value from the old "Other..." dropdown option.
	'other...': 'General Resource',
	other: 'General Resource'
};

/** Trim, collapse whitespace, and snap known aliases onto canonical labels. */
export function normalizeContentType(input: string | null | undefined): string {
	const trimmed = (input ?? '').trim().replace(/\s+/g, ' ');
	if (!trimmed) return '';
	return TYPE_ALIASES[trimmed.toLowerCase()] ?? trimmed;
}

/** Split a stored/entered tag list on commas, semicolons or newlines. */
export function parseTags(input: string | null | undefined): string[] {
	return (input ?? '')
		.split(/[,;\n]/)
		.map((tag) => tag.trim().replace(/\s+/g, ' '))
		.filter(Boolean);
}

/** Case-insensitive dedupe, keeping the first spelling seen. */
export function dedupeValues(values: string[]): string[] {
	const seen = new Set<string>();
	const result: string[] = [];
	for (const value of values) {
		const key = value.toLowerCase();
		if (!key || seen.has(key)) continue;
		seen.add(key);
		result.push(value);
	}
	return result;
}

export function dedupeTags(tags: string[]): string[] {
	return dedupeValues(tags);
}

/**
 * Store tags the way the rest of the app expects to read them back: a single
 * comma-separated string, since the courses and homepage views split on ",".
 */
export function normalizeTags(input: string | null | undefined): string {
	return dedupeTags(parseTags(input)).join(', ');
}
