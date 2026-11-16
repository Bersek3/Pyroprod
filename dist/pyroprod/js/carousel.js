(() => {
  const carousel = document.querySelector('.process-carousel');
  if (!carousel) return;
  const track = carousel.querySelector('.process-carousel-track');
  const slides = [...carousel.querySelectorAll('.process-slide')];
  const previous = carousel.querySelector('[data-carousel-prev]');
  const next = carousel.querySelector('[data-carousel-next]');
  const dots = [...carousel.querySelectorAll('[data-carousel-index]')];
  const counter = carousel.querySelector('.process-carousel-count');
  const status = carousel.querySelector('.process-carousel-status');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let active = 0;
  let pending = null;
  let settled;

  function render(index, announce = false) {
    active = index;
    previous.disabled = index === 0;
    next.disabled = index === slides.length - 1;
    counter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    dots.forEach((dot, i) => {
      if (i === index) dot.setAttribute('aria-current', 'step');
      else dot.removeAttribute('aria-current');
    });
    if (announce) status.textContent = `${index + 1} de ${slides.length}: ${slides[index].querySelector('h3').textContent}`;
  }

  function go(index) {
    pending = Math.max(0, Math.min(slides.length - 1, index));
    render(pending, true);
    track.scrollTo({ left: slides[pending].offsetLeft, behavior: reduced.matches ? 'instant' : 'smooth' });
  }

  previous.addEventListener('click', () => go((pending ?? active) - 1));
  next.addEventListener('click', () => go((pending ?? active) + 1));
  dots.forEach((dot, index) => dot.addEventListener('click', () => go(index)));
  track.addEventListener('keydown', event => {
    if (event.target !== track) return;
    const index = pending ?? active;
    const destinations = { ArrowLeft: index - 1, ArrowRight: index + 1, Home: 0, End: slides.length - 1 };
    if (!(event.key in destinations)) return;
    event.preventDefault();
    go(destinations[event.key]);
  });
  track.addEventListener('pointerdown', () => { pending = null; }, { passive: true });
  track.addEventListener('scroll', () => {
    clearTimeout(settled);
    settled = setTimeout(() => {
      pending = null;
      const nearest = slides.reduce((best, slide, index) =>
        Math.abs(slide.offsetLeft - track.scrollLeft) < Math.abs(slides[best].offsetLeft - track.scrollLeft) ? index : best, 0);
      render(nearest, true);
    }, 140);
  }, { passive: true });
  const resize = new ResizeObserver(() => {
    track.scrollTo({ left: slides[active].offsetLeft, behavior: 'instant' });
  });
  resize.observe(track);
  carousel.querySelector('.process-carousel-controls').hidden = false;
  carousel.querySelector('.process-carousel-dots').hidden = false;
  render(0);
})();
