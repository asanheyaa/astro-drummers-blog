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

function applyFilter(category) {
	document.querySelectorAll('[data-filter-id]').forEach(el => {
		if(category==='all') {
			el.classList.add('--show');
		} else {
			el.classList.toggle('--show',el.dataset.filterId===category);

		}
	});
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

// function filterFunction() {
// 	const filters = document.querySelectorAll('[data-filter]');

// 	if (filters) {
// 		filters.forEach(filter => {
// 			const filterButtons = filter.querySelectorAll('[data-filter-category]');

// 			filterButtons.forEach(filterButton => {

// 				filterButton.addEventListener('click', (e) => {
// 					let filterSections = filter.querySelectorAll('[data-filter-content]')
// 					filterSections.forEach(filterSection => {
// 						if (filterSection.classList.contains('_show')) {
// 							filterSection.classList.remove('_show')
// 						}
// 						if (filterSection.classList.contains('_last-child')) {
// 							filterSection.classList.remove('_last-child')
// 						}

// 					});

// 					filterButtons.forEach(filterButton => {
// 						if (filterButton.classList.contains('_active')) {
// 							filterButton.classList.remove('_active')
// 						}
// 					});

// 					let seflButton = e.target,
// 						buttonId = seflButton.dataset.filterCategory

// 					if (buttonId === 'all') {
// 						filterSections.forEach((filterSection, index) => {
// 							filterSection.classList.add('_show')
// 							if (index === filterSections.length - 1) {
// 								filterSection.classList.add('_last-child')
// 							}
// 						});

// 					} else {
// 						const sectionsWithRightCategory = document.querySelectorAll(`[data-filter-content="${buttonId}"]`)

// 						sectionsWithRightCategory.forEach((sectionWithRightCategory, index) => {
// 							sectionWithRightCategory.classList.add('_show')
// 							if (index === sectionsWithRightCategory.length - 1) {
// 								sectionWithRightCategory.classList.add('_last-child')
// 							}
// 						});
// 					}

// 					seflButton.classList.add('_active')

// 				})
// 			});


// 		});
// 	}

// }

// filterFunction()