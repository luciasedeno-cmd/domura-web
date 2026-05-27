// ==========================================================================
// CURSOR PERSONALIZADO
// ==========================================================================
const isFinePointer = matchMedia('(pointer: fine)').matches;
const dot  = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');

if (isFinePointer && dot && ring) {
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  });

  (function loop() {
    rx += (mx - rx) * 0.15; ry += (my - ry) * 0.15;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(loop);
  })();

  // Tarjetas blancas (.pre-card) → cursor oscuro
  document.querySelectorAll('.pre-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      dot.classList.add('cursor-dark', 'hover-active');
      ring.classList.add('cursor-dark', 'hover-active');
      document.body.classList.add('hover-active');
    });
    card.addEventListener('mouseleave', () => {
      dot.classList.remove('cursor-dark', 'hover-active');
      ring.classList.remove('cursor-dark', 'hover-active');
      document.body.classList.remove('hover-active');
    });
  });

  // Hover genérico para enlaces y botones
  function bindHover(el) {
    if (el.hasAttribute('data-cursor-bind')) return;
    el.setAttribute('data-cursor-bind', 'true');
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('hover-active');
      dot.classList.add('hover-active');
      ring.classList.add('hover-active');
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('hover-active');
      dot.classList.remove('hover-active');
      ring.classList.remove('hover-active');
    });
  }
  document.querySelectorAll('a, button, .wish-card, .tracking-card, .settings-card, .benefit-card, .plan-card').forEach(bindHover);
  setTimeout(() => document.querySelectorAll('a, button').forEach(bindHover), 1000);

} else {
  if (dot) dot.style.display = 'none';
  if (ring) ring.style.display = 'none';
}

// ==========================================================================
// TRANSICIÓN DE ENTRADA (CORTINA)
// ==========================================================================
window.addEventListener('load', () => {
  const t = document.querySelector('.page-transition');
  if (t) {
    t.classList.add('hidden');
    setTimeout(() => { t.style.display = 'none'; }, 600);
  }
  document.body.classList.remove('loading');
  document.body.classList.add('loaded');
});

// ==========================================================================
// HEADER — SCROLL Y FUERZA VISIBILIDAD EN MÓVIL
// ==========================================================================
const mainHeader = document.querySelector('.main-header');
if (mainHeader) {
  if (!isFinePointer) {
    mainHeader.style.display = 'flex';
    mainHeader.style.visibility = 'visible';
    mainHeader.style.opacity = '1';
  }
  window.addEventListener('scroll', () => {
    mainHeader.classList.toggle('scrolled', scrollY > 40);
  }, { passive: true });
}

// ==========================================================================
// MENÚ HAMBURGUESA
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.menu-toggle');
  const nav    = document.querySelector('.nav-menu');
  if (toggle && nav) {
    toggle.addEventListener('click', e => {
      e.stopPropagation();
      const open = document.body.classList.toggle('menu-open');
      toggle.classList.toggle('active', open);
    });
    nav.querySelectorAll('a').forEach(l => l.addEventListener('click', () => {
      document.body.classList.remove('menu-open');
      toggle.classList.remove('active');
    }));
    document.addEventListener('click', e => {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) {
        document.body.classList.remove('menu-open');
        toggle.classList.remove('active');
      }
    });
  }
});

// ==========================================================================
// SCROLL REVEAL
// ==========================================================================
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-visible'); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal-on-scroll').forEach(el => revealObs.observe(el));

const revealObs2 = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => revealObs2.observe(el));

// ==========================================================================
// HOME: LOADER DE PÁGINA
// ==========================================================================
const loaderEl     = document.querySelector('.page-loader');
const progressText = document.querySelector('.loader-progress');

if (loaderEl && progressText) {
  if (sessionStorage.getItem('domura_visited')) {
    loaderEl.classList.add('hidden');
    document.body.classList.add('loaded');
  } else {
    sessionStorage.setItem('domura_visited', '1');
    let loaderProgress = 0;
    const loadInterval = setInterval(() => {
      loaderProgress += Math.floor(Math.random() * 5) + 2;
      if (loaderProgress >= 100) {
        loaderProgress = 100;
        clearInterval(loadInterval);
        progressText.textContent = '100%';
        setTimeout(() => {
          loaderEl.classList.add('hidden');
          document.body.classList.add('loaded');
        }, 400);
      } else {
        progressText.textContent = loaderProgress + '%';
      }
    }, 35);
  }
}

// ==========================================================================
// HOME: SLIDER STICKY
// ==========================================================================
const sliderWrapper  = document.querySelector('.slider-wrapper');
const bgSlides       = document.querySelectorAll('.bg-slide');
const topSlides      = document.querySelectorAll('.zone-top .text-slide');
const bottomSlides   = document.querySelectorAll('.zone-bottom .text-slide');
const progressLine   = document.querySelector('.progress-line');

