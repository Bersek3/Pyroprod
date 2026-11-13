// Progressive enhancement: content stays visible if motion is unsupported.
(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = window.matchMedia('(min-width: 769px)');
  const targets = document.querySelectorAll('.section-intro, .section-statement .split > div, .offering, .cinematic-project, .process-step, .founders > article, .interlude-copy, .closing .container');
  const animations = new Set();
  let observer;
  if (!reduced.matches && 'IntersectionObserver' in window && Element.prototype.animate) {
    observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target;
        observer.unobserve(el);
        el.classList.remove('reveal-pending');
        const siblings = [...el.parentElement.children];
        const stagger = el.matches('.offering, .cinematic-project, .process-step') ? Math.min(siblings.indexOf(el), 3) * 60 : 0;
        const animation = el.animate(
          [{ opacity: 0, transform: 'translateY(22px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 700, delay: stagger, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' }
        );
        animations.add(animation);
        animation.onfinish = () => animations.delete(animation);
      }
    }, { threshold: 0, rootMargin: '0px 0px -32px 0px' });
    targets.forEach(el => { el.classList.add('reveal-pending'); observer.observe(el); });
  }

  const photos = [...document.querySelectorAll('[data-parallax]')];
  const story = document.querySelector('.scroll-story');
  const storyPhotos = story ? [...story.querySelectorAll('[data-scene-photo]')] : [];
  const storyScenes = story ? [...story.querySelectorAll('[data-scene]')] : [];
  const storyProgress = story ? [...story.querySelectorAll('[data-scene-progress]')] : [];
  const header = document.querySelector('.site-header');
  let storyEnabled = false;
  const clamp = value => Math.max(0, Math.min(1, value));

  function configureStory() {
    if (!story) return;
    storyEnabled = !reduced.matches && desktop.matches && CSS.supports('position', 'sticky');
    story.classList.toggle('is-scroll-linked', storyEnabled);
    story.style.setProperty('--story-top', `${header ? header.offsetHeight : 0}px`);
    if (!storyEnabled) {
      storyPhotos.forEach(photo => { photo.style.opacity = ''; photo.style.transform = ''; });
      storyProgress.forEach(bar => { bar.style.transform = ''; });
    }
  }

  function drawStory() {
    if (!story || !storyEnabled) return;
    const rect = story.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > innerHeight) return;
    const top = header ? header.offsetHeight : 0;
    const height = story.querySelector('.scroll-story-stage').getBoundingClientRect().height;
    if (!height) return;
    const distance = Math.max(0, top - rect.top);
    let progress = storyPhotos.length - 1;
    for (let index = 0; index < storyScenes.length - 1; index++) {
      const start = storyScenes[index].offsetTop;
      const end = storyScenes[index + 1].offsetTop;
      if (distance < end) {
        progress = index + clamp((distance - start) / Math.max(1, end - start));
        break;
      }
    }
    storyPhotos.forEach((photo, index) => {
      // Keep the first photo opaque beneath the next one to prevent dark flashes.
      const mix = index === 0 ? 1 : clamp((progress - index + .65) / .65);
      const smoothMix = mix * mix * (3 - 2 * mix);
      photo.style.opacity = String(smoothMix);
      const travel = clamp(progress - index + 1);
      photo.style.transform = `scale(${(1.02 + travel * .025).toFixed(4)})`;
    });
    storyProgress.forEach((bar, index) => {
      bar.style.transform = `scaleX(${clamp(progress - index + 1).toFixed(4)})`;
    });
  }

  let frame = 0;
  function draw() {
    frame = 0;
    drawStory();
    for (const photo of photos) {
      if (reduced.matches || !desktop.matches) { photo.style.transform = ''; continue; }
      const rect = photo.parentElement.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > innerHeight) continue;
      const offset = (innerHeight / 2 - rect.top - rect.height / 2) * Number(photo.dataset.parallax);
      const limit = rect.height * .065;
      photo.style.transform = `translate3d(0,${Math.max(-limit, Math.min(limit, offset)).toFixed(2)}px,0)`;
    }
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(draw); }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', () => { configureStory(); schedule(); }, { passive: true });
  desktop.addEventListener('change', () => { configureStory(); schedule(); });
  reduced.addEventListener('change', () => {
    if (reduced.matches) {
      if (observer) observer.disconnect();
      targets.forEach(el => el.classList.remove('reveal-pending'));
      animations.forEach(animation => animation.cancel());
      animations.clear();
    }
    configureStory();
    schedule();
  });
  configureStory();
  schedule();
})();
