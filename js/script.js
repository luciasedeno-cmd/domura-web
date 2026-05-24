// ==========================================================================
// 1. LOADER, CURSOR CON DELAY Y OBSERVADOR DE SCROLL INTERSECCIÓN
// ==========================================================================

const loaderEl = document.querySelector('.page-loader');
const progressText = document.querySelector('.loader-progress');
const isFinePointer = matchMedia('(pointer: fine)').matches;

document.addEventListener('DOMContentLoaded', () => {
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  const tarjetasBlancas = document.querySelectorAll('.pre-card');

  // Solo inicializamos la lógica y eventos del cursor si el dispositivo tiene puntero físico (Escritorio)
  if (isFinePointer && (dot || ring)) {
    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    // 1. Movimiento instantáneo del punto central y guardado de coordenadas
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (dot) {
        dot.style.left = `${mouseX}px`;
        dot.style.top = `${mouseY}px`;
      }
    });

    // 2. Movimiento suavizado del anillo exterior (Efecto delay premium)
    function animarAnillo() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;

      if (ring) {
        ring.style.left = `${ringX}px`;
        ring.style.top = `${ringY}px`;
      }

      requestAnimationFrame(animarAnillo);
    }
    animarAnillo();

    // 3. Control total e infalible sobre tus tarjetas ".pre-card" (Cambio a Negro)
    tarjetasBlancas.forEach(tarjeta => {
      tarjeta.addEventListener('mouseenter', () => {
        if (dot && ring) {
          dot.classList.add('cursor-dark', 'hover-active');
          ring.classList.add('cursor-dark', 'hover-active');
        }
        document.body.classList.add('hover-active');
      });

      tarjeta.addEventListener('mouseleave', () => {
        if (dot && ring) {
          dot.classList.remove('cursor-dark', 'hover-active');
          ring.classList.remove('cursor-dark', 'hover-active');
        }
        document.body.classList.remove('hover-active');
      });
    });

    // 4. Lógica extra para otros enlaces o botones genéricos que tengas en zonas negras
    function vincularBotonesEstandar() {
      const otrosBotones = document.querySelectorAll('a:not(.pre-card), button:not(.pre-card), .btn-view-experience, .next-review, .prev-review, .menu-toggle');
      otrosBotones.forEach(boton => {
        if (!boton.hasAttribute('data-cursor-bind')) {
          boton.setAttribute('data-cursor-bind', 'true');
          boton.addEventListener('mouseenter', () => {
            document.body.classList.add('hover-active');
            if (dot && ring) {
              dot.classList.add('hover-active');
              ring.classList.add('hover-active');
            }
          });
          boton.addEventListener('mouseleave', () => {
            document.body.classList.remove('hover-active');
            if (dot && ring) {
              dot.classList.remove('hover-active');
              ring.classList.remove('hover-active');
            }
          });
        }
      });
    }
    vincularBotonesEstandar();
    setTimeout(vincularBotonesEstandar, 1000);
  } else {
    // Si es un dispositivo táctil, ocultamos por completo los elementos del cursor para limpiar el flujo
    if (dot) dot.style.display = 'none';
    if (ring) ring.style.display = 'none';
  }

  // ==========================================================================
  // NUEVO: INTERACTIVIDAD DEL MENÚ HAMBURGUESA RESPONSIVE
  // ==========================================================================
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const mainHeader = document.querySelector('.main-header');

  // Fuerza de rescate: si estamos en móvil, garantizamos por JS que el header esté visible y estructurado
  if (!isFinePointer && mainHeader) {
    mainHeader.style.display = 'flex';
    mainHeader.style.visibility = 'visible';
    mainHeader.style.opacity = '1';
  }

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = document.body.classList.toggle('menu-open');
      menuToggle.classList.toggle('active', isOpen);
    });

    // Auto-cerrar el menú al pulsar sobre cualquier enlace interno
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        document.body.classList.remove('menu-open');
        menuToggle.classList.remove('active');
      });
    });

    // Cerrar de forma nativa e intuitiva si el usuario pulsa fuera del menú desplegado
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        document.body.classList.remove('menu-open');
        menuToggle.classList.remove('active');
      }
    });
  }
});

// Lógica de precarga fluida hasta 100%
let progress = 0;
const loadInterval = setInterval(() => {
  progress += Math.floor(Math.random() * 5) + 2;
  if (progress >= 100) {
    progress = 100;
    clearInterval(loadInterval);
    if (progressText) progressText.textContent = '100%';
    setTimeout(() => {
      if (loaderEl) loaderEl.classList.add('hidden');
      document.body.classList.add('loaded');
    }, 400);
  } else {
    if (progressText) progressText.textContent = progress + '%';
  }
}, 35);

// Inicializador del sistema de Scroll Reveal
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal-on-scroll').forEach(section => {
  revealObserver.observe(section);
});

// ==========================================================================
// 2. SLIDER STICKY (LÓGICA GESTIÓN DE PANTALLAS)
// ==========================================================================
const sliderWrapper = document.querySelector('.slider-wrapper');
const bgSlides = document.querySelectorAll('.bg-slide');
const topSlides = document.querySelectorAll('.zone-top .text-slide');
const bottomSlides = document.querySelectorAll('.zone-bottom .text-slide');
const progressLine = document.querySelector('.progress-line');