if (sliderWrapper && bgSlides.length > 0) {
  const totalSlides  = bgSlides.length;
  const numIntervals = totalSlides - 1;

  window.addEventListener('scroll', () => {
    const wrapperRect  = sliderWrapper.getBoundingClientRect();
    const totalDistance = sliderWrapper.offsetHeight - window.innerHeight;
    let globalProgress = totalDistance > 0 ? -wrapperRect.top / totalDistance : 0;
    globalProgress = Math.min(Math.max(globalProgress, 0), 1);

    if (progressLine) progressLine.style.width = (globalProgress * 100) + '%';

    bgSlides.forEach((slide, index) => {
      if (index === 0) return;
      const start = (index - 1) / numIntervals;
      const end   = index / numIntervals;
      if (globalProgress <= start)     slide.style.height = '0%';
      else if (globalProgress >= end)  slide.style.height = '100%';
      else slide.style.height = ((globalProgress - start) / (end - start) * 100) + '%';
    });

    [topSlides, bottomSlides].forEach(group => {
      group.forEach(s => { s.style.opacity = 0; s.style.visibility = 'hidden'; });
    });

    let activeIndex = -1, opacity = 0, y = 0;

    if (globalProgress === 1) {
      activeIndex = totalSlides - 1; opacity = 1; y = 0;
    } else {
      let interval = Math.floor(globalProgress * numIntervals);
      if (interval >= numIntervals) interval = numIntervals - 1;
      const start = interval / numIntervals;
      const end   = (interval + 1) / numIntervals;
      const lp    = (globalProgress - start) / (end - start);

      if (lp < 0.25) {
        activeIndex = interval;
        if (lp < 0.1) { opacity = 1; y = 0; }
        else { const p = (lp - 0.1) / 0.15; opacity = 1 - p; y = -p * 15; }
      } else if (lp > 0.75) {
        activeIndex = interval + 1;
        if (lp > 0.9) { opacity = 1; y = 0; }
        else { const p = (lp - 0.75) / 0.15; opacity = p; y = (1 - p) * 15; }
      }
    }

    if (activeIndex >= 0 && activeIndex < totalSlides) {
      if (topSlides[activeIndex]) {
        topSlides[activeIndex].style.visibility = 'visible';
        topSlides[activeIndex].style.opacity    = opacity;
        topSlides[activeIndex].style.transform  = `translateY(${y}px)`;
      }
      if (bottomSlides[activeIndex]) {
        bottomSlides[activeIndex].style.visibility = 'visible';
        bottomSlides[activeIndex].style.opacity    = opacity;
        bottomSlides[activeIndex].style.transform  = `translateY(${y}px)`;
      }
    }
  });

  window.dispatchEvent(new Event('scroll'));
}

// ==========================================================================
// HOME: CARRUSEL DE OPINIONES
// ==========================================================================
const revItems  = document.querySelectorAll('.review-item');
const revImgs   = document.querySelectorAll('.review-bg-img');
const prevBtn   = document.querySelector('.prev-review');
const nextBtn   = document.querySelector('.next-review');
const currLabel = document.getElementById('curr-rev');
let revIdx = 0;

function updateReviews(newIdx) {
  if (!revItems.length) return;
  revItems[revIdx].classList.remove('active');
  if (revImgs[revIdx]) revImgs[revIdx].classList.remove('active');
  if (newIdx >= revItems.length) revIdx = 0;
  else if (newIdx < 0)           revIdx = revItems.length - 1;
  else                           revIdx = newIdx;
  revItems[revIdx].classList.add('active');
  if (revImgs[revIdx]) revImgs[revIdx].classList.add('active');
  if (currLabel) currLabel.textContent = `0${revIdx + 1}`;
}

if (nextBtn) nextBtn.addEventListener('click', () => updateReviews(revIdx + 1));
if (prevBtn) prevBtn.addEventListener('click', () => updateReviews(revIdx - 1));

const reviewsContainer = document.querySelector('.reviews-carousel-area, .reviews-container');
if (reviewsContainer && !isFinePointer) {
  let startX = 0;
  reviewsContainer.addEventListener('touchstart', e => { startX = e.changedTouches[0].screenX; }, { passive: true });
  reviewsContainer.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 60) updateReviews(revIdx + (diff > 0 ? 1 : -1));
  }, { passive: true });
}

// ==========================================================================
// PERFIL: SIDEBAR — ENLACE ACTIVO EN SCROLL
// ==========================================================================
const sidebarLinks = document.querySelectorAll('.sidebar-link[href^="#"]');
const sections     = document.querySelectorAll('section[id]');

if (sidebarLinks.length && sections.length) {
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 160) current = sec.id;
    });
    sidebarLinks.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === '#' + current);
    });
  }, { passive: true });
}

