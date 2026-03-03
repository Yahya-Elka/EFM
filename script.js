/* ================================================================
   AQUALUX AUTO — Premium JavaScript
   Features: Loader, Cursor, Navbar, Parallax, Scroll Reveal,
             Counters, Services Carousel, Segment Bars, Form
================================================================ */

'use strict';

/* ──────────────────────────────────────────────────
   LOADER
────────────────────────────────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  // Wait for the fill animation + slight pause
  setTimeout(() => {
    loader.classList.add('hidden');
    // Trigger hero reveal animations
    document.querySelectorAll('.reveal-up').forEach(el => {
      el.classList.add('visible');
    });
    // Start counters visible in viewport
    checkCounters();
  }, 1800);
});

/* ──────────────────────────────────────────────────
   CUSTOM CURSOR
────────────────────────────────────────────────── */
const cursorDot  = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

if (window.matchMedia('(hover: hover)').matches) {
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';
  });

  function animateCursor() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.addEventListener('mouseleave', () => {
    cursorDot.style.opacity  = '0';
    cursorRing.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursorDot.style.opacity  = '1';
    cursorRing.style.opacity = '1';
  });
}

/* ──────────────────────────────────────────────────
   NAVBAR SCROLL + ACTIVE LINK
────────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  // Sticky style
  navbar.classList.toggle('scrolled', window.scrollY > 60);

  // Back-to-top button
  const btt = document.getElementById('backToTop');
  btt.classList.toggle('visible', window.scrollY > 400);

  // Active nav link
  updateActiveLink();

  // Parallax effects
  parallaxHero();
  parallaxVision();

  // Segment bars
  checkSegmentBars();

  // Counters
  checkCounters();
});

function updateActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollMid = window.scrollY + window.innerHeight * 0.4;

  sections.forEach(sec => {
    const top    = sec.offsetTop;
    const bottom = top + sec.offsetHeight;

    if (scrollMid >= top && scrollMid < bottom) {
      const id = sec.getAttribute('id');
      document.querySelectorAll('.nav-menu a[data-nav]').forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
      });
    }
  });
}

/* ──────────────────────────────────────────────────
   MOBILE NAV
────────────────────────────────────────────────── */
const navBurger     = document.getElementById('navBurger');
const mobileOverlay = document.getElementById('mobileOverlay');
const mobileClose   = document.getElementById('mobileClose');

navBurger.addEventListener('click', () => {
  mobileOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
});

function closeMobile() {
  mobileOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

mobileClose.addEventListener('click', closeMobile);

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', closeMobile);
});

/* ──────────────────────────────────────────────────
   PARALLAX — HERO
────────────────────────────────────────────────── */
const heroBg = document.getElementById('heroBg');

function parallaxHero() {
  if (!heroBg) return;
  const offset = window.scrollY * 0.35;
  heroBg.style.transform = `translateY(${offset}px)`;
}

/* ──────────────────────────────────────────────────
   PARALLAX — VISION
────────────────────────────────────────────────── */
const visionBg = document.getElementById('visionBg');

function parallaxVision() {
  if (!visionBg) return;
  const section = visionBg.closest('section');
  const rect    = section.getBoundingClientRect();

  if (rect.top < window.innerHeight && rect.bottom > 0) {
    const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
    const offset   = (progress - 0.5) * 160;
    visionBg.style.transform = `translateY(${offset}px)`;
  }
}

/* ──────────────────────────────────────────────────
   WATER DROPS — HERO DECORATION
────────────────────────────────────────────────── */
function createDrops() {
  const container = document.getElementById('dropsContainer');
  if (!container) return;

  const count = window.innerWidth < 768 ? 8 : 18;

  for (let i = 0; i < count; i++) {
    const drop = document.createElement('div');
    drop.className = 'drop';

    const left     = Math.random() * 100;
    const height   = 40 + Math.random() * 80;
    const duration = 2.5 + Math.random() * 4;
    const delay    = Math.random() * 6;
    const opacity  = 0.15 + Math.random() * 0.4;

    drop.style.cssText = `
      left: ${left}%;
      height: ${height}px;
      opacity: ${opacity};
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
    `;
    container.appendChild(drop);
  }
}
createDrops();

/* ──────────────────────────────────────────────────
   SCROLL REVEAL — IntersectionObserver
────────────────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('[data-reveal], [data-stagger]').forEach(el => {
  revealObserver.observe(el);
});

/* ──────────────────────────────────────────────────
   ANIMATED NUMBER COUNTERS
────────────────────────────────────────────────── */
const animated = new Set();

function animateCounter(el) {
  const target   = parseFloat(el.dataset.count);
  const isFloat  = target !== Math.floor(target);
  const duration = 1800;
  const start    = performance.now();

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = eased * target;

    el.textContent = isFloat
      ? current.toFixed(1)
      : Math.round(current).toLocaleString();

    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = isFloat ? target.toFixed(1) : target.toLocaleString();
  }
  requestAnimationFrame(update);
}

function checkCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    if (animated.has(el)) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9 && rect.bottom > 0) {
      animated.add(el);
      animateCounter(el);
    }
  });
}

/* ──────────────────────────────────────────────────
   SEGMENT BARS ANIMATION
────────────────────────────────────────────────── */
const segAnimated = new Set();

function checkSegmentBars() {
  document.querySelectorAll('.seg-fill').forEach(bar => {
    if (segAnimated.has(bar)) return;
    const rect = bar.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) {
      segAnimated.add(bar);
      // Tiny delay for stagger effect
      setTimeout(() => bar.classList.add('animated'), 100);
    }
  });
}

