import { content, type Locale } from '../i18n/content';

/**
 * Permanent Prasetya Platform package codes, in the order of `packages.items` (cheapest first). Never renumber or
 * reuse a code. The prices in `content.ts` are display copy only: the order dialog shows the platform price, and the
 * platform charges its own catalogue price.
 */
export const packageCodes = ['SAT-SEDERHANA', 'SAT-SPESIAL', 'SAT-ISTIMEWA'] as const;

export type PackageCode = (typeof packageCodes)[number];

export const isPackageCode = (value: unknown): value is PackageCode => packageCodes.includes(value as PackageCode);

export function packagesFor(locale: Locale) {
	const items = content[locale].packages.items;
	if (items.length !== packageCodes.length) throw new Error('packages.items and packageCodes are out of step');
	return items.map((item, index) => ({ ...item, code: packageCodes[index], popular: 'popular' in item && item.popular }));
}
