import Lenis from 'lenis'


export const lenis = new Lenis({
	duration: 1.2,
	easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
	direction: 'vertical',
	gestureDirection: 'vertical',
	smoothHandheld: true,
});

export function unlockScroll() {
		lenis.start();
		document.body.classList.remove('_lock');
	}
	export function lockScroll() {
			lenis.stop();
			document.body.classList.add('_lock');
		}
export function initSmoothScroll() {

	function raf(time) {
		lenis.raf(time);
		requestAnimationFrame(raf);
	}
	requestAnimationFrame(raf);


const anchorLinks = document.querySelectorAll('a[href*="#"]');

anchorLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    const url = new URL(link.href);
    const isSamePage =
      url.origin === window.location.origin &&
      url.pathname === window.location.pathname;

    if (!isSamePage || !url.hash || url.hash === '#') return;

    e.preventDefault();

    const targetElement = document.querySelector(url.hash);
    if (targetElement) {
		if (link.closest('.secondary-menu')){
			  setTimeout(() => {
        scrollTo(targetElement);
      }, 200);
		} else {
			 scrollTo(targetElement);
		}
    
    }
  });
});
	function scrollTo(targetElement = 0) {
				unlockScroll()

		const header = document.querySelector('.header');
			lenis.scrollTo(targetElement, {
			// offset: -header.offsetHeight,
			duration: 1.5,
			immediate: false,
			easing: (t) => 1 - Math.pow(1 - t, 4)
		});
		
	}
	

	

		// top scroll button

		const topscrollButton = document.querySelector('.top-scroll-button')
	topscrollButton.addEventListener('click', (e) => {
		scrollTo()
	})
	
}

