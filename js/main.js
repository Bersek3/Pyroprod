document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('mobileToggle');
  const navigation = document.getElementById('navigation');
  function closeMenu() {
    navigation.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = 'Menú +';
  }
  toggle.addEventListener('click', () => {
    const open = navigation.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Cerrar ×' : 'Menú +';
  });
  navigation.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && navigation.classList.contains('open')) {
      closeMenu();
      toggle.focus();
    }
  });
  window.matchMedia('(min-width: 1351px)').addEventListener('change', closeMenu);
  // Animate the native disclosure without moving the toggle off its center.
  document.querySelectorAll('.offering-details').forEach(details => {
    const summary = details.querySelector('summary');
    let animation;
    let expanded = details.open;
    summary.addEventListener('click', event => {
      if (!details.animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      event.preventDefault();
      const startHeight = details.getBoundingClientRect().height;
      if (animation) animation.cancel();
      expanded = !expanded;
      details.open = true;
      details.dataset.expanded = String(expanded);
      const endHeight = expanded ? details.getBoundingClientRect().height : summary.getBoundingClientRect().height;
      details.style.overflow = 'hidden';
      animation = details.animate(
        [{ height: startHeight + 'px' }, { height: endHeight + 'px' }],
        { duration: 280, easing: 'cubic-bezier(.22,1,.36,1)' }
      );
      animation.onfinish = () => {
        details.open = expanded;
        details.style.overflow = '';
        delete details.dataset.expanded;
        animation = null;
      };
    });
    details.addEventListener('toggle', () => {
      if (!animation) expanded = details.open;
    });
  });
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  document.querySelectorAll('.offering-link[data-service]').forEach(link => {
    link.addEventListener('click', () => {
      const option = Array.from(form.querySelectorAll('[name="servicios"]'))
        .find(input => input.value === link.dataset.service);
      if (option) option.checked = true;
    });
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(form);
    const services = data.getAll('servicios');
    if (!services.length) {
      status.textContent = 'Selecciona al menos un servicio para tu solicitud.';
      form.querySelector('[name="servicios"]').focus();
      return;
    }
    const body = [
      'Nombre: ' + data.get('nombre'),
      'Empresa o marca: ' + (data.get('empresa') || 'Sin especificar'),
      'Correo: ' + data.get('correo'),
      'Teléfono: ' + (data.get('telefono') || 'Sin especificar'),
      'País: ' + data.get('pais'),
      'Servicios: ' + services.join(', '),
      '', 'Proyecto:', data.get('proyecto')
    ].join('\r\n');
    const subject = 'Solicitud de proyecto · ' + data.get('nombre');
    window.location.href = 'mailto:contacto@pyroprod.cl?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    status.textContent = 'Solicitud preparada. Completa el envío desde tu aplicación de correo. Si no se abre, escríbenos a contacto@pyroprod.cl.';
  });

  const eventsContainer = document.getElementById('arenaEvents');
  if (eventsContainer) {
    const labels = { in_progress: 'EN JUEGO', check_in: 'CHECK-IN ABIERTO', registration_open: 'INSCRIPCIONES ABIERTAS' };
    const fallbackImage = 'assets/images/champions-trophy.jpg';
    const formatDate = value => new Intl.DateTimeFormat('es-CL', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
    const showMessage = message => { eventsContainer.replaceChildren(Object.assign(document.createElement('p'), { className: 'arena-events-message', textContent: message })); };
    const createCard = event => {
      const article = Object.assign(document.createElement('article'), { className: 'case-item cinematic-project arena-event-card' });
      const link = Object.assign(document.createElement('a'), { className: 'arena-event-link', href: `/tournament/${encodeURIComponent(event.slug)}`, 'aria-label': `Ver torneo ${event.title}` });
      const media = Object.assign(document.createElement('div'), { className: 'case-media' });
      const image = Object.assign(document.createElement('img'), { src: event.bannerUrl || fallbackImage, alt: '', loading: 'lazy', decoding: 'async' });
      image.addEventListener('error', () => { image.src = fallbackImage; }, { once: true });
      media.append(image, Object.assign(document.createElement('div'), { className: 'project-image-shade' }));
      media.append(Object.assign(document.createElement('span'), { className: 'project-image-label', textContent: labels[event.status] || 'CZ ARENA' }));
      media.append(Object.assign(document.createElement('h4'), { className: 'case-title', textContent: event.title }));
      const info = Object.assign(document.createElement('div'), { className: 'case-info' });
      info.append(Object.assign(document.createElement('p'), { className: 'case-meta', textContent: `${event.gameName} · ${formatDate(event.startDate)}` }));
      info.append(Object.assign(document.createElement('p'), { className: 'case-summary', textContent: `Cupos: ${event.participantCount} de ${event.maxParticipants} · Inscripción: ${event.entryFee} · Premio: ${event.prizePool}` }));
      link.append(media, info); article.append(link); return article;
    };
    fetch('/api/public/tournaments', { headers: { Accept: 'application/json' } })
      .then(response => response.ok ? response.json() : Promise.reject())
      .then(({ tournaments }) => {
        if (!Array.isArray(tournaments) || !tournaments.length) return showMessage('No hay torneos activos en este momento. Pronto habrá nuevas fechas.');
        eventsContainer.replaceChildren(...tournaments.map(createCard));
      })
      .catch(() => showMessage('No pudimos cargar los eventos ahora. Visita CZ Arena para ver el calendario.'));
  }
});
