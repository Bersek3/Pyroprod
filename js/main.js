document.addEventListener('DOMContentLoaded', () => {
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


  const main = document.getElementById('main');
  const header = document.getElementById('siteHeader');
  const footer = document.querySelector('.site-footer');
  const toggle = document.getElementById('mobileToggle');
  const menu = document.getElementById('mobileNav');
  const backdrop = document.getElementById('mobileBackdrop');
  const modal = document.getElementById('caseStudyModal');
  const closeButton = document.getElementById('modalCloseBtn');
  let modalTrigger = null;
  const backgroundInert = (value) => { main.inert = value; footer.inert = value; };
  const closeMenu = (restoreFocus = false) => {
    menu.classList.remove('open');
    backdrop.classList.remove('open');
    menu.inert = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
    backgroundInert(false);
    document.body.style.overflow = '';
    if (restoreFocus) toggle.focus();
  };
  toggle.addEventListener('click', () => {
    if (menu.classList.contains('open')) return closeMenu(true);
    menu.inert = false;
    menu.classList.add('open');
    backdrop.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Cerrar menú');
    backgroundInert(true);
    document.body.style.overflow = 'hidden';
    menu.querySelector('a').focus();
  });
  backdrop.addEventListener('click', () => closeMenu(true));
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    closeMenu();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) { target.tabIndex = -1; target.focus({ preventScroll: true }); }
  }));
  matchMedia('(min-width: 1281px)').addEventListener('change', event => {
    if (event.matches && menu.classList.contains('open')) closeMenu();
  });
  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    modal.inert = true;
    header.inert = false;
    backgroundInert(false);
    document.body.style.overflow = '';
    if (modalTrigger) modalTrigger.focus();
  };
  modal.inert = true;
  document.querySelectorAll('.btn-case-modal').forEach(button => {
    button.addEventListener('click', () => {
      const project = caseStudies[button.dataset.case];
      if (!project) return;
      modalTrigger = button;
      const image = document.getElementById('modalImage');
      image.src = project.image;
      image.alt = project.title;
      const fields = { modalCategory: project.category, modalClient: 'Cliente: ' + project.client, modalTitle: project.title, modalDesc: project.description, modalChallenge: project.challenge, modalSolution: project.solution };
      Object.entries(fields).forEach(([id, value]) => { document.getElementById(id).textContent = value; });
      const stats = document.getElementById('modalStats');
      stats.replaceChildren(...project.stats.map(stat => {
        const col = document.createElement('div');
        col.className = 'modal-stat-col';
        const value = document.createElement('div'); value.className = 'm-stat-val'; value.textContent = stat.val;
        const label = document.createElement('div'); label.className = 'm-stat-lbl'; label.textContent = stat.lbl;
        col.append(value, label); return col;
      }));
      modal.inert = false;
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      backgroundInert(true); header.inert = true;
      document.body.style.overflow = 'hidden';
      modal.querySelector('.modal-dialog').scrollTop = 0;
      closeButton.focus();
    });
  });
  closeButton.addEventListener('click', closeModal);
  modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });
  document.addEventListener('keydown', event => {
    const modalOpen = modal.classList.contains('active');
    const menuOpen = menu.classList.contains('open');
    if (event.key === 'Escape') {
      if (modalOpen) closeModal();
      else if (menuOpen) closeMenu(true);
    }
    if (event.key !== 'Tab' || (!modalOpen && !menuOpen)) return;
    const focusables = modalOpen ? [...modal.querySelectorAll('button, a[href], [tabindex="0"]')] : [toggle, ...menu.querySelectorAll('a[href]')];
    const first = focusables[0], last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  const filters = [...document.querySelectorAll('.filter-tab')];
  const items = [...document.querySelectorAll('.case-item')];
  filters.forEach(button => {
    button.setAttribute('aria-pressed', String(button.classList.contains('active')));
    button.addEventListener('click', () => {
      filters.forEach(filter => {
        const selected = filter === button;
        filter.classList.toggle('active', selected);
        filter.setAttribute('aria-pressed', String(selected));
      });
      const selected = button.dataset.filter.split(/\s+/);
      let count = 0;
      items.forEach(item => {
        const categories = item.dataset.category.split(/\s+/);
        item.hidden = button.dataset.filter !== 'all' && !selected.some(category => categories.includes(category));
        if (!item.hidden) count++;
      });
      document.querySelectorAll('.project-group').forEach(group => {
        group.hidden = ![...group.querySelectorAll('.case-item')].some(item => !item.hidden);
      });
      document.getElementById('filterStatus').textContent = count + (count === 1 ? ' proyecto disponible' : ' proyectos disponibles');
    });
  });
  const links = [...document.querySelectorAll('.nav-link')];
  const sections = links.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(link => {
          const active = link.getAttribute('href') === '#' + entry.target.id;
          link.classList.toggle('active', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-15% 0px -65% 0px', threshold: 0 });
    sections.forEach(section => observer.observe(section));
  }
});
