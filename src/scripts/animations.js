import { lenis } from './lenis-init.js';


export function initAnimation (){
 const animationItems = document.querySelectorAll('[data-animation-on-scroll]');
	if (animationItems) {
		const options = {
			root: null,
			rootMargin: "0px",
			threshold: 0.15
		};

		const callback = (entries, observer) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					entry.target.classList.add("_active");

					observer.unobserve(entry.target);
				}
			});
		};

		const observer = new IntersectionObserver(callback, options);
		animationItems.forEach(animationItem => {
			observer.observe(animationItem);

		});
	}
}

export function initParallax() {
  const parallaxElements = document.querySelectorAll('[data-animation-parallax]');
  if (parallaxElements){
const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

  const items = Array.from(parallaxElements).map((el) => ({
    el,
    speed: parseFloat(el.dataset.animationParallax) || 0.3,
    hasOpacity: el.hasAttribute('data-animation-parallax-opacity'),
    opacitySpeed: parseFloat(el.dataset.animationParallaxOpacity) || 2.5,
    baseline: null,
  }));

  function computeOpacityRaw(el, windowHeight) {
    const rect = el.getBoundingClientRect();
    const elementCenter = rect.top + rect.height / 2;
    const viewportCenter = windowHeight / 2;
    const distance = Math.abs(elementCenter - viewportCenter) / (windowHeight / 2);
    return 1 - distance;
  }

  function updateParallax() {
    const scrollY = lenis.scroll;
    const windowHeight = window.innerHeight;

    items.forEach((item) => {
      const { el, speed, hasOpacity, opacitySpeed } = item;

      if (item.baseline === null) {
        item.baseline = {
          scroll: scrollY,
          opacityRaw: hasOpacity ? computeOpacityRaw(el, windowHeight) : null,
        };
      }

      const offset = (scrollY - item.baseline.scroll) * speed;
      el.style.transform = `translate3d(0, ${offset}px, 0)`;

      if (hasOpacity) {
        const rawNow = computeOpacityRaw(el, windowHeight);
        const delta = rawNow - item.baseline.opacityRaw;
        // Множимо дельту на opacitySpeed - швидший спад/наростання
        const opacity = clamp(1 + delta * opacitySpeed);
        el.style.opacity = opacity;
      }
    });
  }

  lenis.on('scroll', updateParallax);
  window.addEventListener('resize', () => {
    items.forEach((item) => (item.baseline = null));
    updateParallax();
  }, { passive: true });

  updateParallax();
}
}