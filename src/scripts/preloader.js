import { lockScroll, lenis, unlockScroll } from './lenis-init.js';

export function initPreloader() {
	// preloader
	const preloader = document.querySelector('[data-preloader]');
	if (preloader) {
		const percentageDisplay = document.querySelector('[data-preloader-percentage]');

		if (!preloader || !percentageDisplay) return;

		const images = Array.from(document.images).filter(img => img.loading !== 'lazy');
		const total = images.length;
		let loaded = 0;
		let current = 0;
		let target = total === 0 ? 100 : 0;

		function updateTarget() {
			target = Math.min(100, Math.round((loaded / total) * 100));
		}

		function onResourceDone() {
			loaded++;
			updateTarget();
		}

		images.forEach(img => {
			if (img.complete) {
				onResourceDone();
			} else {
				img.addEventListener('load', onResourceDone, { once: true });
				img.addEventListener('error', onResourceDone, { once: true });
			}
		});

		function forceComplete() {
			target = 100;
		}
		if (document.readyState === 'complete') {
			forceComplete();
		} else {
			window.addEventListener('load', forceComplete, { once: true });
		}

		function animate() {
			if (current < target) {
				current += Math.max(1, Math.ceil((target - current) / 8));
				if (current > target) current = target;
				percentageDisplay.textContent = `${current}%`;
			}

			if (current < 100) {
				requestAnimationFrame(animate);
			} else {
				setTimeout(hidePreloader, 300);
			}
		}

		function hidePreloader() {
			preloader.classList.add('_hide')
			const animElems = document.querySelectorAll('[data-anim-after-loading]');
			if (animElems) {
				animElems.forEach(animElem => {
					animElem.classList.add('--start-anim')
				});
			}
			unlockScroll()
		}

		lockScroll()
		requestAnimationFrame(animate);
	}
}



