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
});
