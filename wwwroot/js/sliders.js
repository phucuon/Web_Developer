(() => {
  'use strict';

  const initTestimonialsSlider = () => {
    const el = document.querySelector('.testimonials-swiper');
    if (!el || typeof window.Swiper === 'undefined') return;
    new window.Swiper(el, {
      slidesPerView: 1,
      effect: 'fade',
      fadeEffect: { crossFade: true },
      loop: true,
      autoplay: { delay: 5000, disableOnInteraction: false },
      pagination: { el: '.testimonials-pagination', clickable: true },
      navigation: { prevEl: '.testimonials-prev', nextEl: '.testimonials-next' },
      a11y: { enabled: true }
    });
  };

  const initNewsSlider = () => {
    const el = document.querySelector('.news-swiper');
    if (!el || typeof window.Swiper === 'undefined') return;
    new window.Swiper(el, {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: false,
      watchOverflow: true,
      autoplay: { delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true },
      pagination: { el: '.news-pagination', clickable: true },
      navigation: { prevEl: '.news-prev', nextEl: '.news-next' },
      breakpoints: {
        768: { slidesPerView: 2, spaceBetween: 24 },
        1200: { slidesPerView: 3, spaceBetween: 24 }
      },
      a11y: { enabled: true }
    });
  };

  const onReady = () => {
    initTestimonialsSlider();
    initNewsSlider();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
})();
