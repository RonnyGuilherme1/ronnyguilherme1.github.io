const header = document.querySelector('.site-header');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
const revealElements = document.querySelectorAll('.reveal');
const typedText = document.getElementById('typed-text');
const menuToggle = document.getElementById('menu-toggle');
const navLinksContainer = document.getElementById('nav-links');

const phrases = [
  'current_role = ["Suporte", "Desenvolvimento"]',
  'stack = ["Python", "PostgreSQL", "HTML", "CSS", "JS"]',
  'next_step = ["React", "TypeScript", "IA"]',
  'status = "evoluindo com projetos reais"'
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function handleHeaderScroll() {
  header.classList.toggle('scrolled', window.scrollY > 24);
}

function handleActiveLink() {
  let currentSection = 'inicio';

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 140;
    const sectionHeight = section.offsetHeight;

    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
}

function startTypingEffect() {
  if (!typedText) return;

  const currentPhrase = phrases[phraseIndex];

  if (isDeleting) {
    charIndex -= 1;
  } else {
    charIndex += 1;
  }

  typedText.textContent = currentPhrase.slice(0, charIndex);

  let speed = isDeleting ? 35 : 65;

  if (!isDeleting && charIndex === currentPhrase.length) {
    speed = 1400;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    speed = 260;
  }

  setTimeout(startTypingEffect, speed);
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
      }
    });
  },
  {
    threshold: 0.15,
  }
);

revealElements.forEach((element) => observer.observe(element));

window.addEventListener('scroll', () => {
  handleHeaderScroll();
  handleActiveLink();
});

if (menuToggle && navLinksContainer) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinksContainer.classList.toggle('open');
    menuToggle.classList.toggle('active', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navLinksContainer.classList.remove('open');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

handleHeaderScroll();
handleActiveLink();
startTypingEffect();
