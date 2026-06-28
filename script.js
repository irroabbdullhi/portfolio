/* =============================================
   SCRIPT.JS — Portfolio Hero Interactions
   ============================================= */

'use strict';

/* ----------- 1. ANIMATED BACKGROUND CANVAS ----------- */
(function initCanvas() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], animId;
  const PARTICLE_COUNT = 80;

  const colors = [
    'rgba(59,130,246,0.6)',
    'rgba(139,92,246,0.6)',
    'rgba(6,182,212,0.5)',
    'rgba(96,165,250,0.4)',
    'rgba(167,139,250,0.4)',
  ];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : H + 10;
      this.size = Math.random() * 2 + 0.5;
      this.speed = Math.random() * 0.4 + 0.1;
      this.opacity = Math.random() * 0.7 + 0.1;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.dx = (Math.random() - 0.5) * 0.3;
      this.life = 0;
      this.maxLife = Math.random() * 200 + 100;
    }
    update() {
      this.y -= this.speed;
      this.x += this.dx;
      this.life++;
      if (this.y < -10 || this.life > this.maxLife) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity * Math.sin((this.life / this.maxLife) * Math.PI);
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }
  }

  let hue = 0;
  function animate() {
    ctx.clearRect(0, 0, W, H);

    // Subtle gradient background pulse
    hue = (hue + 0.05) % 360;
    const grad = ctx.createRadialGradient(W * 0.3, H * 0.4, 0, W * 0.3, H * 0.4, W * 0.6);
    grad.addColorStop(0, `hsla(220, 80%, 8%, 0.3)`);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    particles.forEach(p => { p.update(); p.draw(); });

    // Draw connecting lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80) {
          ctx.save();
          ctx.globalAlpha = (1 - dist / 80) * 0.08;
          ctx.strokeStyle = 'rgba(59,130,246,0.8)';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }

    animId = requestAnimationFrame(animate);
  }

  resize();
  initParticles();
  animate();

  window.addEventListener('resize', () => {
    resize();
    initParticles();
  });
})();

/* ----------- 2. TYPING EFFECT ----------- */
(function initTyping() {
  const el = document.getElementById('typingText');
  if (!el) return;

  const roles = [
    'Designer',
    'Content Creator',
    'Video Editor',
    'Teacher',
    'Brand Architect',
    'Phone Repair Tech',
    'Social Media Pro',
    'Freelancer',
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let delay = 120;

  function type() {
    const current = roles[roleIdx];

    if (!isDeleting) {
      el.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        isDeleting = true;
        delay = 2200; // pause at full word
      } else {
        delay = 90 + Math.random() * 40;
      }
    } else {
      el.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        delay = 400;
      } else {
        delay = 50;
      }
    }

    setTimeout(type, delay);
  }

  // Start after initial fade-in
  setTimeout(type, 1000);
})();

/* ----------- 3. NAVBAR SCROLL EFFECT ----------- */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  });
})();

/* ----------- 4. MOBILE MENU ----------- */
(function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const menu = document.getElementById('mobileMenu');
  if (!toggle || !menu) return;

  let open = false;

  function closeMenu() {
    open = false;
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.querySelectorAll('span').forEach((s, i) => {
      s.style.transform = '';
      s.style.opacity = '';
    });
  }

  toggle.addEventListener('click', () => {
    open = !open;
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    menu.classList.toggle('open', open);

    const spans = toggle.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      closeMenu();
    }
  });

  // Close on link click
  menu.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (open && !toggle.contains(e.target) && !menu.contains(e.target)) {
      closeMenu();
    }
  });
})();

/* ----------- 5. PARALLAX PORTRAIT ----------- */
(function initParallax() {
  const frame = document.getElementById('parallaxFrame');
  const img = document.getElementById('portrait-img');
  if (!frame || !img) return;

  let raf;
  let mouseX = 0, mouseY = 0;
  let currentX = 0, currentY = 0;

  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    mouseX = (e.clientX - cx) / cx;
    mouseY = (e.clientY - cy) / cy;
  });

  function lerp(a, b, t) { return a + (b - a) * t; }

  function loop() {
    currentX = lerp(currentX, mouseX * 12, 0.06);
    currentY = lerp(currentY, mouseY * 8, 0.06);
    frame.style.transform = `perspective(1000px) rotateY(${currentX * 0.5}deg) rotateX(${-currentY * 0.3}deg) translateX(${currentX * 1.5}px) translateY(${currentY * 1.5}px)`;
    raf = requestAnimationFrame(loop);
  }

  // Only run on non-touch devices
  if (window.matchMedia('(hover: hover)').matches) {
    loop();
  }
})();

