export function initHeaderFunctions() {
	
// burger-menu
	const burgerMenu = document.querySelector('.burger-menu'),
		headerWrapper = document.querySelector('.header__wrapper')


	window.addEventListener('click', (e) => {
		let target = e.target
		if (target.closest('.burger-menu')) {
			headerWrapper.classList.add('_active');
			lockScroll()
			return

		} else if (!target.closest('.header__body') || target.closest('.header__close-button')) {
			if (headerWrapper.classList.contains('_active')) {
				headerWrapper.classList.remove('_active');
				unlockScroll()
			}
		}
	});

	// animation header on scroll
	const header = document.querySelector('.header'),
		topscrollButton = document.querySelector('.top-scroll-button')
	if (header) {
		window.addEventListener('scroll', (e) => {
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
		})
	}
}
