import { lockScroll,lenis, unlockScroll } from './lenis-init.js';

export function initHeaderFunctions() {

	// animation header on scroll
	const header = document.querySelector('.header'),
		topscrollButton = document.querySelector('.top-scroll-button')
	if (header) {
		window.addEventListener('scroll', onScrollFunction)

		onScrollFunction()
		function onScrollFunction(e) {
			const scrollDistance = window.scrollY
			if (scrollDistance >= 20) {
				header.classList.add('--on-scroll')
			} else {
				header.classList.remove('--on-scroll')
			}


			if (scrollDistance > window.innerHeight) {
				topscrollButton.classList.add('_active')
			} else {
				topscrollButton.classList.remove('_active')
			}
		}
	}
}

function openMenu(wrapper) {
	if (wrapper.classList.contains('_active')) return;
	wrapper.classList.add('_active');
	lockScroll();
}

function closeMenu(wrapper) {
	if (!wrapper.classList.contains('_active')) return;
	wrapper.classList.remove('_active');
	unlockScroll();
}

export function initMenus() {

	window.addEventListener('click', (e) => {
		const trigger = e.target.closest('[data-menu-trigger]');

		if (trigger) {
			const id = trigger.dataset.menuTrigger;
			const wrapper = document.querySelector(`[data-menu-wrapper="${id}"]`);
			if (!wrapper) return;

			document.querySelectorAll('[data-menu-wrapper]._active').forEach((w) => {
				if (w !== wrapper) closeMenu(w);
			});
			openMenu(wrapper);
			return;
		}

		const body = e.target.closest('[data-menu-body]');
		const collapse = e.target.closest('[data-menu-collapse]');

		document.querySelectorAll('[data-menu-wrapper]._active').forEach((wrapper) => {
			const id = wrapper.dataset.menuWrapper;
			const insideBody = body?.dataset.menuBody === id;
			const clickedCollapse = collapse?.dataset.menuCollapse === id;
			if (!insideBody || clickedCollapse) closeMenu(wrapper);
		});
	});
}
