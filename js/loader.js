(() => {
  const root = document.documentElement;
  const started = performance.now();
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const locked = [];
  let dismissed = false;
  let minimumTimer;
  root.classList.add('is-loading');

  function finish(immediate = false) {
    if (dismissed) return;
    dismissed = true;
    clearTimeout(deadline);
    clearTimeout(minimumTimer);
    const loader = document.getElementById('pageLoader');
    locked.forEach(element => { element.inert = false; });
    if (loader) loader.classList.add('is-leaving');
    const remove = () => {
      root.classList.remove('is-loading');
      if (loader) loader.remove();
    };
    if (immediate || reduced.matches) remove();
    else setTimeout(remove, 380);
  }

  // The overlay must never prevent access if an image or font fails to load.
  const deadline = setTimeout(() => finish(true), 5000);
  document.addEventListener('DOMContentLoaded', () => {
    if (dismissed) return;
    for (const element of document.body.children) {
      if (['SCRIPT', 'STYLE'].includes(element.tagName) || element.id === 'pageLoader' || element.inert) continue;
      element.inert = true;
      locked.push(element);
    }
  }, { once: true });
  window.addEventListener('load', () => {
    const wait = reduced.matches ? 0 : Math.max(0, 1000 - (performance.now() - started));
    minimumTimer = setTimeout(() => finish(), wait);
  }, { once: true });
  window.addEventListener('pageshow', event => {
    if (event.persisted) finish(true);
  });
})();