// ==========================================================================
// PERFIL: CHATBOT
// ==========================================================================
const chatToggleBtn  = document.getElementById('chatbotToggle');
const chatWindow     = document.getElementById('chatbotWindow');
const chatMessages   = document.getElementById('chatMessages');
const chatInput      = document.getElementById('chatInput');
const chatSend       = document.getElementById('chatSend');
const chatSuggestions = document.getElementById('chatSuggestions');

if (chatToggleBtn && chatWindow && chatMessages && chatInput && chatSend) {
  let chatOpen = false;

  chatToggleBtn.addEventListener('click', () => {
    chatOpen = !chatOpen;
    document.body.classList.toggle('chatbot-open', chatOpen);
  });

  const botReplies = {
    'pedido':       'Tu pedido más reciente (#DOM-2024-0471) está en tránsito y llegará mañana entre las 10:00 y las 14:00. ¿Necesitas más detalles?',
    'llega':        'Tu próxima entrega está prevista para mañana, 24 de mayo, en el tramo horario de 10:00–14:00. El transportista te enviará un SMS cuando esté cerca.',
    'club':         'Como miembro del Club Anual disfrutas de: envío premium gratis, 15% de descuento en todo el catálogo, acceso anticipado a colecciones Limited (48h antes), línea prioritaria con respuesta en menos de 2h e invitaciones a 4 eventos exclusivos al año.',
    'anual':        'El plan Anual cuesta 179€/año (equivale a 14,92€/mes). Incluye todos los beneficios premium. ¡Ya lo tienes activo!',
    'mensual':      'El plan Mensual cuesta 17€/mes sin permanencia. Puedes cambiar o cancelar cuando quieras desde la sección Club.',
    'dirección':    'Para cambiar tu dirección de envío ve a Ajustes → Dirección de envío y pulsa "Editar". Los cambios se aplican a partir del siguiente pedido.',
    'cancelar':     'Puedes cancelar un pedido dentro de las primeras 2 horas tras realizarlo. Escríbenos a hola@domura.es o llámanos al 900 XXX XXX y lo gestionamos de inmediato.',
    'experiencias': 'Actualmente tenemos disponibles experiencias de las colecciones Essential, Curated, Signature y Limited. Puedes explorar el catálogo completo en la sección Experiencias.',
    'envío':        'Todos los envíos se realizan en temperatura controlada con mensajería premium. Como miembro del Club el envío es siempre gratuito.',
    'precio':       'Los precios varían según la experiencia y el número de comensales. Essential desde 30€, Curated desde 45€, Signature desde 85€ y Limited desde 130€.',
    'factura':      'Tus facturas están disponibles en la sección Pedidos. Pulsa sobre cualquier pedido para descargar el PDF de factura.',
    'regalo':       'Puedes regalar cualquier experiencia a través de la página de la experiencia pulsando "Regalar". Llegará con un packaging especial y una tarjeta personalizada.',
    'default':      'Entendido. Para consultas más específicas puedes contactar con nuestro equipo en hola@domura.es o llamarnos al 900 XXX XXX (L-V, 9:00–18:00). Estamos encantados de ayudarte.'
  };

  function getBotReply(text) {
    const t = text.toLowerCase();
    for (const [key, reply] of Object.entries(botReplies)) {
      if (key !== 'default' && t.includes(key)) return reply;
    }
    return botReplies.default;
  }

  function addMessage(text, sender) {
    const now = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    const div = document.createElement('div');
    div.className = `msg ${sender}`;
    div.innerHTML = `<div class="msg-bubble">${text}</div><div class="msg-time">${now}</div>`;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showTyping() {
    const div = document.createElement('div');
    div.className = 'msg bot typing-msg';
    div.innerHTML = `<div class="msg-bubble"><div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div></div>`;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return div;
  }

  function sendMessage(text) {
    if (!text.trim()) return;
    addMessage(text, 'user');
    chatInput.value = '';
    if (chatSuggestions) chatSuggestions.style.display = 'none';
    const typing = showTyping();
    setTimeout(() => {
      chatMessages.removeChild(typing);
      addMessage(getBotReply(text), 'bot');
    }, 900 + Math.random() * 600);
  }

  chatSend.addEventListener('click', () => sendMessage(chatInput.value));
  chatInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(chatInput.value); });
  document.querySelectorAll('.suggestion-chip').forEach(chip => {
    chip.addEventListener('click', () => sendMessage(chip.getAttribute('data-msg')));
  });
}

// ==========================================================================
// PERFIL: TOGGLES DE NOTIFICACIONES
// ==========================================================================
document.querySelectorAll('.toggle').forEach(btn => {
  btn.addEventListener('click', () => btn.classList.toggle('on'));
});

// ==========================================================================
// FAQ: ACORDEÓN (llamado desde onclick="toggleFaq(this)")
// ==========================================================================
window.toggleFaq = function(btn) {
  const item   = btn.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
};

