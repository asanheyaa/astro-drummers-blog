// home page
import Swiper from 'swiper';
import {Pagination,Autoplay,Thumbs,Navigation} from 'swiper/modules';


const homeHeroSwiper=document.querySelector('.content-home-hero__swiper');

if(homeHeroSwiper) {
	const heroSwiper=new Swiper(homeHeroSwiper,{
		modules: [Autoplay,Pagination],
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

const postSwiper=document.querySelector('.home-articles__swiper');

if(postSwiper) {
	const articlesSwiper=new Swiper(postSwiper,{
		modules: [Pagination,Autoplay],
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


const relatedPostsSwiper=document.querySelector('.single-post-related__swiper');
if(relatedPostsSwiper) {
	const relatedProductsSwiperInit=new Swiper(relatedPostsSwiper,{
		slidesPerView: 1,

		speed: 1000,

		spaceBetween: 20,
		breakpoints: {
			400: {
				slidesPerView: 1.3,
			},
			530: {
				slidesPerView: 2,

			},
			768: {
				slidesPerView: 2,
				spaceBetween: 40,
			},

		}
	});
}


const relatedProductsSwiper=document.querySelector('.related-products__swiper');

if(relatedProductsSwiper) {
	const relatedProductsSwiperInit=new Swiper(relatedProductsSwiper,{
		modules: [Navigation],
		slidesPerView: 'auto',

		speed: 1000,

		spaceBetween: 22.5,
		navigation: {
			nextEl: '.related-products__nav-button-next',
			prevEl: '.related-products__nav-button-prev',
		  },
	});
}