/**
 * Swiper Initialization
 * Converted from swiper-script.js
 *
 * Initializes Swiper instances for partner and testimonial carousels.
 * Uses the global Swiper object from the vendor bundle (swiper-bundle.min.js)
 * which is loaded via a script tag on pages that need it.
 */

declare const Swiper: any;

document.addEventListener('DOMContentLoaded', () => {
  if (typeof Swiper === 'undefined') return;

  // Partner carousel
  const partnerEl = document.querySelector('.swiper.swiperPartner');
  if (partnerEl) {
    new Swiper('.swiper.swiperPartner', {
      autoplay: {
        delay: 1000,
      },
      speed: 1000,
      slidesPerView: 6,
      spaceBetween: 20,
      loop: true,
      grabCursor: true,
      breakpoints: {
        1025: {
          slidesPerView: 6,
        },
        767: {
          slidesPerView: 4,
        },
        230: {
          slidesPerView: 3,
        },
      },
      pagination: {
        enabled: true,
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true,
      },
    });
  }

  // Testimonial carousel
  const testimonialEl = document.querySelector('.swiper.swiperTestimonial');
  if (testimonialEl) {
    new Swiper('.swiper.swiperTestimonial', {
      autoplay: {
        delay: 5000,
      },
      speed: 1000,
      slidesPerView: 3,
      spaceBetween: 50,
      loop: true,
      grabCursor: true,
      breakpoints: {
        1025: {
          slidesPerView: 3,
        },
        769: {
          slidesPerView: 2,
        },
        319: {
          slidesPerView: 1,
        },
      },
    });
  }
});
