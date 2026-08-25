
import { initAnimation, initParallax } from './animations.js';
import { initSmoothScroll } from './lenis-init.js';
import { initHeaderFunctions } from './header.js';
import { initPopUpFunctions } from './popUps.js';
import { initPreloader } from './preloader.js';

document.addEventListener("DOMContentLoaded", () => {
	initSmoothScroll() 
	initPreloader()
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