/* ──────────────────────────────────────────────────
   SERVICES CAROUSEL
────────────────────────────────────────────────── */
(function initCarousel() {
  const track     = document.getElementById('servicesTrack');
  const prevBtn   = document.getElementById('trackPrev');
  const nextBtn   = document.getElementById('trackNext');
  const dotsWrap  = document.getElementById('trackDots');

  if (!track || !prevBtn || !nextBtn) return;

  const cards     = track.querySelectorAll('.svc-card');
  const total     = cards.length;
  let current     = 0;
  let cardWidth   = 0;
  let visibleCount = 3;

  function getCardWidth() {
    if (cards[0]) {
      // card width + gap (24px)
      return cards[0].offsetWidth + 24;
    }
    return 344;
  }

  function getVisible() {
    const w = window.innerWidth;
    if (w < 640)  return 1;
    if (w < 1024) return 2;
    return 3;
  }

  function buildDots() {
    dotsWrap.innerHTML = '';
    const pages = Math.ceil(total / visibleCount);
    for (let i = 0; i < pages; i++) {
      const d = document.createElement('button');
      d.className = 'track-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', `Page ${i + 1}`);
      d.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(d);
    }
  }

  function updateDots(page) {
    dotsWrap.querySelectorAll('.track-dot').forEach((d, i) => {
      d.classList.toggle('active', i === page);
    });
  }

  function goTo(page) {
    cardWidth    = getCardWidth();
    visibleCount = getVisible();
    const pages  = Math.ceil(total / visibleCount);
    current      = Math.max(0, Math.min(page, pages - 1));
    const offset = current * visibleCount * cardWidth;
    track.style.transform = `translateX(-${offset}px)`;
    updateDots(current);
  }

  function setup() {
    cardWidth    = getCardWidth();
    visibleCount = getVisible();
    buildDots();
    goTo(current);
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  // Touch / swipe
  let touchStartX = 0;
  track.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goTo(current + 1) : goTo(current - 1);
    }
  });

  // Drag / mouse swipe
  let isDragging  = false;
  let dragStartX  = 0;
  let dragOffset  = 0;
  let baseOffset  = 0;

  track.addEventListener('mousedown', e => {
    isDragging = true;
    dragStartX = e.clientX;
    baseOffset = current * visibleCount * getCardWidth();
    track.style.transition = 'none';
    track.style.userSelect = 'none';
  });
  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    dragOffset = e.clientX - dragStartX;
    track.style.transform = `translateX(${-baseOffset + dragOffset}px)`;
  });
  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    track.style.transition = '';
    track.style.userSelect = '';
    if (Math.abs(dragOffset) > 80) {
      dragOffset < 0 ? goTo(current + 1) : goTo(current - 1);
    } else {
      goTo(current);
    }
    dragOffset = 0;
  });

  setup();
  window.addEventListener('resize', setup);
})();

/* ──────────────────────────────────────────────────
   CONTACT FORM
────────────────────────────────────────────────── */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const btn = this.querySelector('.form-submit');
    const original = btn.innerHTML;

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending…</span>';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-check-circle"></i> <span>Booking Confirmed!</span>';
      btn.style.background = '#2ecc71';
      btn.style.borderColor = '#2ecc71';

      setTimeout(() => {
        btn.innerHTML = original;
        btn.style.background = '';
        btn.style.borderColor = '';
        btn.disabled = false;
        contactForm.reset();
      }, 3000);
    }, 1800);
  });
}

/* ──────────────────────────────────────────────────
   BACK TO TOP
────────────────────────────────────────────────── */
document.getElementById('backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ──────────────────────────────────────────────────
   SMOOTH ANCHOR SCROLLING
────────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    const navH   = navbar.offsetHeight;
    const top    = target.getBoundingClientRect().top + window.scrollY - navH - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ──────────────────────────────────────────────────
   INPUT FOCUS LABEL ANIMATION
────────────────────────────────────────────────── */
document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(el => {
  el.addEventListener('focus', () => {
    el.closest('.form-group')?.querySelector('label')?.style.setProperty('color', '#C9A84C');
  });
  el.addEventListener('blur', () => {
    el.closest('.form-group')?.querySelector('label')?.style.setProperty('color', '');
  });
});

/* ──────────────────────────────────────────────────
   HERO TITLE SPLIT ANIMATION
   (adds character-by-character reveal)
────────────────────────────────────────────────── */
(function heroTitleSplit() {
  // Already handled via CSS animation-delay, but ensure they're triggered
  document.querySelectorAll('.reveal-up').forEach(el => {
    // These animate on class add by JS after load
  });
})();

/* ──────────────────────────────────────────────────
   SECTION ENTRANCE — subtle highlight effect
────────────────────────────────────────────────── */
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Highlight active dot if using nav indicator
      const id = entry.target.getAttribute('id');
      if (id) {
        document.querySelectorAll('.nav-menu a').forEach(a => {
          if (a.getAttribute('href') === `#${id}`) {
            a.classList.add('active');
          } else {
            a.classList.remove('active');
          }
        });
      }
    }
  });
}, { threshold: 0.35 });

document.querySelectorAll('section[id]').forEach(sec => sectionObserver.observe(sec));

/* ──────────────────────────────────────────────────
   PERFORMANCE: requestIdleCallback for non-critical
────────────────────────────────────────────────── */
if ('requestIdleCallback' in window) {
  requestIdleCallback(() => {
    // Preload visible images
    document.querySelectorAll('img[data-src]').forEach(img => {
      img.src = img.dataset.src;
    });
  });
}

/* ──────────────────────────────────────────────────
   INITIAL CALLS
────────────────────────────────────────────────── */
checkSegmentBars();
updateActiveLink();