if (bgSlides.length > 0) {
  const totalSlides = bgSlides.length;
  const numIntervals = totalSlides - 1;

  window.addEventListener('scroll', () => {
    if (!sliderWrapper) return;
    const wrapperRect = sliderWrapper.getBoundingClientRect();
    const totalDistance = sliderWrapper.offsetHeight - window.innerHeight;

    // Si la distancia total es 0 o negativa (por ejemplo, layouts colapsados), evitamos divisiones por cero
    let globalProgress = totalDistance > 0 ? -wrapperRect.top / totalDistance : 0;
    globalProgress = Math.min(Math.max(globalProgress, 0), 1);

    if (progressLine) progressLine.style.width = (globalProgress * 100) + '%';

    bgSlides.forEach((slide, index) => {
      if (index === 0) return;
      const start = (index - 1) / numIntervals;
      const end = index / numIntervals;
      if (globalProgress <= start) slide.style.height = '0%';
      else if (globalProgress >= end) slide.style.height = '100%';
      else {
        const local = (globalProgress - start) / (end - start);
        slide.style.height = (local * 100) + '%';
      }
    });

    [topSlides, bottomSlides].forEach(group => {
      group.forEach(s => { s.style.opacity = 0; s.style.visibility = 'hidden'; });
    });

    let activeIndex = -1;
    let opacity = 0;
    let y = 0;

    if (globalProgress === 1) {
      activeIndex = totalSlides - 1;
      opacity = 1; y = 0;
    } else {
      let interval = Math.floor(globalProgress * numIntervals);
      if (interval >= numIntervals) interval = numIntervals - 1;
      const start = interval / numIntervals;
      const end = (interval + 1) / numIntervals;
      const localProgress = (globalProgress - start) / (end - start);

      if (localProgress < 0.25) {
        activeIndex = interval;
        if (localProgress < 0.1) { opacity = 1; y = 0; }
        else { const p = (localProgress - 0.1) / 0.15; opacity = 1 - p; y = -p * 15; }
      } else if (localProgress > 0.75) {
        activeIndex = interval + 1;
        if (localProgress > 0.9) { opacity = 1; y = 0; }
        else { const p = (localProgress - 0.75) / 0.15; opacity = p; y = (1 - p) * 15; }
      } else {
        activeIndex = -1;
      }
    }

    if (activeIndex >= 0 && activeIndex < totalSlides) {
      if (topSlides[activeIndex]) {
        topSlides[activeIndex].style.visibility = 'visible';
        topSlides[activeIndex].style.opacity = opacity;
        topSlides[activeIndex].style.transform = `translateY(${y}px)`;
      }
      if (bottomSlides[activeIndex]) {
        bottomSlides[activeIndex].style.visibility = 'visible';
        bottomSlides[activeIndex].style.opacity = opacity;
        bottomSlides[activeIndex].style.transform = `translateY(${y}px)`;
      }
    }
  });
}

// ==========================================================================
// 3. CARRUSEL DE OPINIONES (CON SOPORTE ADICIONAL SWIPE TÁCTIL)
// ==========================================================================
const revItems = document.querySelectorAll('.review-item');
const revImgs = document.querySelectorAll('.review-bg-img');
const prevBtn = document.querySelector('.prev-review');
const nextBtn = document.querySelector('.next-review');
const currLabel = document.getElementById('curr-rev');

let revIdx = 0;

function updateReviews(newIdx) {
  if (revItems.length === 0) return;
  revItems[revIdx].classList.remove('active');
  revImgs[revIdx].classList.remove('active');

  if (newIdx >= revItems.length) revIdx = 0;
  else if (newIdx < 0) revIdx = revItems.length - 1;
  else revIdx = newIdx;

  revItems[revIdx].classList.add('active');
  revImgs[revIdx].classList.add('active');

  if (currLabel) currLabel.textContent = `0${revIdx + 1}`;
}

if (nextBtn && prevBtn) {
  nextBtn.addEventListener('click', () => updateReviews(revIdx + 1));
  prevBtn.addEventListener('click', () => updateReviews(revIdx - 1));
}

// Soporte gestual deslizable (Swipe) para mejorar la navegación móvil en opiniones
const reviewsContainer = document.querySelector('.reviews-carousel-area, .reviews-container');
if (reviewsContainer && !isFinePointer) {
  let startX = 0;
  let endX = 0;

  reviewsContainer.addEventListener('touchstart', (e) => {
    startX = e.changedTouches[0].screenX;
  }, { passive: true });

  reviewsContainer.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].screenX;
    const diffX = startX - endX;
    if (Math.abs(diffX) > 60) { // Umbral mínimo de píxeles arrastrados
      if (diffX > 0) updateReviews(revIdx + 1); // Deslizar hacia la izquierda
      else updateReviews(revIdx - 1); // Deslizar hacia la derecha
    }
  }, { passive: true });
}

window.dispatchEvent(new Event('scroll'));

// Transición de salida efecto telón
window.addEventListener('load', () => {
  const transitionScreen = document.querySelector('.page-transition');
  if (transitionScreen) {
    transitionScreen.classList.add('hidden');
    setTimeout(() => {
      transitionScreen.style.display = 'none';
    }, 600);
  }
});
