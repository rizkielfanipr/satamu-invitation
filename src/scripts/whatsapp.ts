import { site } from '../config/site';

/** Link to a WhatsApp chat with the Satamu number and a prepared message. Safe to use at build time. */
export function whatsappUrl(message: string) {
	return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
