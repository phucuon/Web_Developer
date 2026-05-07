(() => {
  'use strict';

  const header = document.getElementById('site-header');
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.getElementById('primary-menu');
  const navLinks = document.querySelectorAll('.nav-link, .nav-cta');

  let scrollTicking = false;

  const showPopupOnce = () => {
    if (sessionStorage.getItem('popupShown') === 'true') return;
    const modalEl = document.getElementById('consult-popup');
    if (!modalEl || !window.bootstrap) return;
    const modal = new window.bootstrap.Modal(modalEl, { backdrop: true });
    modal.show();
    sessionStorage.setItem('popupShown', 'true');
  };

  const onScrollFrame = () => {
    if (header) {
      if (window.scrollY > 50) header.classList.add('is-scrolled');
      else header.classList.remove('is-scrolled');
    }
    scrollTicking = false;
  };

  const onScroll = () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(onScrollFrame);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScrollFrame();

  const portfolioSection = document.getElementById('portfolio');
  if (portfolioSection && 'IntersectionObserver' in window) {
    const popupObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          showPopupOnce();
          popupObserver.disconnect();
        }
      });
    }, { threshold: 0.25 });
    popupObserver.observe(portfolioSection);
  }

  const toggleMenu = (open) => {
    if (!navList || !navToggle) return;
    const willOpen = open ?? !navList.classList.contains('is-open');
    navList.classList.toggle('is-open', willOpen);
    navToggle.classList.toggle('is-open', willOpen);
    navToggle.setAttribute('aria-expanded', String(willOpen));
    document.body.style.overflow = willOpen ? 'hidden' : '';
  };

  if (navToggle) navToggle.addEventListener('click', () => toggleMenu());

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navList && navList.classList.contains('is-open')) toggleMenu(false);
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  const filters = document.querySelectorAll('.portfolio-filter');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  const applyFilter = (filter) => {
    portfolioItems.forEach(item => {
      const category = item.dataset.category;
      const show = filter === 'all' || category === filter;
      item.classList.toggle('is-hidden', !show);
    });
  };

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');
      applyFilter(btn.dataset.filter);
    });
  });

  const validators = {
    name: (v) => v.trim().length >= 2 || 'Vui lòng nhập họ tên (tối thiểu 2 ký tự).',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Email không hợp lệ.',
    tel: (v) => /^(0|\+84)[0-9]{9,10}$/.test(v.trim().replace(/\s/g, '')) || 'Số điện thoại không hợp lệ.',
    select: (v) => v.trim().length > 0 || 'Vui lòng chọn một tùy chọn.',
    textarea: (v) => v.trim().length >= 10 || 'Vui lòng mô tả ít nhất 10 ký tự.',
    checkbox: (checked) => checked === true || 'Bạn cần đồng ý điều khoản để tiếp tục.'
  };

  const validateField = (field) => {
    if (!field.required && !field.value) {
      setFieldState(field, true, '');
      return true;
    }
    let result;
    if (field.type === 'checkbox') result = validators.checkbox(field.checked);
    else if (field.type === 'email') result = validators.email(field.value);
    else if (field.type === 'tel') result = validators.tel(field.value);
    else if (field.tagName === 'SELECT') result = validators.select(field.value);
    else if (field.tagName === 'TEXTAREA') result = validators.textarea(field.value);
    else result = validators.name(field.value);

    const isValid = result === true;
    setFieldState(field, isValid, isValid ? '' : result);
    return isValid;
  };

  const setFieldState = (field, isValid, message) => {
    field.classList.toggle('is-invalid', !isValid);
    field.classList.toggle('is-valid', isValid && (field.value || field.checked));
    const errorEl = document.querySelector(`[data-error-for="${field.id}"]`);
    if (errorEl) errorEl.textContent = message;
  };

  const attachFormValidation = (formId) => {
    const form = document.getElementById(formId);
    if (!form) return;

    const fields = form.querySelectorAll('input[required], textarea[required], select[required]');
    fields.forEach(field => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.classList.contains('is-invalid')) validateField(field);
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let allValid = true;
      fields.forEach(field => { if (!validateField(field)) allValid = false; });
      if (!allValid) {
        const firstInvalid = form.querySelector('.is-invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }
      const success = form.querySelector('.form-success');
      if (success) success.hidden = false;
      form.querySelectorAll('.form-control, .form-select, .form-check-input').forEach(el => {
        if (el.type === 'checkbox') el.checked = false;
        else el.value = '';
        el.classList.remove('is-valid', 'is-invalid');
      });
      if (formId === 'popup-form') {
        setTimeout(() => {
          const modal = document.getElementById('consult-popup');
          if (modal && window.bootstrap) {
            const instance = window.bootstrap.Modal.getInstance(modal);
            if (instance) instance.hide();
          }
          if (success) success.hidden = true;
        }, 3000);
      } else {
        setTimeout(() => { if (success) success.hidden = true; }, 6000);
      }
    });
  };

  attachFormValidation('contact-form');
  attachFormValidation('popup-form');

  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('.newsletter-input');
      const feedback = newsletterForm.querySelector('.newsletter-feedback');
      if (!input || !feedback) return;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
        feedback.textContent = 'Email không hợp lệ.';
        feedback.style.color = 'var(--color-error)';
        return;
      }
      feedback.textContent = 'Cảm ơn! Bạn đã đăng ký thành công.';
      feedback.style.color = 'var(--color-secondary)';
      input.value = '';
      setTimeout(() => { feedback.textContent = ''; }, 5000);
    });
  }

})();