// ==========================================================================
// PÁGINA EXPERIENCIAS: CARRUSELES DE GALERÍA
// ==========================================================================
document.querySelectorAll('.exp-gallery').forEach(gallery => {
  const slides   = gallery.querySelectorAll('.exp-gallery-slides img');
  const dotsWrap = gallery.querySelector('.exp-gallery-dots');
  const hitLeft  = gallery.querySelector('.exp-gallery-hitbox.left');
  const hitRight = gallery.querySelector('.exp-gallery-hitbox.right');
  const total    = slides.length;
  let current = 0, timer = null;

  if (!slides.length || !dotsWrap) return;

  slides.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'exp-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', `Foto ${i + 1}`);
    d.addEventListener('click', e => { e.stopPropagation(); goTo(i); resetTimer(); });
    dotsWrap.appendChild(d);
  });

  function goTo(idx) {
    slides[current].classList.remove('active');
    dotsWrap.children[current]?.classList.remove('active');
    current = (idx + total) % total;
    slides[current].classList.add('active');
    dotsWrap.children[current]?.classList.add('active');
  }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 4000);
  }

  resetTimer();

  if (isFinePointer) {
    hitLeft?.addEventListener('click',  e => { e.stopPropagation(); goTo(current - 1); resetTimer(); });
    hitRight?.addEventListener('click', e => { e.stopPropagation(); goTo(current + 1); resetTimer(); });
    hitLeft?.addEventListener('mouseenter',  () => { ring?.classList.add('cursor-arrow-left');  if (dot) dot.style.opacity = '0'; });
    hitLeft?.addEventListener('mouseleave',  () => { ring?.classList.remove('cursor-arrow-left');  if (dot) dot.style.opacity = '1'; });
    hitRight?.addEventListener('mouseenter', () => { ring?.classList.add('cursor-arrow-right'); if (dot) dot.style.opacity = '0'; });
    hitRight?.addEventListener('mouseleave', () => { ring?.classList.remove('cursor-arrow-right'); if (dot) dot.style.opacity = '1'; });
  } else {
    let startX = 0;
    const slidesHolder = gallery.querySelector('.exp-gallery-slides');
    slidesHolder?.addEventListener('touchstart', e => { startX = e.changedTouches[0].screenX; }, { passive: true });
    slidesHolder?.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) { goTo(diff > 0 ? current + 1 : current - 1); resetTimer(); }
    }, { passive: true });
  }
});

// ==========================================================================
// DETALLE DE EXPERIENCIA: GALERÍA PRINCIPAL + COMENSALES + POPUP 4+
// ==========================================================================
const imgs   = document.querySelectorAll('.exp-main-img img');
const thumbs = document.querySelectorAll('.exp-thumb');

if (imgs.length) {
  let curImg = 0;

  function goImg(i) {
    imgs[curImg].classList.remove('active');
    if (thumbs[curImg]) thumbs[curImg].classList.remove('active');
    curImg = (i + imgs.length) % imgs.length;
    imgs[curImg].classList.add('active');
    if (thumbs[curImg]) thumbs[curImg].classList.add('active');
  }

  thumbs.forEach((t, i) => t.addEventListener('click', () => goImg(i)));

  const galLeft  = document.querySelector('.gal-hit.left');
  const galRight = document.querySelector('.gal-hit.right');

  galLeft?.addEventListener('click', () => goImg(curImg - 1));
  galRight?.addEventListener('click', () => goImg(curImg + 1));

  if (isFinePointer) {
    galLeft?.addEventListener('mouseenter',  () => { ring?.classList.add('cursor-arrow-left');  if (dot) dot.style.opacity = '0'; });
    galLeft?.addEventListener('mouseleave',  () => { ring?.classList.remove('cursor-arrow-left');  if (dot) dot.style.opacity = '1'; });
    galRight?.addEventListener('mouseenter', () => { ring?.classList.add('cursor-arrow-right'); if (dot) dot.style.opacity = '0'; });
    galRight?.addEventListener('mouseleave', () => { ring?.classList.remove('cursor-arrow-right'); if (dot) dot.style.opacity = '1'; });
  }

  let sx = 0;
  document.querySelector('.exp-main-img')?.addEventListener('touchstart', e => { sx = e.changedTouches[0].screenX; }, { passive: true });
  document.querySelector('.exp-main-img')?.addEventListener('touchend', e => {
    const d = sx - e.changedTouches[0].screenX;
    if (Math.abs(d) > 50) goImg(curImg + (d > 0 ? 1 : -1));
  }, { passive: true });

  setInterval(() => goImg(curImg + 1), 5000);
}

// Selector de comensales
document.querySelectorAll('.cc-btn:not(.plus-btn)').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.cc-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
  });
});

