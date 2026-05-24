// ==========================================================================
// MOTOR DE LOGICA INTERACTIVA PREMIUM DOMURA (test.js) - RESPONSIVE & TOUCH
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');
  const bodyEl = document.body;
  const transitionScreen = document.querySelector('.page-transition');

  const isFinePointer = matchMedia('(pointer: fine)').matches;

  // Quitar pantalla de carga inicial de forma sincronizada
  if (transitionScreen) {
    setTimeout(() => {
      transitionScreen.classList.add('hidden');
      bodyEl.classList.remove('loading');
      bodyEl.classList.add('loaded');
      setTimeout(() => { transitionScreen.style.display = 'none'; }, 600);
    }, 400);
  }

  // Movimiento fluido del puntero premium exclusivo de escritorio (Fine Pointer)
  if (isFinePointer) {
    let mX = 0, mY = 0, rX = 0, rY = 0;

    window.addEventListener('mousemove', (e) => {
      mX = e.clientX;
      mY = e.clientY;
      if (cursorDot) {
        cursorDot.style.left = `${mX}px`;
        cursorDot.style.top = `${mY}px`;
      }
    });

    function suavizarAroTest() {
      rX += (mX - rX) * 0.15;
      rY += (mY - rY) * 0.15;
      if (cursorRing) {
        cursorRing.style.left = `${rX}px`;
        cursorRing.style.top = `${rY}px`;
      }
      requestAnimationFrame(suavizarAroTest);
    }
    suavizarAroTest();

    // Listeners reactivos de hovers para elementos interactivos en desktop
    document.body.addEventListener('mouseenter', (e) => {
      const target = e.target;
      if (target && target.matches && target.matches('a, button, .option-btn, .pre-card')) {
        bodyEl.classList.add('hover-active');
        if (cursorDot && cursorRing) {
          cursorDot.classList.add('hover-active');
          cursorRing.classList.add('hover-active');

          if (target.classList.contains('pre-card')) {
            cursorDot.classList.add('cursor-dark');
            cursorRing.classList.add('cursor-dark');
          }
        }
      }
    }, true);

    document.body.addEventListener('mouseleave', (e) => {
      const target = e.target;
      if (target && target.matches && target.matches('a, button, .option-btn, .pre-card')) {
        bodyEl.classList.remove('hover-active');
        if (cursorDot && cursorRing) {
          cursorDot.classList.remove('hover-active');
          cursorRing.classList.remove('hover-active');
          cursorDot.classList.remove('cursor-dark');
          cursorRing.classList.remove('cursor-dark');
        }
      }
    }, true);
  } else {
    // Si no es un puntero fino (móvil/tablet), ocultamos de raíz los elementos flotantes
    if (cursorDot) cursorDot.style.display = 'none';
    if (cursorRing) cursorRing.style.display = 'none';
  }

  // Menú hamburguesa
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = bodyEl.classList.toggle('menu-open');
      menuToggle.classList.toggle('active', isOpen);
    });
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        bodyEl.classList.remove('menu-open');
        menuToggle.classList.remove('active');
      });
    });
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        bodyEl.classList.remove('menu-open');
        menuToggle.classList.remove('active');
      }
    });
  }

  // Enrutador de pantallas del test
  const phasePreTest = document.getElementById('phase-pre-test');
  const phaseQuizFlow = document.getElementById('phase-quiz-flow');
  const phaseResult = document.getElementById('phase-result');
  const btnStartQuiz = document.getElementById('btn-start-quiz');

  const userSelections = { ocasion: null, presupuesto: null, comensales: null, tipo: null };

  if (btnStartQuiz) {
    btnStartQuiz.addEventListener('click', () => {
      if (phasePreTest && phaseQuizFlow) {
        phasePreTest.style.opacity = '0';
        phasePreTest.style.transform = 'translateY(-20px)';
        phasePreTest.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

        setTimeout(() => {
          phasePreTest.classList.remove('active');

          phaseQuizFlow.style.opacity = '0';
          phaseQuizFlow.style.transform = 'translateY(20px)';
          phaseQuizFlow.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

          phaseQuizFlow.classList.add('active');
          phaseQuizFlow.offsetHeight; // Forzar reflow

          phaseQuizFlow.style.opacity = '1';
          phaseQuizFlow.style.transform = 'translateY(0)';

          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 400);
      }
    });
  }

  // Botón volver atrás (quiz flow → pre-test)
  const btnBackToPretest = document.getElementById('btn-back-to-pretest');
  if (btnBackToPretest) {
    btnBackToPretest.addEventListener('click', () => {
      if (phaseQuizFlow && phasePreTest) {
        phaseQuizFlow.style.opacity = '0';
        phaseQuizFlow.style.transform = 'translateY(20px)';
        phaseQuizFlow.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

        setTimeout(() => {
          phaseQuizFlow.classList.remove('active');

          phasePreTest.style.opacity = '0';
          phasePreTest.style.transform = 'translateY(-20px)';
          phasePreTest.style.transition = 'none';

          phasePreTest.classList.add('active');
          phasePreTest.offsetHeight;

          phasePreTest.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          phasePreTest.style.opacity = '1';
          phasePreTest.style.transform = 'translateY(0)';

          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 400);
      }
    });
  }

  // Scroll suave automático adaptado para no ser bloqueado por cabeceras responsive
  const questionBlocks = document.querySelectorAll('.question-block');
  const optionButtons = document.querySelectorAll('.option-btn');

  optionButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const currentBlock = this.closest('.question-block');
      const param = this.getAttribute('data-param');
      const value = this.getAttribute('data-value');

      if (currentBlock) {
        currentBlock.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
      }
      this.classList.add('selected');

      userSelections[param] = value;

      const currentIndex = Array.from(questionBlocks).indexOf(currentBlock);
      if (currentIndex < questionBlocks.length - 1) {
        const nextBlock = questionBlocks[currentIndex + 1];
        setTimeout(() => {
          if (nextBlock) {
            // Ajustamos el scroll compensando alturas en móviles
            const offset = window.innerHeight * 0.15;
            const elementPosition = nextBlock.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
              top: elementPosition - offset,
              behavior: 'smooth'
            });
          }
        }, 250);
      } else {
        setTimeout(() => {
          evaluateAndShowResult();
        }, 400);
      }
    });
  });

  // Catálogo Oficial DOMURA
  const experiencesCatalogue = {
    essential: {
      title: "Essential experience",
      description: "La propuesta idónea para transformar una cena rutinaria en una noche especial para recordar. Platos gourmet de autor listos para emplatar con el sello de nuestra alta cocina, ideales para disfrutar sin preocupaciones.",
      feat1: "Alta gastronomía con servicio simplificado y óptimo",
      feat2: "Comida lista para emplatar y disfrutar sin complicaciones",
      price: "€30",
      link: "essential.html",
      images: [
        "assets/fotos/exp/exp_0000s_0011_essential1.jpg",
        "assets/fotos/exp/exp_0000s_0010_essential2.jpg",
        "assets/fotos/exp/exp_0000s_0009_essential3.jpg"
      ]
    },
    curated: {
      title: "Curated experience",
      description: "Experiencia diseñada para veladas íntimas o celebraciones significativas, pensada para impresionar sin complicaciones. Un menú estructurado armónicamente y una guía de montaje completa.",
      feat1: "Menú degustación por pases con maridaje de autor",
      feat2: "Manual de montaje de la mesa y carta de bienvenida personalizada",
      price: "€45",
      link: "curated.html",
      images: [
        "assets/fotos/exp/exp_0000s_0015_curated1.jpg",
        "assets/fotos/exp/exp_0000s_0014_curated2.jpg",
        "assets/fotos/exp/exp_0000s_0013_curated3.jpg"
      ]
    },
    signature: {
      title: "Signature experience",
      description: "La personalización gourmet llega a tu mesa de la manera más sencilla. Un despliegue sensorial único con recetas personalizadas con cada consumidor creados con ingredientes de alto valor gastronómico excepcional.",
      feat1: "Ingredientes exclusivos de temporada e importación premium",
      feat2: "Seguimiento personalizado 24/7 con asistencia de chef durante el montaje",
      price: "€85",
      link: "signature.html",
      images: [
        "assets/fotos/exp/exp_0000s_0003_signature1.jpg",
        "assets/fotos/exp/exp_0000s_0002_signature2.jpg",
        "assets/fotos/exp/exp_0000s_0001_signature3.jpg"
      ]
    },
    limited: {
      title: "Limited experience",
      description: "Una experiencia única y limitada, restringida por temporadas. Menús efímeros en colaboración directa con chefs galardonados con estrellas Michelín y maridajes de colección que crean el ambiente ideal para una velada especial.",
      feat1: "Colaboraciones exclusivas con chefs Estrellas Michelin",
      feat2: "Maridaje de vinos complementarios y accesorios de lujo para la mesa",
      price: "€130",
      link: "limited.html",
      images: [
        "assets/fotos/exp/exp_0000s_0007_limited1.jpg",
        "assets/fotos/exp/exp_0000s_0006_limited2.jpg",
        "assets/fotos/exp/exp_0000s_0005_limited3.jpg"
      ]
    }
  };

  function evaluateAndShowResult() {
    let resultKey = "essential";
    const { presupuesto, tipo } = userSelections;

    if (presupuesto === "3" || tipo === "inigualable") {
      resultKey = "limited";
    } else if (presupuesto === "2" && tipo === "especial") {
      resultKey = "signature";
    } else if (tipo === "especial" || presupuesto === "2") {
      resultKey = "curated";
    } else {
      resultKey = "essential";
    }

    const data = experiencesCatalogue[resultKey];

    // Inyección dinámica
    const rTitle = document.getElementById('res-title');
    const rDesc = document.getElementById('res-description');
    const rFeat1 = document.getElementById('res-feat-1');
    const rFeat2 = document.getElementById('res-feat-2');
    const rPrice = document.getElementById('res-price');
    const rLink = document.getElementById('res-link');

    if (rTitle) rTitle.textContent = data.title;
    if (rDesc) rDesc.textContent = data.description;
    if (rFeat1) rFeat1.textContent = data.feat1;
    if (rFeat2) rFeat2.textContent = data.feat2;
    if (rPrice) rPrice.textContent = data.price;
    if (rLink) rLink.setAttribute('href', data.link);

    const holder = document.getElementById('gallery-holder');
    if (holder) {
      holder.innerHTML = '';
      data.images.forEach((url, i) => {
        const img = document.createElement('img');
        img.src = url;
        img.alt = `${data.title} slide ${i+1}`;
        if (i === 0) img.classList.add('active');
        holder.appendChild(img);
      });
    }

    if (phaseQuizFlow && phaseResult) {
      phaseQuizFlow.style.opacity = '0';
      phaseQuizFlow.style.transform = 'translateY(-20px)';
      phaseQuizFlow.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

      setTimeout(() => {
        phaseQuizFlow.classList.remove('active');
        bodyEl.classList.remove('header-hidden');

        phaseResult.style.opacity = '0';
        phaseResult.style.transform = 'translateY(20px)';
        phaseResult.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

        phaseResult.classList.add('active');
        phaseResult.offsetHeight; // Reflow

        phaseResult.style.opacity = '1';
        phaseResult.style.transform = 'translateY(0)';

        window.scrollTo({ top: 0, behavior: 'smooth' });

        initPremiumGallery(data.images.length);
      }, 400);
    }
  }

  // Gestión de Carrusel Híbrido (Desktop Click + Mobile Gestures)
  let galleryTimer = null;

  function initPremiumGallery(totalImages) {
    let currentIdx = 0;
    const holder = document.getElementById('gallery-holder');
    const oldPrevZone = document.getElementById('gallery-prev-zone');
    const oldNextZone = document.getElementById('gallery-next-zone');

    if (!holder || !oldPrevZone || !oldNextZone) return;

    // Clonación para limpiar listeners antiguos acumulados
    const prevZone = oldPrevZone.cloneNode(true);
    const nextZone = oldNextZone.cloneNode(true);
    oldPrevZone.parentNode.replaceChild(prevZone, oldPrevZone);
    oldNextZone.parentNode.replaceChild(nextZone, oldNextZone);

    function changeSlide(nextIdx) {
      const imgs = holder.querySelectorAll('img');
      if (imgs.length === 0) return;

      imgs[currentIdx].classList.remove('active');
      if (nextIdx >= totalImages) currentIdx = 0;
      else if (nextIdx < 0) currentIdx = totalImages - 1;
      else currentIdx = nextIdx;
      imgs[currentIdx].classList.add('active');
    }

    if (galleryTimer) clearInterval(galleryTimer);
    galleryTimer = setInterval(() => { changeSlide(currentIdx + 1); }, 4000);

    function resetAutoCycle() {
      clearInterval(galleryTimer);
      galleryTimer = setInterval(() => { changeSlide(currentIdx + 1); }, 4000);
    }

    // Comportamiento según el tipo de dispositivo
    if (isFinePointer) {
      // Escritorio: Zonas laterales interactivas
      prevZone.addEventListener('click', (e) => {
        e.stopPropagation();
        changeSlide(currentIdx - 1);
        resetAutoCycle();
      });

      nextZone.addEventListener('click', (e) => {
        e.stopPropagation();
        changeSlide(currentIdx + 1);
        resetAutoCycle();
      });

      prevZone.addEventListener('mouseenter', () => {
        if (cursorRing) cursorRing.classList.add('cursor-arrow-left');
        if (cursorDot) cursorDot.style.opacity = '0';
      });
      prevZone.addEventListener('mouseleave', () => {
        if (cursorRing) cursorRing.classList.remove('cursor-arrow-left');
        if (cursorDot) cursorDot.style.opacity = '1';
      });

      nextZone.addEventListener('mouseenter', () => {
        if (cursorRing) cursorRing.classList.add('cursor-arrow-right');
        if (cursorDot) cursorDot.style.opacity = '0';
      });
      nextZone.addEventListener('mouseleave', () => {
        if (cursorRing) cursorRing.classList.remove('cursor-arrow-right');
        if (cursorDot) cursorDot.style.opacity = '1';
      });
    } else {
      // Móviles y tablets: Soporte nativo para deslizamiento por gestos (Swipe)
      let touchStartX = 0;
      let touchEndX = 0;

      holder.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      holder.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipeGesture();
      }, { passive: true });

      function handleSwipeGesture() {
        const threshold = 50; // Sensibilidad del deslizamiento en px
        if (touchStartX - touchEndX > threshold) {
          // Deslizar hacia la izquierda (Siguiente foto)
          changeSlide(currentIdx + 1);
          resetAutoCycle();
        } else if (touchEndX - touchStartX > threshold) {
          // Deslizar hacia la derecha (Foto anterior)
          changeSlide(currentIdx - 1);
          resetAutoCycle();
        }
      }
    }
  }
});
