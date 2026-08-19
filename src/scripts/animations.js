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
