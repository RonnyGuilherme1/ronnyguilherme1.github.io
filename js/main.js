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


const galleryButtons = document.querySelectorAll('[data-gallery-target]');
const galleryTriggers = document.querySelectorAll('.project-gallery-trigger');
const lightbox = document.getElementById('project-lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');

const lightboxGroups = {};
let currentLightboxGroup = [];
let currentLightboxIndex = 0;

const toggleButtonLabels = {
  'estoque-gallery': {
    open: 'Ocultar imagens do projeto',
    closed: 'Ver imagens do projeto'
  },
  'condominio-gallery': {
    open: 'Ocultar imagens da proposta',
    closed: 'Ver imagens da proposta'
  }
};

galleryButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const targetId = button.getAttribute('data-gallery-target');
    const gallery = document.getElementById(targetId);

    if (!gallery) return;

    const willOpen = gallery.hasAttribute('hidden');
    const labels = toggleButtonLabels[targetId] || {
      open: 'Ocultar imagens',
      closed: 'Ver imagens'
    };

    if (willOpen) {
      gallery.removeAttribute('hidden');
      button.setAttribute('aria-expanded', 'true');
      button.textContent = labels.open;
      setTimeout(() => {
        gallery.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
    } else {
      gallery.setAttribute('hidden', '');
      button.setAttribute('aria-expanded', 'false');
      button.textContent = labels.closed;
    }
  });
});

function updateLightboxImage() {
  if (!currentLightboxGroup.length || !lightboxImage || !lightboxCaption) return;

  const currentItem = currentLightboxGroup[currentLightboxIndex];
  lightboxImage.src = currentItem.src;
  lightboxImage.alt = currentItem.alt;
  lightboxCaption.textContent = currentItem.caption;

  if (lightboxPrev && lightboxNext) {
    const shouldShowNav = currentLightboxGroup.length > 1;
    lightboxPrev.hidden = !shouldShowNav;
    lightboxNext.hidden = !shouldShowNav;
  }
}

function openLightbox(groupName, itemIndex) {
  if (!lightbox || !lightboxImage || !lightboxCaption || !lightboxGroups[groupName]) return;

  currentLightboxGroup = lightboxGroups[groupName];
  currentLightboxIndex = itemIndex;
  updateLightboxImage();
  lightbox.removeAttribute('hidden');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('lightbox-open');
}

function closeLightbox() {
  if (!lightbox || !lightboxImage) return;

  lightbox.setAttribute('hidden', '');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxImage.src = '';
  lightboxImage.alt = '';
  document.body.classList.remove('lightbox-open');
}

function showPreviousImage() {
  if (!currentLightboxGroup.length) return;
  currentLightboxIndex = (currentLightboxIndex - 1 + currentLightboxGroup.length) % currentLightboxGroup.length;
  updateLightboxImage();
}

function showNextImage() {
  if (!currentLightboxGroup.length) return;
  currentLightboxIndex = (currentLightboxIndex + 1) % currentLightboxGroup.length;
  updateLightboxImage();
}

galleryTriggers.forEach((trigger) => {
  const groupName = trigger.dataset.lightboxGroup;
  const groupItem = {
    src: trigger.dataset.lightboxSrc,
    alt: trigger.dataset.lightboxAlt || '',
    caption: trigger.dataset.lightboxCaption || ''
  };

  if (!lightboxGroups[groupName]) {
    lightboxGroups[groupName] = [];
  }

  const itemIndex = lightboxGroups[groupName].push(groupItem) - 1;

  trigger.addEventListener('click', () => {
    openLightbox(groupName, itemIndex);
  });
});

if (lightboxClose) {
  lightboxClose.addEventListener('click', closeLightbox);
}

if (lightboxPrev) {
  lightboxPrev.addEventListener('click', showPreviousImage);
}

if (lightboxNext) {
  lightboxNext.addEventListener('click', showNextImage);
}

if (lightbox) {
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });
}

document.addEventListener('keydown', (event) => {
  if (!lightbox || lightbox.hasAttribute('hidden')) return;

  if (event.key === 'Escape') {
    closeLightbox();
  }

  if (event.key === 'ArrowLeft') {
    showPreviousImage();
  }

  if (event.key === 'ArrowRight') {
    showNextImage();
  }
});
