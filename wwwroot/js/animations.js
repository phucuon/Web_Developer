(() => {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 991.98px)').matches;

  const initAOS = () => {
    if (typeof window.AOS === 'undefined') return;
    window.AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 80,
      disable: () => prefersReduced || window.innerWidth < 768
    });
  };

  const initTyped = () => {
    if (typeof window.Typed === 'undefined') return;
    if (!document.getElementById('hero-typed')) return;
    new window.Typed('#hero-typed', {
      strings: ['không phai', 'không quên', 'mãi mãi'],
      typeSpeed: 80,
      backSpeed: 50,
      backDelay: 1800,
      loop: true,
      smartBackspace: true
    });
  };

  const initParticles = () => {};

  const initCounters = () => {
    if (typeof window.countUp === 'undefined') return;
    const Counter = window.countUp.CountUp;
    const elements = document.querySelectorAll('[data-count]');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        if (el.dataset.counted === 'true') return;
        const target = parseFloat(el.dataset.count) || 0;
        const suffix = el.dataset.suffix || '';
        const counter = new Counter(el, target, { duration: 2.2, separator: ',', suffix });
        if (!counter.error) counter.start();
        else el.textContent = target + suffix;
        el.dataset.counted = 'true';
        observer.unobserve(el);
      });
    }, { threshold: 0.4 });

    elements.forEach(el => observer.observe(el));
  };

  const initGsapAnimations = () => {
    if (typeof window.gsap === 'undefined') return;
    const gsap = window.gsap;
    if (typeof window.ScrollTrigger !== 'undefined') gsap.registerPlugin(window.ScrollTrigger);

    gsap.from('.site-header', { y: -50, opacity: 0, duration: 0.8, ease: 'power2.out' });

    if (!prefersReduced) {
      const scrollIndicator = document.querySelector('.scroll-indicator');
      if (scrollIndicator) gsap.to(scrollIndicator, { y: 8, duration: 1.4, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    }

    if (typeof window.ScrollTrigger !== 'undefined') {
      const linePath = document.querySelector('.process-line-path');
      if (linePath) {
        window.ScrollTrigger.create({
          trigger: '.process-section',
          start: 'top 70%',
          once: true,
          onEnter: () => linePath.classList.add('is-drawn')
        });
      }
    }
  };

  const onReady = () => {
    initAOS();
    initTyped();
    initCounters();
    initGsapAnimations();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', onReady);
  else onReady();
})();