/* ----------- 6. INTERSECTION OBSERVER — SCROLL ANIMATIONS ----------- */
(function initScrollAnimations() {
  const options = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, options);

  document.querySelectorAll('.skill-badge, .about-card, .info-card').forEach(el => {
    observer.observe(el);
  });
})();

/* ----------- 7. BUTTON RIPPLE EFFECT ----------- */
(function initRipple() {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position:absolute;
        border-radius:50%;
        background:rgba(255,255,255,0.25);
        transform:scale(0);
        animation:rippleEffect 0.6s linear;
        pointer-events:none;
        width:${Math.max(rect.width, rect.height) * 2}px;
        height:${Math.max(rect.width, rect.height) * 2}px;
        left:${x - Math.max(rect.width, rect.height)}px;
        top:${y - Math.max(rect.width, rect.height)}px;
        z-index:999;
      `;

      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Add ripple keyframe dynamically
  if (!document.getElementById('rippleStyle')) {
    const style = document.createElement('style');
    style.id = 'rippleStyle';
    style.textContent = `
      @keyframes rippleEffect {
        to { transform: scale(1); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
})();

/* ----------- 8. SMOOTH ACTIVE NAV LINKS ----------- */
(function initNavHighlight() {
  const sections = ['hero', 'about', 'portfolio', 'contact'];
  const links = {
    hero: document.getElementById('nav-home'),
    about: document.getElementById('nav-about'),
    portfolio: document.getElementById('nav-portfolio'),
    contact: document.getElementById('nav-contact'),
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        Object.values(links).forEach(l => l && l.classList.remove('active'));
        if (links[entry.target.id]) links[entry.target.id].classList.add('active');
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
})();

/* ----------- 9. SKILL BADGE STAGGER ON LOAD ----------- */
(function initBadgeEntrance() {
  const badges = document.querySelectorAll('.skill-badge');
  badges.forEach((badge, i) => {
    badge.style.opacity = '0';
    badge.style.transform = 'scale(0.5) translateY(10px)';
    setTimeout(() => {
      badge.style.transition = 'opacity 0.4s cubic-bezier(0.34,1.56,0.64,1), transform 0.4s cubic-bezier(0.34,1.56,0.64,1)';
      badge.style.opacity = '1';
      badge.style.transform = 'scale(1) translateY(0)';
    }, 1000 + i * 80);
  });
})();

/* ----------- 10. CURSOR GLOW EFFECT ----------- */
(function initCursorGlow() {
  if (!window.matchMedia('(hover: hover)').matches) return;

  const glow = document.createElement('div');
  glow.id = 'cursorGlow';
  glow.style.cssText = `
    position:fixed;
    width:400px;
    height:400px;
    border-radius:50%;
    pointer-events:none;
    z-index:0;
    background:radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%);
    transform:translate(-50%,-50%);
    transition:left 0.15s ease, top 0.15s ease;
    will-change:left,top;
  `;
  document.body.appendChild(glow);

  window.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
})();

/* ----------- 11. PORTRAIT FALLBACK ----------- */
(function handlePortraitFallback() {
  const imgs = document.querySelectorAll('.portrait-img, .about-avatar-img');
  imgs.forEach(img => {
    img.addEventListener('error', function() {
      // Generate a styled placeholder if image fails
      const parent = this.parentElement;
      this.style.display = 'none';
      const placeholder = document.createElement('div');
      placeholder.style.cssText = `
        width:100%;
        height:100%;
        background:linear-gradient(135deg, rgba(59,130,246,0.3) 0%, rgba(139,92,246,0.3) 50%, rgba(6,182,212,0.2) 100%);
        display:flex;
        align-items:center;
        justify-content:center;
        font-size:4rem;
        border-radius:inherit;
      `;
      placeholder.textContent = '👨🏿‍💻';
      parent.appendChild(placeholder);
    });
  });
})();

console.log('%c🚀 Abdullahi Osman Ali — Portfolio', 'color:#60A5FA;font-size:14px;font-weight:bold;');
console.log('%cCreative Designer & Digital Professional', 'color:#A78BFA;font-size:11px;');

/* =============================================
   NEW SECTION INTERACTIONS
   ============================================= */

/* ----------- 12. SCROLL REVEAL FOR ALL SECTIONS ----------- */
(function initReveal() {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger children if it's a grid parent
        const delay = entry.target.dataset.revealDelay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach((el, i) => {
    // Add staggered delay based on position within parent
    const siblings = el.parentElement.querySelectorAll('.reveal');
    const idx = Array.from(siblings).indexOf(el);
    el.dataset.revealDelay = idx * 80;
    revealObserver.observe(el);
  });
})();

/* ----------- 13. ANIMATED SKILL BARS ----------- */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');
  if (!bars.length) return;

  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const width = bar.dataset.width || '0';
        setTimeout(() => {
          bar.style.width = width + '%';
        }, 300);
        barObserver.unobserve(bar);
      }
    });
  }, { threshold: 0.5 });

  bars.forEach(bar => barObserver.observe(bar));
})();

