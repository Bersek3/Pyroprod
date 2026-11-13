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
  window.matchMedia('(min-width: 851px)').addEventListener('change', closeMenu);
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
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
