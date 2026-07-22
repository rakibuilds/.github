/**
 * RAKIBUL ISLAM - PORTFOLIO INTERACTIVE SCRIPT (main.js)
 * Features:
 * - Strict Single-Language Toggle (EN <-> AS)
 * - Mobile Navigation Drawer
 * - Project Category Filtering
 * - Contact Form Handler
 * - Scroll Effects
 */

document.addEventListener('DOMContentLoaded', () => {
  initLanguageToggle();
  initMobileMenu();
  initProjectFiltering();
  initContactForm();
  initScrollEffects();
  initFaqAccordion();
  updateFooterYear();
  initLazyImageFade();
});

/**
 * Lazy Image Fade-In for slow network connections (3G/4G)
 * Adds 'loaded' class to each lazy image when it finishes loading,
 * triggering a smooth CSS opacity transition.
 */
function initLazyImageFade() {
  const lazyImgs = document.querySelectorAll('img[loading="lazy"]');
  lazyImgs.forEach(img => {
    if (img.complete && img.naturalWidth > 0) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
      img.addEventListener('error', () => img.classList.add('loaded'), { once: true });
    }
  });
}

/**
 * Strict Single-Language Toggle System (EN <-> AS)
 */
function initLanguageToggle() {
  const langEnBtns = document.querySelectorAll('.lang-btn-en');
  const langAsBtns = document.querySelectorAll('.lang-btn-as');

  // Retrieve stored language preference or default to 'en'
  const savedLang = localStorage.getItem('preferredLang') || 'en';
  setLanguage(savedLang);

  langEnBtns.forEach(btn => {
    btn.addEventListener('click', () => setLanguage('en'));
  });

  langAsBtns.forEach(btn => {
    btn.addEventListener('click', () => setLanguage('as'));
  });

  function setLanguage(lang) {
    if (lang === 'as') {
      document.body.classList.remove('lang-en-active');
      document.body.classList.add('lang-as-active');

      langEnBtns.forEach(btn => btn.classList.remove('active'));
      langAsBtns.forEach(btn => btn.classList.add('active'));

      localStorage.setItem('preferredLang', 'as');
    } else {
      document.body.classList.remove('lang-as-active');
      document.body.classList.add('lang-en-active');

      langAsBtns.forEach(btn => btn.classList.remove('active'));
      langEnBtns.forEach(btn => btn.classList.add('active'));

      localStorage.setItem('preferredLang', 'en');
    }
  }
}

/**
 * Mobile Navigation Drawer Logic
 */
function initMobileMenu() {
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const closeMenuBtn  = document.getElementById('closeMenuBtn');
  const mobileDrawer  = document.getElementById('mobileDrawer');
  const mobileOverlay = document.getElementById('mobileOverlay');

  if (!menuToggleBtn || !mobileDrawer || !mobileOverlay) return;

  function openMenu() {
    mobileDrawer.classList.add('open');
    mobileOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileDrawer.classList.remove('open');
    mobileOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  menuToggleBtn.addEventListener('click', openMenu);
  if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeMenu);
  mobileOverlay.addEventListener('click', closeMenu);

  // Close drawer on ANY link/anchor tap inside the drawer
  mobileDrawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/**
 * Interactive Project Filtering
 */
function initProjectFiltering() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');

        if (filterValue === 'all' || category === filterValue || category.includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px) scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/**
 * Contact Form Interactivity & Status Feedback
 */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const clearBtn = document.getElementById('clearBtn');
  const formStatus = document.getElementById('formStatus');

  if (clearBtn && contactForm) {
    clearBtn.addEventListener('click', () => {
      contactForm.reset();
      if (formStatus) {
        const isAs = document.body.classList.contains('lang-as-active');
        formStatus.textContent = isAs ? 'ফোৰ্ম পৰিষ্কাৰ কৰা হ’ল।' : 'Form cleared successfully.';
        formStatus.style.color = 'var(--accent-cyan)';
        setTimeout(() => {
          formStatus.textContent = '';
        }, 2000);
      }
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      if (formStatus) {
        const isAs = document.body.classList.contains('lang-as-active');
        formStatus.textContent = isAs ? 'বাৰ্তা প্ৰেৰণ কৰা হৈছে...' : 'Sending your message...';
        formStatus.style.color = 'var(--accent-cyan)';
      }
    });
  }
}

/**
 * Scroll Reveal & Navbar Effects
 */
function initScrollEffects() {
  const navbar = document.querySelector('.navbar');

  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
        navbar.style.background = 'rgba(7, 11, 25, 0.94)';
      } else {
        navbar.style.boxShadow = 'none';
        navbar.style.background = 'rgba(7, 11, 25, 0.85)';
      }
    }, { passive: true });
  }

  const animatableElements = document.querySelectorAll(
    '.glass-panel, .service-card, .project-card, .why-card, .faq-item, .blog-platform-card'
  );

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatableElements.forEach(el => {
      el.classList.add('reveal-on-scroll');
      observer.observe(el);
    });
  } else {
    animatableElements.forEach(el => el.classList.add('animate-in'));
  }
}

/**
 * FAQ Accordion
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn    = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all others
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('open');
          const otherBtn    = other.querySelector('.faq-question');
          const otherAnswer = other.querySelector('.faq-answer');
          if (otherBtn)    otherBtn.setAttribute('aria-expanded', 'false');
          if (otherAnswer) otherAnswer.hidden = true;
        }
      });

      // Toggle current
      if (isOpen) {
        item.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        answer.hidden = true;
      } else {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        answer.hidden = false;
        // Smooth scroll the item into view on mobile
        if (window.innerWidth < 768) {
          setTimeout(() => item.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
        }
      }
    });
  });
}

/**
 * Auto Update Footer Copyright Year
 */
function updateFooterYear() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
