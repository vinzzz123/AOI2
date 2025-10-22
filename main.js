// main.js
// Save this file in your project root directory
// This file contains common JavaScript used across all pages

// =====================
// LOADING SCREEN
// =====================
window.addEventListener('load', () => {
  setTimeout(() => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.classList.add('hidden');
    }
  }, 500);
});

// =====================
// MOBILE MENU
// =====================
function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const icon = document.querySelector('.hamburger-menu i');
  
  if (menu && icon) {
    menu.classList.toggle('active');
    icon.className = menu.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
    document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
  }
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  const menu = document.getElementById('mobile-menu');
  const hamburger = document.querySelector('.hamburger-menu');
  
  if (menu && hamburger && menu.classList.contains('active') && 
      !menu.contains(e.target) && !hamburger.contains(e.target)) {
    toggleMobileMenu();
  }
});

// Close mobile menu on Escape key
document.addEventListener('keydown', (e) => {
  const menu = document.getElementById('mobile-menu');
  if (e.key === 'Escape' && menu && menu.classList.contains('active')) {
    toggleMobileMenu();
  }
});

// =====================
// SMOOTH SCROLLING
// =====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    
    e.preventDefault();
    const target = document.querySelector(href);
    
    if (target) {
      const navbar = document.querySelector('nav');
      const navHeight = navbar ? navbar.offsetHeight : 90;
      const targetPosition = target.offsetTop - navHeight - 20;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      // Close mobile menu if open
      const menu = document.getElementById('mobile-menu');
      if (menu && menu.classList.contains('active')) {
        toggleMobileMenu();
      }
    }
  });
});

// =====================
// SCROLL TO TOP BUTTON
// =====================
const scrollBtn = document.getElementById('scroll-to-top');
if (scrollBtn) {
  window.addEventListener('scroll', () => {
    scrollBtn.classList.toggle('visible', window.pageYOffset > 300);
  }, { passive: true });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// =====================
// INTERSECTION OBSERVER (Fade In Animations)
// =====================
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// =====================
// NAVBAR SCROLL EFFECT (Home.html specific)
// =====================
const navbar = document.getElementById('navbar');
const logoImg = document.getElementById('logo-img');

if (navbar && logoImg) {
  function handleScroll() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      navbar.classList.add('scrolled');
      logoImg.src = "Assets/AOI.png";
    } else {
      navbar.classList.remove('scrolled');
      logoImg.src = "Assets/AOI(1).png";
    }
  }
  
  window.addEventListener('scroll', handleScroll, { passive: true });
}

// =====================
// STORE SLIDER (Home.html specific)
// =====================
const sliderTrack = document.getElementById('slider-track');
if (sliderTrack) {
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const cards = document.querySelectorAll('.store-card');

  let currentIndex = 0;
  let startX = 0;
  let isDragging = false;

  function getCardsPerView() {
    const width = window.innerWidth;
    if (width < 480) return 2;
    if (width < 768) return 3;
    if (width < 1024) return 4;
    return 5;
  }

  function updateSlider() {
    const cardsPerView = getCardsPerView();
    const cardWidth = cards[0].offsetWidth;
    const gap = 16;
    const offset = -(currentIndex * (cardWidth + gap));
    
    sliderTrack.style.transform = `translateX(${offset}px)`;

    const maxIndex = Math.max(0, cards.length - cardsPerView);
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= maxIndex;
  }

  if (nextBtn && prevBtn) {
    nextBtn.addEventListener('click', () => {
      const cardsPerView = getCardsPerView();
      const maxIndex = Math.max(0, cards.length - cardsPerView);
      if (currentIndex < maxIndex) {
        currentIndex++;
        updateSlider();
      }
    });

    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateSlider();
      }
    });
  }

  sliderTrack.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
  }, { passive: true });

  sliderTrack.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;
    
    const endX = e.changedTouches[0].clientX;
    const diffX = startX - endX;
    
    if (Math.abs(diffX) > 50) {
      if (diffX > 0 && nextBtn) {
        nextBtn.click();
      } else if (prevBtn) {
        prevBtn.click();
      }
    }
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      currentIndex = 0;
      updateSlider();
    }, 150);
  });

  updateSlider();
}

// =====================
// CONTENT SLIDERS (AOI.html specific)
// =====================
if (typeof sliders !== 'undefined') {
  window.nextSlide = function(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    
    const slides = section.querySelectorAll('.slide');
    const arrow = section.querySelector('.slider-arrow');
    
    slides[sliders[sectionId]].classList.remove('active');
    
    if (sliders[sectionId] === slides.length - 1) {
      sliders[sectionId] = 0;
      arrow.textContent = '→';
    } else {
      sliders[sectionId]++;
      if (sliders[sectionId] === slides.length - 1) {
        arrow.textContent = '↻';
      }
    }
    
    slides[sliders[sectionId]].classList.add('active');
  };

  window.scrollToSection = function(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      const navbar = document.querySelector('nav');
      window.scrollTo({
        top: section.offsetTop - navbar.offsetHeight - 20,
        behavior: 'smooth'
      });
    }
  };
}

// Make toggleMobileMenu globally available
window.toggleMobileMenu = toggleMobileMenu;

console.log('✅ Main.js loaded successfully');