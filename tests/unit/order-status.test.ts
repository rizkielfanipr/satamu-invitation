import { expect, it } from 'vitest';
import { viewFor } from '../../src/scripts/order-status';

const status = (order_status: string, payment_status: string | null) => ({
	invoice_number: 'SAT-202611-000001',
	order_status,
	payment_status,
	checkout_url: null,
});

it.each([
	['CONFIRMED', 'PAID', 'paid'],
	['PENDING_PAYMENT', 'PAID', 'paid'],
	['CANCELLED', 'PAID', 'paid'],
	['PENDING_PAYMENT', 'PENDING', 'pending'],
	['PENDING_PAYMENT', 'CREATED', 'pending'],
	['PENDING_PAYMENT', 'FAILED', 'retry'],
	['PENDING_PAYMENT', 'EXPIRED', 'retry'],
	['PENDING_PAYMENT', null, 'retry'],
	['EXPIRED', 'EXPIRED', 'closed'],
	['CANCELLED', null, 'closed'],
])('order %s with payment %s shows %s', (order, payment, view) => {
	expect(viewFor(status(order, payment))).toBe(view);
});