// Popup 4+ comensales — precio leído de la primera opción de .cc-price
const popupOv = document.getElementById('popupOv');
if (popupOv) {
  const firstCcPriceEl = document.querySelector('.cc-btn:not(.plus-btn) .cc-price');
  const PPP = firstCcPriceEl
    ? parseFloat(firstCcPriceEl.textContent.replace(',', '.').replace(/[^\d.]/g, ''))
    : 0;

  window.openPopup = function() {
    document.getElementById('nPers').value = 4;
    window.calcPrice();
    popupOv.classList.add('open');
  };
  window.closePopup = function() { popupOv.classList.remove('open'); };
  window.calcPrice  = function() {
    const n = Math.max(1, parseInt(document.getElementById('nPers').value) || 4);
    const priceEl = document.getElementById('popupPrice');
    if (priceEl) priceEl.textContent = (n * PPP).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
  };

  popupOv.addEventListener('click', e => { if (e.target === e.currentTarget) window.closePopup(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') window.closePopup(); });
}

// ==========================================================================
// addPopupToCart — declaración global hoisted (llamada desde onclick en HTML)
// ==========================================================================
function addPopupToCart() {
  const priceEl = document.querySelector('.cc-btn.selected:not(.plus-btn) .cc-price')
               || document.querySelector('.cc-btn:not(.plus-btn) .cc-price');
  const ppp     = priceEl
    ? parseFloat(priceEl.textContent.replace(',', '.').replace(/[^\d.]/g, ''))
    : 0;
  const nEl     = document.getElementById('nPers');
  const n       = Math.max(1, parseInt(nEl ? nEl.value : '4') || 4);
  const titleEl = document.querySelector('.exp-title');
  const titulo  = titleEl
    ? titleEl.textContent.trim()
    : (document.title.split(/\s*[-—]\s*/)[1] || document.title).trim();
  const imgEl   = document.querySelector('.exp-main-img img.active') || document.querySelector('.exp-main-img img');
  const imagen  = imgEl ? (imgEl.getAttribute('src') || '') : '';
  const precio  = (n * ppp).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '€';
  const personas = String(n);
  const cart = getCart();
  const idx  = cart.findIndex(i => i && i.titulo === titulo && i.personas === personas);
  if (idx >= 0) {
    cart[idx].quantity = (cart[idx].quantity || 1) + 1;
  } else {
    cart.push({ titulo, personas, precio, imagen, quantity: 1 });
  }
  saveCart(cart);
  updateCartBadge();
  window.location.href = 'carrito.html';
}

// ==========================================================================
// startQuiz — declaración global hoisted (llamada desde onclick en HTML)
// ==========================================================================
function startQuiz() {
  const pre  = document.getElementById('phase-pre-test');
  const flow = document.getElementById('phase-quiz-flow');
  const res  = document.getElementById('phase-result');
  if (!pre || !flow) return;
  [pre, flow, res].forEach(function(p) { if (p) p.classList.remove('active'); });
  flow.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================================================
// CARRITO: FUNCIONES BASE (ARRAY MULTI-ITEM)
// ==========================================================================
function getCart() {
  try {
    const raw = localStorage.getItem('domura_cart');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem('domura_cart', JSON.stringify(cart));
}

function parsePrice(str) {
  return parseFloat(String(str).replace(/[^\d,]/g, '').replace(',', '.')) || 0;
}

function formatPrice(num) {
  return num.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '€';
}

function updateCartBadge() {
  const cart  = getCart();
  const count = cart.reduce((s, i) => s + (i.quantity || 1), 0);
  document.querySelectorAll('.cart-badge, .nav-badge').forEach(badge => {
    if (count > 0) {
      badge.textContent = count > 9 ? '9+' : String(count);
      badge.classList.add('has-items');
    } else {
      badge.textContent = '';
      badge.classList.remove('has-items');
    }
  });
}

// Inyectar badge en el icono de carrito del header
document.querySelectorAll('a[href="carrito.html"].icon-btn').forEach(btn => {
  if (!btn.querySelector('.cart-badge')) {
    const badge = document.createElement('span');
    badge.className = 'cart-badge';
    btn.appendChild(badge);
  }
});
updateCartBadge();

// "Añadir al carrito" en páginas de experiencia -> guarda y redirige
const btnCart = document.querySelector('.btn-cart');
if (btnCart) {
  btnCart.addEventListener('click', () => {
    let selectedBtn = document.querySelector('.cc-btn.selected:not(.plus-btn)');
    if (!selectedBtn) {
      selectedBtn = document.querySelector('.cc-btn:not(.plus-btn)');
      if (selectedBtn) {
        document.querySelectorAll('.cc-btn').forEach(b => b.classList.remove('selected'));
        selectedBtn.classList.add('selected');
      }
    }
    if (!selectedBtn) return;

    const personas = selectedBtn.querySelector('.cc-num')?.textContent.trim() || '1';
    const precio   = selectedBtn.querySelector('.cc-price')?.textContent.trim() || '';
    const titulo   = document.querySelector('.exp-title')?.textContent.trim()
                  || document.title.replace(' — Domura', '').replace(' - Domura', '').trim();
    const imgEl    = document.querySelector('.exp-main-img img.active') || document.querySelector('.exp-main-img img');
    const imagen   = imgEl?.getAttribute('src') || '';

    const cart = getCart();
    const idx  = cart.findIndex(i => i.titulo === titulo && i.personas === personas);
    if (idx >= 0) {
      cart[idx].quantity = (cart[idx].quantity || 1) + 1;
    } else {
      cart.push({ titulo, personas, precio, imagen, quantity: 1 });
    }
    saveCart(cart);
    updateCartBadge();

    // Redirect to cart immediately
    window.location.href = 'carrito.html';
  });
}

// ==========================================================================
// CARRITO: PAGINA - RENDERIZAR ITEMS CON +/-
// ==========================================================================
function renderCartPage() {
  const container = document.getElementById('cart-items-container');
  if (!container) return;

  const cart = getCart();
  container.innerHTML = '';

  if (cart.length === 0) {
    container.innerHTML = '<p class="cart-empty">Tu carrito está vacío.</p>';
    updateCartSummary(0);
    const btnNext = document.querySelector('#step-1 .btn-checkout');
    if (btnNext) btnNext.disabled = true;
    return;
  }

  const btnNext = document.querySelector('#step-1 .btn-checkout');
  if (btnNext) btnNext.disabled = false;

  cart.forEach((item, idx) => {
    const row = document.createElement('div');
    row.className = 'cart-item-row';
    const pluralP   = item.personas !== '1' ? 's' : '';
    const lineTotal = parsePrice(item.precio) * (item.quantity || 1);

    row.innerHTML = `
      <img src="${item.imagen}" alt="${item.titulo}" class="cart-img">
      <div class="cart-details">
        <h3 class="cart-item-title">${item.titulo}</h3>
        <p class="cart-item-subtitle">${item.personas} persona${pluralP}</p>
      </div>
      <div class="cart-meta">
        <div class="cart-qty-ctrl">
          <button class="qty-btn qty-minus" data-idx="${idx}">−</button>
          <span class="cart-qty">${item.quantity || 1}</span>
          <button class="qty-btn qty-plus" data-idx="${idx}">+</button>
        </div>
        <div class="cart-price">${formatPrice(lineTotal)}</div>
      </div>
    `;
    container.appendChild(row);
  });

  container.querySelectorAll('.qty-minus').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = parseInt(btn.dataset.idx);
      const c = getCart();
      if (!c[i]) return;
      c[i].quantity = (c[i].quantity || 1) - 1;
      if (c[i].quantity <= 0) c.splice(i, 1);
      saveCart(c);
      updateCartBadge();
      renderCartPage();
    });
  });

  container.querySelectorAll('.qty-plus').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = parseInt(btn.dataset.idx);
      const c = getCart();
      if (!c[i]) return;
      c[i].quantity = (c[i].quantity || 1) + 1;
      saveCart(c);
      updateCartBadge();
      renderCartPage();
    });
  });

  const subtotal = cart.reduce((s, item) => s + parsePrice(item.precio) * (item.quantity || 1), 0);
  updateCartSummary(subtotal);
}

