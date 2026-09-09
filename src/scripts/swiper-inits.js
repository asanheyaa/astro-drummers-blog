// home page
import Swiper from 'swiper';
import { Pagination,Autoplay, Thumbs } from 'swiper/modules';


	const homeHeroSwiper = document.querySelector('.content-home-hero__swiper');

if (homeHeroSwiper) {
	const heroSwiper = new Swiper(homeHeroSwiper, {
		modules: [ Autoplay, Pagination],
		slidesPerView: 1,
		spaceBetween: 15,
		loop: true,
		speed: 1000,
		autoplay: {
			delay: 4000,
			pauseOnMouseEnter: true,
			disableOnInteraction: false,
		},
		pagination: {
			el: '.content-home-hero__pagination',
			type: 'bullets',
			clickable: true,
		},
	});
}

const postSwiper = document.querySelector('.home-articles__swiper');

if (postSwiper) {
	const articlesSwiper = new Swiper(postSwiper, {
		modules: [Pagination, Autoplay],
		slidesPerView: 1,
		spaceBetween: 15,
		loop: true,
		speed: 1000,
		autoplay: {
			delay: 4000,
			pauseOnMouseEnter: true,
			disableOnInteraction: false,
		},
		pagination: {
			el: '.home-articles__pagination',
			type: 'bullets',
			clickable: true,
		},
		breakpoints: {
			500: {
				slidesPerView: 1.5,
			},
			690: {
				slidesPerView: 2,
			},
			992: {
				slidesPerView: 3,
			}
		}
	});
	
}


const relatedPostsSwiper = document.querySelector('.single-post-related__swiper');
if (relatedPostsSwiper){
	const heroSwiper = new Swiper(relatedPostsSwiper, {
		modules: [ Autoplay],
		slidesPerView: 1,
		spaceBetween: 20,
		breakpoints: {
			400: {
				slidesPerView: 1.3,
			},
			530: {
				slidesPerView: 2,
			},
			768: {
				slidesPerView: 3,
			},
			
		}
	});
}

const productGalleryFirstSwiperEl = document.querySelector('.gallery-product-first-swiper');
const productGallerySecondarySwiperEl = document.querySelector('.gallery-product-secondary-swiper');

if (productGalleryFirstSwiperEl && productGallerySecondarySwiperEl){
	const productGalleryFirstSwiper = new Swiper(productGalleryFirstSwiperEl, {
        spaceBetween: 15,
        slidesPerView: 3,
        freeMode: true,
        watchSlidesProgress: true,
		 slideToClickedSlide: true, 
		 speed: 1000,

		  observer: true,
  observeParents: true,
  resizeObserver: true,
		 breakpoints: {
			380: {
				slidesPerView: 4,
				 spaceBetween: 15,
			},
			550: {
				slidesPerView: 5,
				spaceBetween: 20,
			},
			
			
		}
      });

	   const productGallerySecondarySwiper = new Swiper(productGallerySecondarySwiperEl, {
        spaceBetween: 20,
         modules: [Thumbs], 
		 speed: 1000,
        thumbs: {
          swiper: productGalleryFirstSwiper,
        },
		
      });
}