
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