function updateCartSummary(subtotal) {
  const cartPage = document.querySelector('.checkout-page');
  if (!cartPage) return;
  cartPage.querySelectorAll('.summary-block .summary-line').forEach(line => {
    const spans = line.querySelectorAll('span');
    if (spans.length === 2) {
      const label = spans[0].textContent.trim();
      if (label === 'Subtotal' || label === 'Total') {
        spans[1].textContent = formatPrice(subtotal);
      }
    }
  });
}

if (document.querySelector('.checkout-page')) renderCartPage();

// ==========================================================================
// CARRITO: NAVEGACION ENTRE PASOS
// ==========================================================================
function navigateNext(stepNum) {
  if (stepNum === 3) {
    const fecha = document.getElementById('fecha')?.value || '';
    const hora  = document.getElementById('hora')?.value  || '';
    if (fecha) localStorage.setItem('domura_fecha', fecha);
    if (hora)  localStorage.setItem('domura_hora',  hora);
  }
  if (stepNum === 4) {
    const cart  = getCart();
    const fecha = localStorage.getItem('domura_fecha') || document.getElementById('fecha')?.value || '';
    const hora  = localStorage.getItem('domura_hora')  || document.getElementById('hora')?.value  || '';
    const panel = document.querySelector('.success-details');
    if (panel) {
      const fechaStr = fecha
        ? new Date(fecha + 'T12:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
        : '—';
      const horaStr = hora || '—';
      if (cart.length === 1) {
        const item = cart[0];
        const persStr = item.personas ? ` para ${item.personas} persona${item.personas !== '1' ? 's' : ''}` : '';
        panel.innerHTML = `${item.titulo}${persStr} el<br>día <strong>${fechaStr}</strong> a las <strong>${horaStr}h</strong>.`;
      } else if (cart.length > 1) {
        const lines = cart.map(i => `${i.titulo} ×${i.quantity || 1}`).join(', ');
        panel.innerHTML = `${lines}<br>el día <strong>${fechaStr}</strong> a las <strong>${horaStr}h</strong>.`;
      } else {
        panel.innerHTML = `Pedido el<br>día <strong>${fechaStr}</strong> a las <strong>${horaStr}h</strong>.`;
      }
    }
    localStorage.removeItem('domura_cart');
    localStorage.removeItem('domura_fecha');
    localStorage.removeItem('domura_hora');
    updateCartBadge();
  }
  document.querySelectorAll('.step-content').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.step-item').forEach(s => s.classList.remove('active'));
  const content = document.getElementById('step-' + stepNum);
  const label   = document.getElementById('step-label-' + stepNum);
  if (content) content.classList.add('active');
  if (label)   label.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
// ==========================================================================
// TEST DE EXPERIENCIAS: QUIZ
// ==========================================================================
(function() {
  const phasePreTest  = document.getElementById('phase-pre-test');
  const phaseQuizFlow = document.getElementById('phase-quiz-flow');
  const phaseResult   = document.getElementById('phase-result');
  if (!phasePreTest) return;

  const quizAnswers    = { ocasion: null, presupuesto: null, comensales: null, tipo: null };
  const requiredParams = ['ocasion', 'presupuesto', 'comensales', 'tipo'];
  let galIdx = 0, galTotal = 0;

  function showPhase(el) {
    [phasePreTest, phaseQuizFlow, phaseResult].forEach(p => p.classList.remove('active'));
    el.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  document.getElementById('btn-start-quiz')?.addEventListener('click', () => showPhase(phaseQuizFlow));

  document.getElementById('btn-back-to-pretest')?.addEventListener('click', () => {
    requiredParams.forEach(k => { quizAnswers[k] = null; });
    document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
    showPhase(phasePreTest);
  });

  const paramToBlock = { ocasion: 'q1', presupuesto: 'q2', comensales: 'q3', tipo: 'q4' };

  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const param = btn.dataset.param;
      document.querySelectorAll(`.option-btn[data-param="${param}"]`).forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      quizAnswers[param] = btn.dataset.value;
      if (requiredParams.every(k => quizAnswers[k] !== null)) {
        setTimeout(() => showResult(computeResult(quizAnswers)), 350);
      } else {
        const nextParam = requiredParams.find(k => quizAnswers[k] === null);
        if (nextParam) {
          const nextBlock = document.getElementById(paramToBlock[nextParam]);
          if (nextBlock) setTimeout(() => nextBlock.scrollIntoView({ behavior: 'smooth', block: 'center' }), 80);
        }
      }
    });
  });

  function computeResult(ans) {
    let score = 0;
    if (ans.presupuesto === '2') score += 2;
    if (ans.presupuesto === '3') score += 4;
    if (ans.tipo === 'especial')    score += 1;
    if (ans.tipo === 'inigualable') score += 2;
    if (ans.comensales === '+6')    score += 1;
    if (score <= 1) return 'essential';
    if (score <= 3) return 'curated';
    if (score <= 5) return 'signature';
    return 'limited';
  }

  const expData = {
    essential: {
      title: 'Essential Experience',
      description: 'La experiencia perfecta para empezar. Sencilla, elegante y llena de sabor para quienes buscan lo esencial de Domura.',
      feat1: 'Desde 30€ por persona',
      feat2: 'Disponible todo el año',
      price: 'Desde 30€',
      link: 'essential.html',
      images: [
        'assets/fotos/exp/exp_0000s_0011_essential1.jpg',
        'assets/fotos/exp/exp_0000s_0010_essential2.jpg',
        'assets/fotos/exp/exp_0000s_0009_essential3.jpg',
        'assets/fotos/exp/exp_0000s_0008_essential4.jpg'
      ]
    },
    curated: {
      title: 'Curated Experience',
      description: 'Una selección cuidada para quienes buscan algo más especial. Cada detalle elegido con criterio y pasión.',
      feat1: 'Desde 45€ por persona',
      feat2: 'Maridaje incluido',
      price: 'Desde 45€',
      link: 'curated.html',
      images: [
        'assets/fotos/exp/exp_0000s_0015_curated1.jpg',
        'assets/fotos/exp/exp_0000s_0014_curated2.jpg',
        'assets/fotos/exp/exp_0000s_0013_curated3.jpg',
        'assets/fotos/exp/exp_0000s_0012_curated4.jpg'
      ]
    },
    signature: {
      title: 'Signature Experience',
      description: 'Lo mejor de Domura en una experiencia de alto nivel. Productos exclusivos, presentación impecable y servicio personalizado.',
      feat1: 'Desde 85€ por persona',
      feat2: 'Servicio personalizado',
      price: 'Desde 85€',
      link: 'signature.html',
      images: [
        'assets/fotos/exp/exp_0000s_0003_signature1.jpg',
        'assets/fotos/exp/exp_0000s_0002_signature2.jpg',
        'assets/fotos/exp/exp_0000s_0001_signature3.jpg',
        'assets/fotos/exp/exp_0000s_0000_signature 4.jpg'
      ]
    },
    limited: {
      title: 'Limited Experience',
      description: 'Lo más exclusivo de Domura. Una experiencia única, irrepetible y diseñada para quienes no se conforman con lo ordinario.',
      feat1: 'Desde 130€ por persona',
      feat2: 'Edición limitada',
      price: 'Desde 130€',
      link: 'limited.html',
      images: [
        'assets/fotos/exp/exp_0000s_0007_limited1.jpg',
        'assets/fotos/exp/exp_0000s_0006_limited2.jpg',
        'assets/fotos/exp/exp_0000s_0005_limited3.jpg',
        'assets/fotos/exp/exp_0000s_0004_limited4.jpg'
      ]
    }
  };

  function showResult(tier) {
    const data = expData[tier];
    document.getElementById('res-title').textContent       = data.title;
    document.getElementById('res-description').textContent = data.description;
    document.getElementById('res-feat-1').textContent      = data.feat1;
    document.getElementById('res-feat-2').textContent      = data.feat2;
    document.getElementById('res-price').textContent       = data.price;
    const linkEl = document.getElementById('res-link');
    if (linkEl) linkEl.href = data.link;

    const holder = document.getElementById('gallery-holder');
    if (holder) {
      holder.innerHTML = '';
      data.images.forEach((src, i) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = data.title;
        if (i === 0) img.classList.add('active');
        holder.appendChild(img);
      });
    }
    galIdx   = 0;
    galTotal = data.images.length;

    function goGal(dir) {
      const allImgs = holder?.querySelectorAll('img');
      if (!allImgs?.length) return;
      allImgs[galIdx].classList.remove('active');
      galIdx = (galIdx + dir + galTotal) % galTotal;
      allImgs[galIdx].classList.add('active');
    }

    const prevZone = document.getElementById('gallery-prev-zone');
    const nextZone = document.getElementById('gallery-next-zone');
    if (prevZone) {
      prevZone.onclick = () => goGal(-1);
      if (isFinePointer) {
        prevZone.addEventListener('mouseenter', () => { ring?.classList.add('cursor-arrow-left');  if (dot) dot.style.opacity = '0'; });
        prevZone.addEventListener('mouseleave', () => { ring?.classList.remove('cursor-arrow-left');  if (dot) dot.style.opacity = '1'; });
      }
    }
    if (nextZone) {
      nextZone.onclick = () => goGal(1);
      if (isFinePointer) {
        nextZone.addEventListener('mouseenter', () => { ring?.classList.add('cursor-arrow-right'); if (dot) dot.style.opacity = '0'; });
        nextZone.addEventListener('mouseleave', () => { ring?.classList.remove('cursor-arrow-right'); if (dot) dot.style.opacity = '1'; });
      }
    }

    showPhase(phaseResult);
  }
})();

