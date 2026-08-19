import { lockScroll,lenis, unlockScroll } from './lenis-init.js';

export function initPopUpFunctions() {
	const popUps = document.querySelectorAll('[data-pop-up]');
	if (popUps) {
		popUps.forEach(popUp => {
			const popUpId = popUp.dataset.popUp
			const triggers = document.querySelectorAll(`[data-pop-up-trigger="${popUpId}"]`);
			const closeButton = document.querySelector(`[data-pop-up-close="${popUpId}"]`)
			const path = popUp.querySelector(`[data-pop-up-back="${popUpId}"] path`);
			const dStart = path.getAttribute('d');
			const dEnd = popUp.getAttribute('data-opening');
			const speed = parseInt(popUp.getAttribute('data-speed'), 10) || 400;
			const anchorLinks = getLocalAnchorLinks();
			let isOpen = false;
			let currentAnimation = null;

			const commitPath = (d) => {
				path.setAttribute('d', d);
				if (currentAnimation) {
					currentAnimation.cancel();
					currentAnimation = null;
				}
			};
			if (triggers) {
				triggers.forEach(trigger => {
					trigger.addEventListener('click', () => {
						if (currentAnimation && currentAnimation.playState === 'running') {
							currentAnimation.cancel();
						}

						if (!isOpen) {
							openPopup()
						}
					});
					if (anchorLinks) {
						anchorLinks.forEach(anchorLink => {
							anchorLink.addEventListener('click', (e) => {
								e.preventDefault();

								closePopup()

								setTimeout(() => {
									const targetID = anchorLink.hash.slice(1);
									const targetElement = document.getElementById(targetID);

									scrollTo(targetElement)

								}, 500);
							})
						});
					}

					closeButton.addEventListener('click', closePopup)

					function closePopup() {
						popUp.classList.remove('_active');
						unlockScroll()
						currentAnimation = path.animate(
							[
								{ d: `path("${dEnd}")` },
								{ d: `path("${dStart}")` }
							],
							{
								duration: speed,
								delay: 100,
								easing: 'ease-in-out',
								fill: 'forwards'
							}
						);

						currentAnimation.onfinish = () => commitPath(dStart);
						isOpen = false;
					}
					function openPopup() {
						trigger.classList.add('_active');
						popUp.classList.add('_active');
						lockScroll()
						currentAnimation = path.animate(
							[
								{ d: `path("${dStart}")` },
								{ d: `path("${dEnd}")` }
							],
							{
								duration: speed,
								easing: 'ease-in-out',
								fill: 'forwards'
							}
						);

						currentAnimation.onfinish = () => commitPath(dEnd);
						isOpen = true;
					}

				});
			}



			function getLocalAnchorLinks() {
				const currentPath = window.location.pathname;
				const allLinks = popUp.querySelectorAll('a');

				return Array.from(allLinks).filter(link => {
					const hasHash = link.hash && link.hash !== '#';
					const isSamePage = link.pathname === currentPath;

					return hasHash && isSamePage;
				});
			}


		});
	}

}
