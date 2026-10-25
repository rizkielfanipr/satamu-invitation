/** @type {import('stylelint').Config} */
export default {
	extends: ['stylelint-config-recommended'],
	overrides: [{ files: ['**/*.astro'], customSyntax: 'postcss-html' }],
	rules: {
		// One rule per selector: change the existing rule instead of adding a second one.
		'no-duplicate-selectors': true,
		'declaration-block-no-duplicate-properties': true,
		// Safari iOS clips filter: blur() to a square inside rounded, overflow-hidden containers. Use radial-gradient.
		'declaration-property-value-disallowed-list': { filter: ['/blur\\(/'] },
		// Scoped component styles make specificity order across components irrelevant.
		'no-descending-specificity': null,
		// Astro's :global() is allowed.
		'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['global'] }],
		// Tailwind CSS v4 directives in src/styles/global.css.
		'at-rule-no-unknown': [
			true,
			{ ignoreAtRules: ['theme', 'custom-variant', 'apply', 'utility', 'variant', 'source', 'plugin', 'reference'] },
		],
		// @apply takes Tailwind class names, which are not a CSS prelude.
		'at-rule-prelude-no-invalid': null,
	},
};