// ==========================================================================
// CABECERA MÓVIL: PERFIL Y CARRITO ESTÁN EN EL HTML DE CADA PÁGINA
// El badge del carrito se actualiza con updateCartBadge() ya llamado arriba.
// ==========================================================================
// ==========================================================================
// SISTEMA DE COOKIES
// ==========================================================================
(function() {
  if (localStorage.getItem('domura_cookie_consent')) return;

  const banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.innerHTML = `
    <p class="cookie-text">
      Usamos cookies propias y de terceros para mejorar tu experiencia y mostrarte contenido personalizado.
      Puedes aceptarlas todas o solo las necesarias. <a href="privacidad.html">Más información</a>.
    </p>
    <div class="cookie-actions">
      <button class="cookie-btn reject" id="cookieReject">Solo necesarias</button>
      <button class="cookie-btn accept" id="cookieAccept">Aceptar todas</button>
    </div>
  `;
  document.body.appendChild(banner);
  setTimeout(() => banner.classList.add('visible'), 600);

  function dismissBanner(value) {
    localStorage.setItem('domura_cookie_consent', value);
    banner.classList.remove('visible');
    setTimeout(() => banner.remove(), 500);
  }
  banner.querySelector('#cookieAccept').addEventListener('click', () => dismissBanner('accepted'));
  banner.querySelector('#cookieReject').addEventListener('click', () => dismissBanner('rejected'));
})();
