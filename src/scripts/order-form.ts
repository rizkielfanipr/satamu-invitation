import { themes } from '../data/themes';
import { isPackageCode, type PackageCode } from '../data/packages';
import { isEventType } from '../data/event-types';
import type { OrderInput } from './platform';

/** Fields in form order: errors are announced and focused in this order. */
export const orderFields = ['theme', 'package', 'name', 'email', 'whatsapp', 'eventType', 'eventDate', 'notes', 'consent'] as const;

export type OrderField = (typeof orderFields)[number];

/** Keys of `order.errors` in content.ts. */
export type OrderErrorKey =
	| 'theme'
	| 'package'
	| 'name'
	| 'nameLong'
	| 'email'
	| 'emailInvalid'
	| 'whatsapp'
	| 'whatsappInvalid'
	| 'eventType'
	| 'eventDate'
	| 'eventDateInvalid'
	| 'eventDatePast'
	| 'notesLong'
	| 'consent';

export interface OrderValues {
	theme: string;
	package: string;
	name: string;
	email: string;
	whatsapp: string;
	eventType: string;
	eventDate: string;
	notes: string;
	consent: boolean;
}

export const isThemeCode = (value: unknown) => typeof value === 'string' && themes.some((theme) => theme.code === value);

/**
 * `?theme=` and `?package=` from a CTA, kept only when they name a theme or package that exists here. Anything else
 * is dropped silently: a stale or hand-edited link still opens a working, empty form.
 */
export function readPreselection(search: string): { theme?: string; package?: PackageCode } {
	const params = new URLSearchParams(search);
	const theme = params.get('theme')?.toUpperCase();
	const pkg = params.get('package')?.toUpperCase();
	return {
		...(isThemeCode(theme) ? { theme } : {}),
		...(isPackageCode(pkg) ? { package: pkg } : {}),
	};
}

/** Indonesian mobile number as 62…, or null. Accepts 08…, 628…, +62 8…, with spaces, dots, or dashes. */
export function normalizeWhatsapp(raw: string): string | null {
	const digits = raw.replace(/[\s().-]/g, '').replace(/^\+/, '');
	const national = digits.startsWith('62') ? digits.slice(2) : digits.startsWith('0') ? digits.slice(1) : null;
	if (national === null || !/^8\d{8,12}$/.test(national)) return null;
	return `62${national}`;
}

/** Strict Y-m-d that names a real calendar day. */
export function isCalendarDate(value: string) {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
	const date = new Date(`${value}T00:00:00Z`);
	return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

/** Today in the visitor's own calendar, as Y-m-d (what a date input's `min` compares against). */
export function localToday(now = new Date()) {
	const pad = (n: number) => String(n).padStart(2, '0');
	return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

// Same limits as the platform's StoreOrderRequest, so a valid form is never refused there.
const NAME_MAX = 255;
const NOTES_MAX = 2000;
const EMAIL = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

export function validateOrder(values: OrderValues, today: string): Partial<Record<OrderField, OrderErrorKey>> {
	const errors: Partial<Record<OrderField, OrderErrorKey>> = {};
	const name = values.name.trim();
	const email = values.email.trim();

	if (!isThemeCode(values.theme)) errors.theme = 'theme';
	if (!isPackageCode(values.package)) errors.package = 'package';
	if (name === '') errors.name = 'name';
	else if (name.length > NAME_MAX) errors.name = 'nameLong';
	if (email === '') errors.email = 'email';
	else if (email.length > 255 || !EMAIL.test(email)) errors.email = 'emailInvalid';
	if (values.whatsapp.trim() === '') errors.whatsapp = 'whatsapp';
	else if (normalizeWhatsapp(values.whatsapp) === null) errors.whatsapp = 'whatsappInvalid';
	if (!isEventType(values.eventType)) errors.eventType = 'eventType';
	if (values.eventDate === '') errors.eventDate = 'eventDate';
	else if (!isCalendarDate(values.eventDate)) errors.eventDate = 'eventDateInvalid';
	else if (values.eventDate < today) errors.eventDate = 'eventDatePast';
	if (values.notes.trim().length > NOTES_MAX) errors.notes = 'notesLong';
	if (!values.consent) errors.consent = 'consent';

	return errors;
}

/** The platform order for valid values. */
export function toOrderInput(values: OrderValues): OrderInput {
	return {
		packageCode: values.package,
		themeCode: values.theme,
		name: values.name.trim(),
		email: values.email.trim().toLowerCase(),
		phone: normalizeWhatsapp(values.whatsapp) ?? '',
		eventType: values.eventType,
		eventDate: values.eventDate,
		notes: values.notes.trim(),
	};
}

/** "20 Februari 2027", from Y-m-d, without shifting the day across time zones. */
export function formatEventDate(value: string, locale = 'id-ID') {
	return new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`));
}

export const formatRupiah = (amount: number) => `Rp${new Intl.NumberFormat('id-ID').format(amount)}`;

export interface ConsultationCopy {
	intro: string;
	theme: string;
	package: string;
	event: string;
	notes: string;
}

/** WhatsApp text for "Konsultasi dulu": the order summary, without email or phone. */
export function consultationMessage(copy: ConsultationCopy, summary: { theme: string; package: string; event: string; notes: string }) {
	return [
		copy.intro,
		copy.theme.replace('{value}', summary.theme),
		copy.package.replace('{value}', summary.package),
		copy.event.replace('{value}', summary.event),
		...(summary.notes.trim() ? [copy.notes.replace('{value}', summary.notes.trim())] : []),
	].join('\n');
}
