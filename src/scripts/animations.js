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
  const parallaxElements = document.querySelectorAll('[data-animation-parallax-wrapper]');
  if (!parallaxElements.length) return;



  lenis.on('scroll', (e) => {
    let scrollDistance = e.animatedScroll
      parallaxElements.forEach((el) => {
    const startElement =  el.offsetTop,
     endElement = el.offsetTop  + el.offsetHeight
     if (scrollDistance > startElement && scrollDistance < endElement){
     el.style.setProperty('--scrollDistance', scrollDistance - el.offsetTop);
el.style.setProperty('--scrollProgress', `${((scrollDistance - el.offsetTop) / el.offsetHeight) * 100}%`);
		el.classList.add('--in-animation')
    } else if (scrollDistance <= startElement) {
		el.classList.remove('--in-animation')
	}
  });
  });
}