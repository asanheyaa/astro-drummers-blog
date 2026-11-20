import {lockScroll,lenis,unlockScroll} from './lenis-init.js';

export function initPopUpFunctions() {
	const popUps=document.querySelectorAll('[data-pop-up]');
	if(popUps) {
		popUps.forEach(popUp => {
			const popUpId=popUp.dataset.popUp
			const triggers=document.querySelectorAll(`[data-pop-up-trigger="${popUpId}"]`);
			const closeButton=document.querySelector(`[data-pop-up-close="${popUpId}"]`)
			const path=popUp.querySelector(`[data-pop-up-back="${popUpId}"] path`);
			const dStart=path.getAttribute('d');
			const dEnd=popUp.getAttribute('data-opening');
			const speed=parseInt(popUp.getAttribute('data-speed'),10)||400;
			const anchorLinks=getLocalAnchorLinks();
			let isOpen=false;
			let currentAnimation=null;

			const commitPath=(d) => {
				path.setAttribute('d',d);
				if(currentAnimation) {
					currentAnimation.cancel();
					currentAnimation=null;
				}
			};
			if(triggers) {
				triggers.forEach(trigger => {
					trigger.addEventListener('click',() => {
						if(currentAnimation&&currentAnimation.playState==='running') {
							currentAnimation.cancel();
						}

						if(!isOpen) {
							openPopup()
						}
					});
					if(anchorLinks) {
						anchorLinks.forEach(anchorLink => {
							anchorLink.addEventListener('click',(e) => {
								e.preventDefault();

								closePopup()

								setTimeout(() => {
									const targetID=anchorLink.hash.slice(1);
									const targetElement=document.getElementById(targetID);

									scrollTo(targetElement)

								},500);
							})
						});
					}

					closeButton.addEventListener('click',closePopup)

					function closePopup() {
						popUp.classList.remove('_active');
						unlockScroll()
						currentAnimation=path.animate(
							[
								{d: `path("${dEnd}")`},
								{d: `path("${dStart}")`}
							],
							{
								duration: speed,
								delay: 100,
								easing: 'ease-in-out',
								fill: 'forwards'
							}
						);

						currentAnimation.onfinish=() => commitPath(dStart);
						isOpen=false;
					}
					function openPopup() {
						trigger.classList.add('_active');
						popUp.classList.add('_active');
						lockScroll()
						currentAnimation=path.animate(
							[
								{d: `path("${dStart}")`},
								{d: `path("${dEnd}")`}
							],
							{
								duration: speed,
								easing: 'ease-in-out',
								fill: 'forwards'
							}
						);

						currentAnimation.onfinish=() => commitPath(dEnd);
						isOpen=true;
					}

				});
			}



			function getLocalAnchorLinks() {
				const currentPath=window.location.pathname;
				const allLinks=popUp.querySelectorAll('a');

				return Array.from(allLinks).filter(link => {
					const hasHash=link.hash&&link.hash!=='#';
					const isSamePage=link.pathname===currentPath;

					return hasHash&&isSamePage;
				});
			}


		});
	}

}

const LEAVE_MS=200;
const ENTER_MS=300;
const STAGGER_MS=40;

let currentCategory=null;
let leaveTimer=null;
let cleanupTimer=null;

function applyFilter(category) {
	if(category===currentCategory) return;
	currentCategory=category;

	clearTimeout(leaveTimer);
	clearTimeout(cleanupTimer);

	const all=[...document.querySelectorAll('[data-filter-id]')];

	all.forEach((el) => {
		el.classList.remove('--leaving','--enter','--entering');
		el.style.transitionDelay='';
	});

	const shouldShow=(el) => category==='all'||el.dataset.filterId===category;

	const leaving=all.filter((el) => el.classList.contains('--show'));
	const entering=all.filter(shouldShow);

	leaving.forEach((el) => el.classList.add('--leaving'));

	leaveTimer=setTimeout(() => {
		leaving.forEach((el) => el.classList.remove('--show','--leaving'));

		entering.forEach((el) => el.classList.add('--show','--enter'));

		void document.body.offsetHeight;

		requestAnimationFrame(() => {
			entering.forEach((el,i) => {
				el.style.transitionDelay=`${i*STAGGER_MS}ms`;
				el.classList.remove('--enter');
				el.classList.add('--entering');
			});
		});

		cleanupTimer=setTimeout(() => {
			entering.forEach((el) => {
				el.classList.remove('--entering');
				el.style.transitionDelay='';
			});
		},ENTER_MS+entering.length*STAGGER_MS+50);
	},leaving.length? LEAVE_MS:0);
}

export function initDropdowns() {
	const dropDowns=document.querySelectorAll('[data-dropdown]');
	if(dropDowns.length>0) {
		dropDowns.forEach(dropDown => {
			const trigger=dropDown.querySelector('[data-dropdown-trigger]');
			const dropDownBody=dropDown.querySelector('[data-dropdown-body]');
			let property
			if(dropDown.dataset.dropdown==='vertical') {
				property='max-height'
			} else if(dropDown.dataset.dropdown==='horizontal') {
				property='max-width'
			}
			if(!trigger||!dropDownBody) return;

			trigger.addEventListener('click',(e) => {
				e.stopPropagation();

				const isActive=dropDownBody.classList.contains('_active');
				const isMobile=window.matchMedia('(max-width: 767.98px)').matches
				if(!isActive) {
					dropDownBody.style.overflow='hidden';
					dropDownBody.classList.add('_active');

					const fullHeight=dropDownBody.scrollHeight;
					dropDownBody.style.maxHeight=`${Math.min(fullHeight,440)}px`;
					dropDownBody.addEventListener('transitionend',enableScroll);
					if(isMobile) {
						lockScroll()
					}
				} else {
					dropDownBody.style.overflow='hidden';
					dropDownBody.style.maxHeight='0px';
					dropDownBody.classList.remove('_active');
					if(isMobile) {
						unlockScroll()
					}
				}

				function enableScroll(e) {
					if(e.propertyName===property) {
						dropDownBody.style.overflow='auto';
						dropDownBody.removeEventListener('transitionend',enableScroll);
					}
				};
			});

			if(dropDown.hasAttribute('data-filter')) {
				const buttonValue=trigger.querySelector('.filter__value')
				dropDown.addEventListener('click',(e) => {
					const item=e.target.closest('[data-filter-category]');
					if(!item||!dropDown.contains(item)) return;
					applyFilter(item.dataset.filterCategory);
					if(buttonValue) buttonValue.textContent=item.textContent.trim();
				});
			}
		});

		document.addEventListener('click',(e) => {
			const target=e.target
			const isMobile=window.matchMedia('(max-width: 767.98px)').matches

			dropDowns.forEach(dropDown => {
				const dropDownBody=dropDown.querySelector('[data-dropdown-body]');
				const isCloseButtonClick=target.closest('[data-dropdown-close]')&&dropDown.contains(target);
				const isCloseFilterWrapper=target.closest('.filter__wrapper')!==dropDown.querySelector('.filter__wrapper');
				if(isCloseButtonClick||isCloseFilterWrapper) {
					if(dropDownBody.classList.contains('_active')) {
						dropDownBody.style.overflow='hidden';
						dropDownBody.style.maxHeight='0px';
						dropDownBody.classList.remove('_active');
						if(isMobile) {
							unlockScroll()
						}
					}
				}
			});
		});
	}
}

