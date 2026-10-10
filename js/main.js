/* ==========================================================================
   CAOZ - INTERACCIONES JAVASCRIPT
   Modal de Casos, Filtros, Simulador de Presupuesto y Selector de Paleta
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. MOBILE MENU DRAWER
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileNav = document.getElementById('mobileNav');
  const mobileBackdrop = document.getElementById('mobileBackdrop');

  const toggleMobileNav = () => {
    const isOpen = mobileNav.classList.toggle('open');
    mobileBackdrop.classList.toggle('open', isOpen);
    mobileToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  const closeMobileNav = () => {
    mobileNav.classList.remove('open');
    mobileBackdrop.classList.remove('open');
    mobileToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', toggleMobileNav);
  }
  if (mobileBackdrop) {
    mobileBackdrop.addEventListener('click', closeMobileNav);
  }
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  // 3. DATOS DE CASOS DE ÉXITO & MODAL
  const caseStudies = {
    'masters-latam': {
      title: 'Gran Final Masters LATAM 2025',
      category: 'Campaña 360° · Influencer Marketing & Streaming',
      client: 'Liga Asociada Riot Games',
      image: 'assets/images/hero-stage.jpg',
      stats: [
        { val: '45,200', lbl: 'Espectadores Simultáneos en Pico' },
        { val: '+20 Streamers', lbl: 'Creadores Conectados' },
        { val: '+1.4M', lbl: 'Horas Visualizadas' }
      ],
      description: 'Estrategia integral de lanzamiento regional con más de 20 streamers embajadores, producción de transmisión en directo multicámara y dinamización en redes sociales.',
      challenge: 'Conectar una marca global con más de 1,200 fanáticos presenciales y generar una conversación masiva y orgánica en Twitch, Kick y TikTok.',
      solution: 'Curaduría de talentos gaming, mesa de control Blackmagic 4K, grafismo dinámico de marca en pantalla y microcápsulas verticales distribuidas en tiempo real.'
    },
    'broadcast-production': {
      title: 'Spot Cinemático & Serie Audiovisual',
      category: 'Producción Audiovisual · Animación 3D',
      client: 'Circuito Digital Broadcast',
      image: 'assets/images/broadcast-studio.jpg',
      stats: [
        { val: '+2.8M', lbl: 'Visualizaciones Orgánicas' },
        { val: '18 Piezas', lbl: 'Cápsulas TikTok & Shorts' },
        { val: '98.5%', lbl: 'Sentimiento Positivo' }
      ],
      description: 'Producción cinematográfica de spot comercial de alta gama y 18 piezas dinámicas para redes sociales con estética gamer y efectos visuales de vanguardia.',
      challenge: 'Crear piezas publicitarias que no parecieran anuncios tradicionales y que retuvieran la atención de la audiencia en los primeros 3 segundos.',
      solution: 'Dirección de arte inmersiva con render 3D, edición acelerada sincrónica con diseño de sonido de impacto y distribución segmentada en canales clave.'
    },
    'arena-activation': {
      title: 'Nexus Gaming Dome - Activación Gamificada',
      category: 'Gamificación · BTL & Experiencial',
      client: 'Feria Tecnológica & Gamer Fest',
      image: 'assets/images/activation-booth.jpg',
      stats: [
        { val: '38,000+', lbl: 'Participantes Registrados' },
        { val: '+8,500', lbl: 'Prospectos Captados' },
        { val: '24 PCs', lbl: 'Estaciones Gamer RTX' }
      ],
      description: 'Diseño y despliegue de una experiencia gamificada inmersiva con mecánicas de recompensas en vivo, minijuegos web para móviles y captación masiva de prospectos.',
      challenge: 'Destacar en un pabellón con más de 70 expositores y asegurar que la marca fuera el centro de conversación orgánica en redes sociales.',
      solution: 'Arquitectura sobria de alto impacto, leaderboard digital sincronizado en pantalla gigante y premios instantáneos entregados en escenario.'
    },
    'cup-champions': {
      title: 'Rebranding Digital & Approach Strategy',
      category: 'Branding Digital · Consultoría Estratégica',
      client: 'Federación Digital & Gaming',
      image: 'assets/images/champions-trophy.jpg',
      stats: [
        { val: '+340%', lbl: 'Crecimiento en Conversación' },
        { val: '64 Equipos', lbl: 'Organizaciones Cobertura' },
        { val: '+450K', lbl: 'Impactos en Redes' }
      ],
      description: 'Rediseño completo de la identidad visual digital y consultoría estratégica de desembarco cultural para una marca global en el ecosistema gaming de LATAM.',
      challenge: 'Ingresar a una comunidad exigente y escéptica de marcas tradicionales sin cometer errores de tono ni sonar artificial.',
      solution: 'Investigación antropológica de la comunidad, creación de un sistema de diseño dinámico para redes y alianzas orgánicas con líderes de opinión.'
    }
  };

  const modalBackdrop = document.getElementById('caseStudyModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const openModalButtons = document.querySelectorAll('.btn-case-modal');

  const openModal = (id) => {
    const data = caseStudies[id];
    if (!data || !modalBackdrop) return;

    document.getElementById('modalImage').src = data.image;
    document.getElementById('modalCategory').textContent = data.category;
    document.getElementById('modalClient').textContent = 'Cliente: ' + data.client;
    document.getElementById('modalTitle').textContent = data.title;
    document.getElementById('modalDesc').textContent = data.description;
    document.getElementById('modalChallenge').textContent = data.challenge;
    document.getElementById('modalSolution').textContent = data.solution;

    const statsContainer = document.getElementById('modalStats');
    statsContainer.innerHTML = '';
    data.stats.forEach(stat => {
      const col = document.createElement('div');
      col.className = 'modal-stat-col';
      col.innerHTML = `
        <div class="m-stat-val">${stat.val}</div>
        <div class="m-stat-lbl">${stat.lbl}</div>
      `;
      statsContainer.appendChild(col);
    });

    modalBackdrop.classList.add('active');
    modalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('active');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  openModalButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const studyId = btn.getAttribute('data-case');
      openModal(studyId);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) closeModal();
  });

  // 4. PORTFOLIO FILTER
  const filterTabs = document.querySelectorAll('.filter-tab');
  const caseItems = document.querySelectorAll('.case-item');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');
      caseItems.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat.includes(filter)) {
          item.style.display = item.classList.contains('feature') ? 'grid' : 'flex';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 20);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(10px)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // 5. METRICS COUNTER OBSERVER
  const statNumbers = document.querySelectorAll('.stat-count');
  let counted = false;

  const startCounters = () => {
    statNumbers.forEach(elem => {
      const target = parseInt(elem.getAttribute('data-target'), 10);
      const prefix = elem.getAttribute('data-prefix') || '';
      const suffix = elem.getAttribute('data-suffix') || '';
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 35));

      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          elem.textContent = prefix + target.toLocaleString() + suffix;
          clearInterval(timer);
        } else {
          elem.textContent = prefix + current.toLocaleString() + suffix;
        }
      }, 35);
    });
  };

  const statsSection = document.querySelector('.section-stats');
  if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !counted) {
          counted = true;
          startCounters();
        }
      });
    }, { threshold: 0.25 });
    observer.observe(statsSection);
  }

  // 6. SIMULADOR DE PROYECTO
  const calcState = {
    type: 'Branding Digital & Identidad',
    scale: 'Campaña Regional (LATAM)',
    stream: 'Ecosistema Multicanal 360°'
  };

  const pillButtons = document.querySelectorAll('.pill-btn');
  const summaryType = document.getElementById('summaryType');
  const summaryScale = document.getElementById('summaryScale');
  const summaryStream = document.getElementById('summaryStream');
  const summaryTier = document.getElementById('summaryTier');

  const updateCalculatorUI = () => {
    if (summaryType) summaryType.textContent = calcState.type;
    if (summaryScale) summaryScale.textContent = calcState.scale;
    if (summaryStream) summaryStream.textContent = calcState.stream;

    let tier = 'PAQUETE ESTRATEGIA & LANZAMIENTO';
    if (calcState.scale.includes('Regional') || calcState.stream.includes('360°')) {
      tier = 'PAQUETE INTEGRAL 360°';
    } else if (calcState.scale.includes('Anual') || calcState.scale.includes('Alianza')) {
      tier = 'ALIANZA ANUAL CONTINUA';
    }
    if (summaryTier) summaryTier.textContent = tier;
  };

  pillButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.getAttribute('data-group');
      const val = btn.getAttribute('data-val');

      document.querySelectorAll(`.pill-btn[data-group="${group}"]`).forEach(b => {
        b.classList.remove('selected');
      });
      btn.classList.add('selected');

      if (group === 'type') calcState.type = val;
      if (group === 'scale') calcState.scale = val;
      if (group === 'stream') calcState.stream = val;

      updateCalculatorUI();
    });
  });

  // Transferir a formulario
  const btnApply = document.getElementById('btnApplyEstimateToForm');
  if (btnApply) {
    btnApply.addEventListener('click', () => {
      const msgField = document.getElementById('contactMessage');
      const serviceSelect = document.getElementById('serviceSelect');

      if (serviceSelect) {
        if (calcState.type.includes('Branding')) serviceSelect.value = 'branding';
        else if (calcState.type.includes('Creatividad')) serviceSelect.value = 'creatividad';
        else if (calcState.type.includes('Marketing')) serviceSelect.value = 'marketing';
        else if (calcState.type.includes('Influencer')) serviceSelect.value = 'influencer';
        else if (calcState.type.includes('Streaming')) serviceSelect.value = 'streaming';
        else if (calcState.type.includes('Audiovisual')) serviceSelect.value = 'audiovisual';
        else if (calcState.type.includes('Gamificación')) serviceSelect.value = 'gamificacion';
        else if (calcState.type.includes('Approach')) serviceSelect.value = 'approach';
      }

      if (msgField) {
        msgField.value = `Hola equipo de CAOZ! Me gustaría cotizar un proyecto con las siguientes especificaciones:
- Disciplina Principal: ${calcState.type}
- Cobertura / Escala: ${calcState.scale}
- Canales de Distribución: ${calcState.stream}
- Configuración Sugerida: ${summaryTier ? summaryTier.textContent : 'PAQUETE INTEGRAL 360°'}`;
      }

      const contactSec = document.getElementById('contacto');
      if (contactSec) contactSec.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // 7. FORM SUBMISSION
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName').value;
      const email = document.getElementById('contactEmail').value;

      if (!name || !email) return;

      if (formSuccess) {
        formSuccess.style.display = 'block';
        formSuccess.innerHTML = `<strong>¡Solicitud enviada!</strong> Nos pondremos en contacto contigo en breve para preparar la propuesta.`;
      }
      contactForm.reset();
    });
  }

  // 8. CORPORATE PALETTE THEME SWITCHER
  const palettePicker = document.getElementById('palettePicker');
  const paletteBtn = document.getElementById('paletteBtn');
  const paletteLabel = document.getElementById('paletteLabel');
  const paletteOptions = document.querySelectorAll('.palette-option');

  const themes = {
    studio: 'Studio White',
    warm: 'Warm Minimalist',
    titanium: 'Titanium Light',
    obsidian: 'Obsidian Dark'
  };

  const setTheme = (theme) => {
    if (!themes[theme]) theme = 'studio';
    if (theme === 'studio') {
      document.body.removeAttribute('data-theme');
    } else {
      document.body.setAttribute('data-theme', theme);
    }
    localStorage.setItem('caoz_theme', theme);

    if (paletteLabel) {
      paletteLabel.textContent = themes[theme];
    }

    paletteOptions.forEach(opt => {
      opt.classList.toggle('active', opt.getAttribute('data-theme') === theme);
    });
  };

  // Default to studio white (clean professional light theme)
  let savedTheme = localStorage.getItem('caoz_theme');
  if (!savedTheme || savedTheme === 'obsidian' || !themes[savedTheme]) {
    savedTheme = 'studio';
  }
  setTheme(savedTheme);

  if (paletteBtn && palettePicker) {
    paletteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      palettePicker.classList.toggle('open');
    });

    paletteOptions.forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        const theme = opt.getAttribute('data-theme');
        setTheme(theme);
        palettePicker.classList.remove('open');
      });
    });

    document.addEventListener('click', (e) => {
      if (!palettePicker.contains(e.target)) {
        palettePicker.classList.remove('open');
      }
    });
  }
});
