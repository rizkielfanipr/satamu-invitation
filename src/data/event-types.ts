/**
 * Event types the order form offers. The code is sent to Prasetya Platform as `details.event_type`; labels are in
 * `order.eventTypes` in content.ts. Codes are permanent once orders use them. The list is provisional until the
 * business confirms which events Satamu serves (docs/payment-checkout-plan.md).
 */
export const eventTypes = ['wedding', 'engagement', 'aqiqah', 'khitan', 'birthday', 'other'] as const;

export type EventType = (typeof eventTypes)[number];

export const isEventType = (value: unknown): value is EventType => eventTypes.includes(value as EventType);
