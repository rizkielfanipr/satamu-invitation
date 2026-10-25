/**
 * Site header behaviour: sets `data-scrolled` once the page moves (the header then floats as a rounded bar)
 * and closes the mobile menu after a link is chosen.
 */
export function initSiteHeader(header: HTMLElement) {
	let frame: number | null = null;
	const update = () => {
		header.toggleAttribute('data-scrolled', window.scrollY > 24);
		frame = null;
	};
	window.addEventListener(
		'scroll',
		() => {
			frame ??= window.requestAnimationFrame(update);
		},
		{ passive: true },
	);
	update();

	header
		.querySelectorAll('[data-mobile-menu] a')
		.forEach((link) => link.addEventListener('click', () => link.closest('details')?.removeAttribute('open')));
}
