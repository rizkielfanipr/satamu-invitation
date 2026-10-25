/**
 * Category filter for a theme grid (`[data-theme-grid]`): shows the cards of the chosen category,
 * at most `data-limit` of them. On the catalog, `?category=<key>` preselects a filter.
 */
export function initThemeFilter(root: HTMLElement) {
	const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-theme-filter]'));
	const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-theme-card]'));
	const limit = Number(root.dataset.limit) || Infinity;

	function apply(category: string) {
		let shown = 0;
		cards.forEach((card) => {
			const visible = (category === 'all' || card.dataset.category === category) && shown < limit;
			card.hidden = !visible;
			if (visible) shown++;
		});
		buttons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.themeFilter === category)));
	}

	buttons.forEach((button) => button.addEventListener('click', () => apply(button.dataset.themeFilter ?? 'all')));

	const requested = new URLSearchParams(window.location.search).get('category');
	if (requested && buttons.some((button) => button.dataset.themeFilter === requested)) apply(requested);
}
