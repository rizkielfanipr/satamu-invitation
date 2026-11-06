import { describe, expect, it } from 'vitest';
import {
	consultationMessage,
	formatEventDate,
	isCalendarDate,
	normalizeWhatsapp,
	readPreselection,
	toOrderInput,
	validateOrder,
	type OrderValues,
} from '../../src/scripts/order-form';

const TODAY = '2026-11-06';
const valid: OrderValues = {
	theme: 'T01',
	package: 'SAT-SPESIAL',
	name: '  Sari Lestari ',
	email: ' Sari@Example.com ',
	whatsapp: '0812 3456 7890',
	eventType: 'wedding',
	eventDate: '2027-02-20',
	notes: '',
	consent: true,
};

describe('readPreselection', () => {
	it('keeps a known theme and package from a CTA', () => {
		expect(readPreselection('?theme=T05&package=SAT-ISTIMEWA')).toEqual({ theme: 'T05', package: 'SAT-ISTIMEWA' });
		expect(readPreselection('?theme=t02&package=sat-spesial')).toEqual({ theme: 'T02', package: 'SAT-SPESIAL' });
	});

	it('drops unknown or malformed values without failing', () => {
		expect(readPreselection('?theme=T99&package=PW-LANDING-STARTER')).toEqual({});
		expect(readPreselection('?theme=<script>&package=')).toEqual({});
		expect(readPreselection('?package=SAT-SEDERHANA&theme=%E0%A4%A')).toEqual({ package: 'SAT-SEDERHANA' });
		expect(readPreselection('')).toEqual({});
	});
});

describe('normalizeWhatsapp', () => {
	it.each([
		['081234567890', '6281234567890'],
		['0812-3456-7890', '6281234567890'],
		['+62 812 3456 7890', '6281234567890'],
		['6281234567890', '6281234567890'],
		['(0812) 3456.7890', '6281234567890'],
	])('normalises %s', (raw, expected) => expect(normalizeWhatsapp(raw)).toBe(expected));

	it.each(['', '12345', '0212345678', '+1 415 555 0100', '08123', '08123456789012345', '62-abc'])('rejects %s', (raw) =>
		expect(normalizeWhatsapp(raw)).toBeNull(),
	);
});

describe('validateOrder', () => {
	it('accepts a complete order', () => {
		expect(validateOrder(valid, TODAY)).toEqual({});
	});

	it.each<[Partial<OrderValues>, string, string]>([
		[{ theme: '' }, 'theme', 'theme'],
		[{ theme: 'T99' }, 'theme', 'theme'],
		[{ package: 'PW-LANDING-STARTER' }, 'package', 'package'],
		[{ name: '   ' }, 'name', 'name'],
		[{ name: 'a'.repeat(256) }, 'name', 'nameLong'],
		[{ email: '' }, 'email', 'email'],
		[{ email: 'sari@' }, 'email', 'emailInvalid'],
		[{ email: 'sari@example' }, 'email', 'emailInvalid'],
		[{ whatsapp: '' }, 'whatsapp', 'whatsapp'],
		[{ whatsapp: '021 555 1234' }, 'whatsapp', 'whatsappInvalid'],
		[{ eventType: 'graduation' }, 'eventType', 'eventType'],
		[{ eventDate: '' }, 'eventDate', 'eventDate'],
		[{ eventDate: '2027-02-30' }, 'eventDate', 'eventDateInvalid'],
		[{ eventDate: '20-02-2027' }, 'eventDate', 'eventDateInvalid'],
		[{ eventDate: '2026-11-05' }, 'eventDate', 'eventDatePast'],
		[{ notes: 'a'.repeat(2001) }, 'notes', 'notesLong'],
		[{ consent: false }, 'consent', 'consent'],
	])('reports %o as %s: %s', (change, field, key) => {
		expect(validateOrder({ ...valid, ...change }, TODAY)).toEqual({ [field]: key });
	});

	it('accepts an event today and optional empty notes', () => {
		expect(validateOrder({ ...valid, eventDate: TODAY, notes: '' }, TODAY)).toEqual({});
	});
});

describe('toOrderInput', () => {
	it('trims and normalises what is sent to the platform', () => {
		expect(toOrderInput({ ...valid, notes: '  Adat Jawa  ' })).toEqual({
			packageCode: 'SAT-SPESIAL',
			themeCode: 'T01',
			name: 'Sari Lestari',
			email: 'sari@example.com',
			phone: '6281234567890',
			eventType: 'wedding',
			eventDate: '2027-02-20',
			notes: 'Adat Jawa',
		});
	});
});

it('checks calendar dates strictly', () => {
	expect(isCalendarDate('2028-02-29')).toBe(true);
	expect(isCalendarDate('2027-02-29')).toBe(false);
	expect(isCalendarDate('2027-2-1')).toBe(false);
});

it('formats the event date without shifting the day', () => {
	expect(formatEventDate('2027-02-20')).toBe('20 Februari 2027');
});

it('builds a consultation message without contact details', () => {
	const message = consultationMessage(
		{ intro: 'Halo Satamu:', theme: 'Tema: {value}', package: 'Paket: {value}', event: 'Acara: {value}', notes: 'Catatan: {value}' },
		{ theme: 'Arunika (T01)', package: 'Spesial', event: 'Pernikahan, 20 Februari 2027', notes: '' },
	);

	expect(message).toBe('Halo Satamu:\nTema: Arunika (T01)\nPaket: Spesial\nAcara: Pernikahan, 20 Februari 2027');
	expect(message).not.toContain('@');
});
