
import { initAnimation, initParallax } from './animations.js';
import { initSmoothScroll } from './lenis-init.js';
import { initHeaderFunctions } from './header.js';
import { initPopUpFunctions, initDropdowns } from './popUps.js';
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
  initDropdowns()
})



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
      if (totalQuantity === 0) {
        cartCounter.classList.add('--empty')
      }
      cartCounter.innerHTML = `${totalQuantity}`;

    });
  }
}
getProductQuantity()