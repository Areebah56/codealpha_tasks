// ===== Footer year =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== License plate tilt-on-hover (skipped on touch / reduced motion) =====
const plate = document.getElementById('plate');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(hover: none)').matches;

if(plate && !prefersReducedMotion && !isTouch){
  plate.addEventListener('mousemove', (e) => {
    const rect = plate.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    plate.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale(1.02)`;
  });
  plate.addEventListener('mouseleave', () => {
    plate.style.transform = 'rotate(-3deg)';
  });
  plate.addEventListener('mouseenter', () => {
    plate.style.transition = 'transform 0.15s ease';
  });
}

// ===== Scroll-reveal for sections (with staggered children) =====
const sections = document.querySelectorAll('.section');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('in-view');
      const kids = entry.target.querySelectorAll('.tag-card, .studs__col, .ticket__row');
      kids.forEach((kid, i) => {
        kid.style.transitionDelay = (i * 70) + 'ms';
      });
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
sections.forEach(sec => observer.observe(sec));

// ===== Nav scroll-spy =====
const navAnchors = document.querySelectorAll('.nav__links a');
const spyTargets = [...navAnchors].map(a => document.querySelector(a.getAttribute('href')));

const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      const id = '#' + entry.target.id;
      navAnchors.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

spyTargets.forEach(t => { if(t) spyObserver.observe(t); });

// ===== Mobile nav toggle =====
const burger = document.getElementById('burger');
const navLinks = document.querySelector('.nav__links');

burger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('nav__links--open');
  burger.setAttribute('aria-expanded', isOpen);
});

document.querySelectorAll('.nav__links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('nav__links--open');
    burger.setAttribute('aria-expanded', 'false');
  });
});

// ===== Résumé button =====
// Point this at your actual resume file (e.g. "resume.pdf") once you add it
// to the project folder.
document.getElementById('resumeBtn').addEventListener('click', (e) => {
  e.preventDefault();
  alert('Add your resume.pdf to the project folder and update the href on #resumeBtn in index.html.');
});
