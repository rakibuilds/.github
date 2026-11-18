/** Rakibul AI Labs portfolio interactions. */
document.documentElement.classList.add('js-ready');
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initProjectFilters();
  initFaq(); // Added back for the accordion
  initReveal();
  initFooterYear();
  initHero3D();
});

/* Lazy-load the Three.js hero AFTER first paint.
   Keeps three/draco out of the initial bundle.
   SEO-safe: Googlebot executes requestIdleCallback + dynamic import normally. */
function initHero3D() {
  if (!document.getElementById('universe')) return; // no canvas -> nothing to do
  const run = () => import('./hero-3d.js').then((m) => m.initHero3D());
  'requestIdleCallback' in window
    ? requestIdleCallback(run)
    : setTimeout(run, 1);
}

function initNavigation() {
  const header = document.querySelector('.navbar');
  const button = document.getElementById('menuToggleBtn');
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('mobileOverlay');
  const close = document.getElementById('closeMenuBtn');
  
  const setMenu = (open) => {
    drawer?.classList.toggle('open', open); overlay?.classList.toggle('open', open);
    button?.setAttribute('aria-expanded', String(open));
    button?.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  
  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 24);
  updateHeader(); window.addEventListener('scroll', updateHeader, { passive: true });
  
  button?.addEventListener('click', () => setMenu(button.getAttribute('aria-expanded') !== 'true'));
  close?.addEventListener('click', () => setMenu(false)); 
  overlay?.addEventListener('click', () => setMenu(false));
  
  drawer?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setMenu(false); });
}

function initProjectFilters() {
  const buttons = [...document.querySelectorAll('.filter-btn')];
  const cards = [...document.querySelectorAll('.project-card')];
  buttons.forEach((button) => button.addEventListener('click', () => {
    buttons.forEach((item) => { 
      const active = item === button; 
      item.classList.toggle('active', active); 
      item.setAttribute('aria-pressed', String(active)); 
    });
    cards.forEach((card) => { 
      const visible = button.dataset.filter === 'all' || card.dataset.category === button.dataset.filter; 
      card.classList.toggle('is-hidden', !visible); 
      card.setAttribute('aria-hidden', String(!visible)); 
    });
  }));
}

function initFaq() {
  const items = [...document.querySelectorAll('.faq-item')];
  items.forEach((item) => {
    const button = item.querySelector('.faq-question'); 
    const answer = item.querySelector('.faq-answer');
    if (!button || !answer) return;
    
    button.addEventListener('click', () => {
      const open = !item.classList.contains('open');
      
      // Close all other items
      items.forEach((other) => { 
        other.classList.remove('open'); 
        other.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false'); 
        const panel = other.querySelector('.faq-answer'); 
        if (panel) panel.hidden = true; 
      });
      
      // Open clicked item
      if (open) { 
        item.classList.add('open'); 
        button.setAttribute('aria-expanded', 'true'); 
        answer.hidden = false; 
      }
    });
  });
}

function initReveal() {
  const targets = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) { 
    targets.forEach((item) => item.classList.add('animate-in')); 
    return; 
  }
  const observer = new IntersectionObserver((entries, instance) => entries.forEach((entry) => { 
    if (entry.isIntersecting) { 
      entry.target.classList.add('animate-in'); 
      instance.unobserve(entry.target); 
    } 
  }), { threshold: .08, rootMargin: '0px 0px -24px 0px' });
  
  targets.forEach((item) => observer.observe(item));
}

function initFooterYear() { 
  const year = document.getElementById('currentYear'); 
  if (year) year.textContent = String(new Date().getFullYear()); 
}