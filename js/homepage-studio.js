/* A quiet code-to-design loop; only runs while its illustration is visible. */
(() => {
  'use strict';

  const studio = document.querySelector('[data-studio]');
  if (!studio) return;

  const care = document.querySelector('[data-care-animation]');
  const lineElements = Array.from(studio.querySelectorAll('[data-code-line]'));
  const lines = lineElements.map((element) => element.textContent);
  const codeLength = lines.reduce((sum, line) => sum + line.length, 0);
  const previewParts = Array.from(studio.querySelectorAll('[data-studio-part]'));
  const status = studio.querySelector('[data-studio-status]');
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const visible = new Map([[studio, false], ...(care ? [[care, false]] : [])]);
  const cycleDuration = 16000;
  const buildDuration = 4800;
  const reviewDuration = 4000;

  let elapsed = 0;
  let lastTick = 0;
  let timer = null;

  function render(completed = false) {
    const cycle = completed ? cycleDuration - 1 : elapsed % cycleDuration;
    const progress = Math.min(1, cycle / buildDuration);
    const phase = progress < 1 ? 'build' : cycle < buildDuration + reviewDuration ? 'review' : 'complete';
    studio.dataset.phase = phase;

    let characters = Math.floor(codeLength * progress);
    let activeLine = -1;
    lineElements.forEach((element, index) => {
      const count = Math.min(lines[index].length, Math.max(0, characters));
      const value = lines[index].slice(0, count);
      if (element.textContent !== value) element.textContent = value;
      if (characters >= 0 && characters < lines[index].length && phase === 'build') activeLine = index;
      characters -= lines[index].length;
    });
    lineElements.forEach((element, index) => {
      element.parentElement.classList.toggle('is-typing', index === activeLine);
    });

    previewParts.forEach((element) => {
      element.classList.toggle('is-revealed', progress >= Number(element.dataset.studioPart));
    });
    if (status) {
      const label = phase === 'build' ? 'Building with care' : phase === 'review' ? 'Refining the details' : 'Ready for real people';
      if (status.textContent !== label) status.textContent = label;
    }
  }

  function tick() {
    const now = performance.now();
    elapsed += now - lastTick;
    lastTick = now;
    render();
    timer = window.setTimeout(tick, 70);
  }

  function syncPlayback() {
    const allowed = !preference.matches && !document.hidden;
    const studioPlaying = allowed && visible.get(studio);
    studio.classList.toggle('is-playing', studioPlaying);
    if (care) care.classList.toggle('is-playing', allowed && visible.get(care));

    if (studioPlaying && timer === null) {
      lastTick = performance.now();
      timer = window.setTimeout(tick, 70);
    } else if (!studioPlaying && timer !== null) {
      window.clearTimeout(timer);
      timer = null;
    }

    if (preference.matches) render(true);
  }

  studio.classList.add('is-enhanced');
  render(preference.matches);

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => visible.set(entry.target, entry.isIntersecting));
      syncPlayback();
    }, { threshold: 0.15 });
    visible.forEach((value, element) => observer.observe(element));
  } else {
    visible.forEach((value, element) => visible.set(element, true));
  }

  document.addEventListener('visibilitychange', syncPlayback);
  const preferenceChanged = () => {
    if (!preference.matches) elapsed = 0;
    syncPlayback();
  };
  if (preference.addEventListener) preference.addEventListener('change', preferenceChanged);
  else preference.addListener(preferenceChanged);
  syncPlayback();
})();
