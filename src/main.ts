import './style.css';

/* =========================================
   NAVBAR — Scroll & Mobile Toggle
   ========================================= */
const navbar = document.getElementById('navbar') as HTMLElement;
const hamburger = document.getElementById('hamburger') as HTMLButtonElement;
const navLinks = document.getElementById('nav-links') as HTMLElement;
const allNavLinks = document.querySelectorAll<HTMLAnchorElement>('.nav-link');
const backToTop = document.getElementById('back-to-top') as HTMLButtonElement;

function handleBackToTop() {
  if (!backToTop) return;
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveLink();
  handleBackToTop();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close mobile nav on link click
allNavLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// Click outside to close
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target as Node)) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  }
});

/* =========================================
   ACTIVE NAV LINK — Scroll Spy
   ========================================= */
function updateActiveLink() {
  const sections = document.querySelectorAll<HTMLElement>('section[id]');
  const scrollY = window.scrollY + 100;

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');

    if (scrollY >= top && scrollY < top + height) {
      allNavLinks.forEach(link => link.classList.remove('active'));
      const activeLink = document.querySelector<HTMLAnchorElement>(`.nav-link[href="#${id}"]`);
      if (activeLink) activeLink.classList.add('active');
    }
  });
}

/* =========================================
   SCROLL REVEAL ANIMATIONS
   ========================================= */
const revealElements = document.querySelectorAll<HTMLElement>('.reveal, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Stagger delay for siblings
        const el = entry.target as HTMLElement;
        const siblings = Array.from(el.parentElement?.children || []);
        const index = siblings.indexOf(el);
        const delay = Math.min(index * 80, 400);

        setTimeout(() => {
          el.classList.add('revealed');
        }, delay);

        revealObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
);

revealElements.forEach(el => revealObserver.observe(el));

/* =========================================
   TESTIMONIALS SLIDER
   ========================================= */
const track = document.getElementById('testimonials-track') as HTMLElement;
const dotsContainer = document.getElementById('t-dots') as HTMLElement;
const prevBtn = document.getElementById('t-prev') as HTMLButtonElement;
const nextBtn = document.getElementById('t-next') as HTMLButtonElement;
const cards = track.querySelectorAll<HTMLElement>('.testimonial-card');
const totalCards = cards.length;
let currentIndex = 0;
let autoplayInterval: ReturnType<typeof setInterval>;

// Create dots
cards.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.className = `t-dot${i === 0 ? ' active' : ''}`;
  dot.setAttribute('aria-label', `Slide ${i + 1}`);
  dot.addEventListener('click', () => goTo(i));
  dotsContainer.appendChild(dot);
});

function goTo(index: number) {
  currentIndex = (index + totalCards) % totalCards;
  const cardWidth = track.parentElement!.offsetWidth;
  track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

  dotsContainer.querySelectorAll('.t-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentIndex);
  });
}

prevBtn.addEventListener('click', () => { goTo(currentIndex - 1); resetAutoplay(); });
nextBtn.addEventListener('click', () => { goTo(currentIndex + 1); resetAutoplay(); });

function startAutoplay() {
  autoplayInterval = setInterval(() => goTo(currentIndex + 1), 5000);
}

function resetAutoplay() {
  clearInterval(autoplayInterval);
  startAutoplay();
}

// Recalculate on resize
window.addEventListener('resize', () => goTo(currentIndex));

startAutoplay();

// Touch/swipe support
let touchStartX = 0;
track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
track.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) {
    goTo(diff > 0 ? currentIndex + 1 : currentIndex - 1);
    resetAutoplay();
  }
});

/* =========================================
   BACK TO TOP
   ========================================= */
if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* =========================================
   PARALLAX HERO (subtle)
   ========================================= */
const heroImg = document.querySelector<HTMLImageElement>('.hero-img');
window.addEventListener('scroll', () => {
  if (heroImg && window.scrollY < window.innerHeight) {
    heroImg.style.transform = `scale(1) translateY(${window.scrollY * 0.25}px)`;
  }
}, { passive: true });

/* =========================================
   GALLERY LIGHTBOX (Simple)
   ========================================= */
const galleryItems = document.querySelectorAll<HTMLElement>('.gallery-item');

galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    if (!img) return;

    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed; inset: 0; z-index: 9999;
      background: rgba(0,0,0,0.92);
      display: flex; align-items: center; justify-content: center;
      cursor: zoom-out; animation: fadeIn 0.3s ease;
      padding: 1rem;
    `;

    const lightboxImg = document.createElement('img');
    lightboxImg.src = img.src;
    lightboxImg.style.cssText = `
      max-width: 90vw; max-height: 90vh;
      object-fit: contain; border-radius: 8px;
      box-shadow: 0 20px 80px rgba(0,0,0,0.5);
    `;

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '✕';
    closeBtn.style.cssText = `
      position: absolute; top: 1.5rem; right: 1.5rem;
      color: white; font-size: 1.5rem; background: none;
      border: none; cursor: pointer; opacity: 0.7;
      transition: opacity 0.2s;
    `;
    closeBtn.onmouseenter = () => closeBtn.style.opacity = '1';
    closeBtn.onmouseleave = () => closeBtn.style.opacity = '0.7';

    overlay.appendChild(lightboxImg);
    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    const close = () => {
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity 0.25s ease';
      setTimeout(() => {
        document.body.removeChild(overlay);
        document.body.style.overflow = '';
      }, 250);
    };

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target === closeBtn) close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    }, { once: true });
  });
});
