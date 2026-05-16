(() => {
  'use strict';

  const hidePageLoader = () => {
    const loader = document.getElementById('page-loader');
    if (!loader) return;
    setTimeout(() => {
      loader.classList.add('is-hidden');
      setTimeout(() => loader.remove(), 600);
    }, 500);
  };

  if (document.readyState === 'complete') hidePageLoader();
  else window.addEventListener('load', hidePageLoader);

  const header = document.getElementById('site-header');
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.getElementById('primary-menu');
  const navLinks = document.querySelectorAll('.nav-link, .nav-cta');
  const toastContainer = document.getElementById('toast-container');

  let scrollTicking = false;

  const showToast = (message, type = 'info', title = '') => {
    if (!toastContainer || !window.bootstrap) return;
    const config = {
      success: { icon: 'bi-check-circle-fill', cls: 'toast-success', defaultTitle: 'Thành công' },
      error: { icon: 'bi-x-circle-fill', cls: 'toast-error', defaultTitle: 'Có lỗi xảy ra' },
      warning: { icon: 'bi-exclamation-triangle-fill', cls: 'toast-warning', defaultTitle: 'Cảnh báo' },
      info: { icon: 'bi-info-circle-fill', cls: 'toast-info', defaultTitle: 'Thông báo' }
    }[type] || { icon: 'bi-info-circle-fill', cls: 'toast-info', defaultTitle: 'Thông báo' };

    const el = document.createElement('div');
    el.className = `toast app-toast ${config.cls}`;
    el.setAttribute('role', 'alert');
    el.setAttribute('aria-live', 'assertive');
    el.setAttribute('aria-atomic', 'true');
    el.innerHTML = `
      <div class="toast-header">
        <i class="bi ${config.icon} toast-icon" aria-hidden="true"></i>
        <strong class="me-auto">${title || config.defaultTitle}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Đóng"></button>
      </div>
      <div class="toast-body">${message}</div>`;
    toastContainer.appendChild(el);
    const toast = new window.bootstrap.Toast(el, { delay: 5000, autohide: true });
    el.addEventListener('hidden.bs.toast', () => el.remove());
    toast.show();
  };

  window.showToast = showToast;

  const getRecaptchaToken = async (action) => {
    const siteKey = window.__RECAPTCHA_SITE_KEY;
    if (!siteKey || typeof window.grecaptcha === 'undefined') return '';
    try {
      await new Promise(resolve => window.grecaptcha.ready(resolve));
      return await window.grecaptcha.execute(siteKey, { action });
    } catch {
      return '';
    }
  };

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

  const buildPayload = (form) => {
    const data = {};
    form.querySelectorAll('input[name], select[name], textarea[name]').forEach(el => {
      if (el.type === 'checkbox') data[el.name] = el.checked;
      else data[el.name] = el.value.trim();
    });
    return data;
  };

  const submitToApi = async (endpoint, payload) => {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    });
    let body = null;
    try { body = await res.json(); } catch { /* ignore */ }
    return { ok: res.ok, status: res.status, body };
  };

  const setFormBusy = (form, busy) => {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (!submitBtn) return;
    if (busy) {
      submitBtn.dataset.originalHtml ??= submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Đang gửi...';
    } else {
      submitBtn.disabled = false;
      if (submitBtn.dataset.originalHtml) submitBtn.innerHTML = submitBtn.dataset.originalHtml;
    }
  };

  const resetForm = (form) => {
    form.querySelectorAll('.form-control, .form-select, .form-check-input').forEach(el => {
      if (el.type === 'checkbox') el.checked = false;
      else el.value = '';
      el.classList.remove('is-valid', 'is-invalid');
    });
    form.querySelectorAll('.form-error').forEach(el => { el.textContent = ''; });
  };

  const attachFormValidation = (formId, endpoint, action) => {
    const form = document.getElementById(formId);
    if (!form) return;

    const fields = form.querySelectorAll('input[required], textarea[required], select[required]');
    fields.forEach(field => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.classList.contains('is-invalid')) validateField(field);
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      let allValid = true;
      fields.forEach(field => { if (!validateField(field)) allValid = false; });
      if (!allValid) {
        const firstInvalid = form.querySelector('.is-invalid');
        if (firstInvalid) firstInvalid.focus();
        showToast('Vui lòng kiểm tra lại các trường được đánh dấu.', 'warning');
        return;
      }

      setFormBusy(form, true);
      try {
        const payload = buildPayload(form);
        payload.recaptchaToken = await getRecaptchaToken(action);
        const result = await submitToApi(endpoint, payload);
        if (result.ok && result.body?.success) {
          showToast(result.body.message || 'Cảm ơn bạn! Chúng tôi sẽ liên hệ trong 24 giờ.', 'success', 'Gửi thành công');
          resetForm(form);
          if (formId === 'popup-form') {
            setTimeout(() => {
              const modal = document.getElementById('consult-popup');
              if (modal && window.bootstrap) {
                const instance = window.bootstrap.Modal.getInstance(modal);
                if (instance) instance.hide();
              }
            }, 1500);
          }
        } else {
          showToast(result.body?.message || 'Có lỗi xảy ra, vui lòng thử lại.', 'error');
        }
      } catch {
        showToast('Không thể kết nối máy chủ. Vui lòng thử lại sau.', 'error');
      } finally {
        setFormBusy(form, false);
      }
    });
  };

  attachFormValidation('contact-form', '/api/contact', 'contact');
  attachFormValidation('popup-form', '/api/popup', 'popup');

  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('.newsletter-input');
      const button = newsletterForm.querySelector('.newsletter-btn');
      if (!input) return;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
        showToast('Email không hợp lệ.', 'warning');
        return;
      }

      if (button) button.disabled = true;
      try {
        const token = await getRecaptchaToken('newsletter');
        const result = await submitToApi('/api/newsletter', { email: input.value.trim(), recaptchaToken: token });
        if (result.ok && result.body?.success) {
          showToast(result.body.message || 'Cảm ơn! Bạn đã đăng ký thành công.', 'success', 'Đăng ký thành công');
          input.value = '';
        } else {
          showToast(result.body?.message || 'Có lỗi xảy ra.', 'error');
        }
      } catch {
        showToast('Không kết nối được máy chủ.', 'error');
      } finally {
        if (button) button.disabled = false;
      }
    });
  }

})();
