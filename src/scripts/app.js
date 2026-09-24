
import { initAnimation, initParallax } from './animations.js';
import { initSmoothScroll } from './lenis-init.js';
import { initHeaderFunctions } from './header.js';
import { initPopUpFunctions } from './popUps.js';
import { initPreloader } from './preloader.js';
import { initCookiesPopup } from './cookies.js';

initPreloader()
document.addEventListener("DOMContentLoaded", () => {
	initSmoothScroll() 
	initPopUpFunctions()
	initHeaderFunctions()
	initAnimation()
	initParallax()
	initCookiesPopup()
})

const dropDowns = document.querySelectorAll('[data-dropdown]');

if (dropDowns.length > 0) {
	dropDowns.forEach(dropDown => {
		const trigger = dropDown.querySelector('[data-dropdown-trigger]');
		const dropDownBody = dropDown.querySelector('[data-dropdown-body]');
		let property
		if (dropDown.dataset.dropDown === 'vertical'){
			property = 'max-height'
		} else if (dropDown.dataset.dropDown === 'horizontal'){
		property = 'max-width'

		}
		if (!trigger || !dropDownBody) return; 

		trigger.addEventListener('click', (e) => {
			e.stopPropagation();
			
			const isActive = dropDownBody.classList.contains('_active');
			
			if (!isActive) {
				dropDownBody.style.overflow = 'hidden'; 
				dropDownBody.classList.add('_active');
				
				const fullHeight = dropDownBody.scrollHeight;
				dropDownBody.style.maxHeight = `${Math.min(fullHeight, 440)}px`;
				
				const enableScroll = (e) => {
					if (e.propertyName === property) {
						dropDownBody.style.overflow = 'auto';
						dropDownBody.removeEventListener('transitionend', enableScroll);
					}
				};
				dropDownBody.addEventListener('transitionend', enableScroll);
				
			} else {
				dropDownBody.style.overflow = 'hidden'; 
				dropDownBody.style.maxHeight = '0px';
				dropDownBody.classList.remove('_active');
			}
		});

		dropDownBody.addEventListener('click', (e) => {
			e.stopPropagation();
		});
	});

	document.addEventListener('click', () => {
		dropDowns.forEach(dropDown => {
			const dropDownBody = dropDown.querySelector('[data-dropdown-body]');
			if (dropDownBody && dropDownBody.classList.contains('_active')) {
				dropDownBody.style.overflow = 'hidden';
				dropDownBody.style.maxHeight = '0px';
				dropDownBody.classList.remove('_active');
			}
		});
	});
}


function getProductQuantity() {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; drummersblog_shopping_cart=`);
  
  let items = "";
  if (parts.length === 2) {
    const popped = parts.pop();
    if (popped) {
      items = popped.split(';').shift() || "";
    }
  } 
  
  let cart = items ? JSON.parse(decodeURIComponent(items)) : {};

  const totalQuantity = Object.values(cart).reduce((acc, curr) => {
    const qty = typeof curr === 'object' && curr !== null && 'quantity' in curr 
      ? Number(curr.quantity) 
      : 0;
    return acc + qty;
  }, 0);

  const cartCounters = document.querySelectorAll('[data-cart-counter]');
  if (cartCounters) {
	cartCounters.forEach(cartCounter => {
		if (totalQuantity === 0){
			cartCounter.classList.add('--empty')
		}
    cartCounter.innerHTML = `${totalQuantity}`;
		
	});
  }
}
getProductQuantity ()