const section = document.querySelector<HTMLElement>("[data-bento-masonry]");
const cards = Array.from(document.querySelectorAll<HTMLElement>("[data-bento-card]"));
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let ticking = false;
let active = false;

const reset = () => {
  cards.forEach((card) => card.style.removeProperty("--bento-y"));
};

const update = () => {
  ticking = false;

  if (!section || reducedMotion.matches || !active) {
    reset();
    return;
  }

  const rect = section.getBoundingClientRect();
  const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));

  cards.forEach((card) => {
    const speed = Number(card.dataset.speed ?? 0);
    const offset = (0.5 - progress) * speed;
    card.style.setProperty("--bento-y", `${offset.toFixed(2)}px`);
  });
};

const requestUpdate = () => {
  if (!ticking) {
    ticking = true;
    window.requestAnimationFrame(update);
  }
};

if (section && cards.length > 0 && !reducedMotion.matches) {
  const observer = new IntersectionObserver(([entry]) => {
    active = entry.isIntersecting;
    requestUpdate();
  });

  observer.observe(section);
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  reducedMotion.addEventListener("change", requestUpdate);
  requestUpdate();
}

export {};
