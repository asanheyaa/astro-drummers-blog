
import { initAnimation, initParallax } from './animations.js';
import { initSmoothScroll } from './lenis-init.js';
import { initHeaderFunctions } from './header.js';
import { initPopUpFunctions } from './popUps.js';
import { initPreloader } from './preloader.js';

initPreloader()
document.addEventListener("DOMContentLoaded", () => {
	initSmoothScroll() 
	initPopUpFunctions()
	initHeaderFunctions()
	initAnimation()
	initParallax()
})

const dropDowns = document.querySelectorAll('[data-dropdown]');

if (dropDowns) {
	dropDowns.forEach(dropDown => {
		const dropDownBody = dropDown.parentElement.querySelector('[data-dropdown-body]');
		const trigger = dropDown.parentElement.querySelector('[data-dropdown-trigger]');

		trigger.addEventListener('click', (e) => {
			e.stopPropagation();
			dropDownBody.classList.toggle('_active');
		});

		dropDownBody.addEventListener('click', (e) => {
			e.stopPropagation();
		});
	});

	document.addEventListener('click', () => {
		dropDowns.forEach(dropDown => {
			const dropDownBody = dropDown.parentElement.querySelector('[data-dropdown-body]');
			dropDownBody.classList.remove('_active');
		});
	});
}
function getProductQuantity() {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; dremmersblog_shopping_cart=`);
  
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