/* ----------- 14. PORTFOLIO FILTER ----------- */
(function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.portfolio-card');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const category = card.dataset.category;
        const show = filter === 'all' || category === filter;

        if (show) {
          card.classList.remove('hidden');
          card.style.animation = 'none';
          requestAnimationFrame(() => {
            card.style.animation = '';
          });
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
})();

/* ----------- 15. CONTACT FORM VALIDATION & SUBMISSION ----------- */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const submitBtn = document.getElementById('form-submit-btn');
  const successMsg = document.getElementById('formSuccess');
  const iconDefault = submitBtn.querySelector('.btn-icon-default');
  const iconLoading = submitBtn.querySelector('.btn-icon-loading');
  const btnLabel = submitBtn.querySelector('.btn-label');

  function validateField(input, errorId) {
    const error = document.getElementById(errorId);
    let valid = true;
    if (!input) return true;

    if (input.type === 'email') {
      valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
    } else {
      valid = input.value.trim().length > 0;
    }

    if (!valid) {
      input.classList.add('error');
      if (error) error.classList.add('show');
    } else {
      input.classList.remove('error');
      if (error) error.classList.remove('show');
    }
    return valid;
  }

  // Live validation on blur
  const fields = [
    { id: 'form-name', error: 'error-name' },
    { id: 'form-email', error: 'error-email' },
    { id: 'form-subject', error: 'error-subject' },
    { id: 'form-message', error: 'error-message' },
  ];
  fields.forEach(({ id, error }) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('blur', () => validateField(el, error));
    if (el) el.addEventListener('input', () => {
      if (el.classList.contains('error')) validateField(el, error);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate all
    let valid = true;
    fields.forEach(({ id, error }) => {
      const el = document.getElementById(id);
      if (!validateField(el, error)) valid = false;
    });

    if (!valid) return;

    // Simulate sending
    submitBtn.disabled = true;
    iconDefault.style.display = 'none';
    iconLoading.style.display = 'block';
    btnLabel.textContent = 'Sending...';

    setTimeout(() => {
      submitBtn.disabled = false;
      iconDefault.style.display = '';
      iconLoading.style.display = 'none';
      btnLabel.textContent = 'Send Message';

      // Show success
      successMsg.classList.add('show');
      form.reset();

      // Hide success after 5s
      setTimeout(() => successMsg.classList.remove('show'), 5000);
    }, 1800);
  });
})();

/* ----------- 16. SERVICE CARD HOVER COLOR ----------- */
(function initServiceColors() {
  document.querySelectorAll('.service-card').forEach(card => {
    const icon = card.querySelector('.service-icon');
    if (!icon) return;
    const color = getComputedStyle(icon).getPropertyValue('--svc-color').trim() || '#3B82F6';
    card.addEventListener('mouseenter', () => {
      icon.style.background = `rgba(${hexToRgb(color)}, 0.2)`;
      icon.style.boxShadow = `0 0 20px rgba(${hexToRgb(color)}, 0.3)`;
    });
    card.addEventListener('mouseleave', () => {
      icon.style.background = '';
      icon.style.boxShadow = '';
    });
  });

  function hexToRgb(hex) {
    // handle css vars — fallback
    if (hex.startsWith('var')) return '59,130,246';
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(c => c+c).join('');
    const r = parseInt(hex.slice(0,2), 16);
    const g = parseInt(hex.slice(2,4), 16);
    const b = parseInt(hex.slice(4,6), 16);
    return `${r},${g},${b}`;
  }
})();

/* ----------- 17. SECTION STAGGER CHILDREN REVEALS ----------- */
(function initStaggerChildren() {
  const staggerParents = document.querySelectorAll('.services-row, .portfolio-grid');
  const staggerObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const children = entry.target.querySelectorAll('.service-card, .portfolio-card');
        children.forEach((child, i) => {
          setTimeout(() => {
            child.style.opacity = '1';
            child.style.transform = 'translateY(0)';
          }, i * 80);
        });
        staggerObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  staggerParents.forEach(parent => {
    const children = parent.querySelectorAll('.service-card, .portfolio-card');
    children.forEach(child => {
      child.style.opacity = '0';
      child.style.transform = 'translateY(30px)';
      child.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    staggerObs.observe(parent);
  });
})();
