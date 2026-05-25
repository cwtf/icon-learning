const section = document.querySelector<HTMLElement>("[data-courses-tabbed]");
const labelList = section?.querySelector<HTMLElement>(".course-label-list");
const labels = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-course-label]"));
const panels = Array.from(document.querySelectorAll<HTMLElement>("[data-course-panel]"));
const desktopTabs = window.matchMedia("(min-width: 1024px)");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const panelTransitionMs = 540;
const scrollHold = 0.64;

const hideTimers = new WeakMap<HTMLElement, number>();

const clearHideTimer = (panel: HTMLElement) => {
  const timer = hideTimers.get(panel);

  if (timer) {
    window.clearTimeout(timer);
    hideTimers.delete(panel);
  }
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const easeOut = (value: number) => 1 - Math.pow(1 - value, 3);

const setLabelActivity = (visualIndex: number) => {
  labels.forEach((label, index) => {
    const activity = clamp(1 - Math.abs(index - visualIndex), 0, 1);
    const shift = easeOut(activity);

    label.style.setProperty("--label-activity", activity.toFixed(3));
    label.style.setProperty("--label-shift", shift.toFixed(3));
  });
};

const updateActiveIndicator = () => {
  if (!labelList || !desktopTabs.matches) return;

  const activeLabel = labels.find((label) => label.classList.contains("is-active"));

  if (!activeLabel) return;

  labelList.style.setProperty("--active-y", `${activeLabel.offsetTop}px`);
  labelList.style.setProperty("--active-height", `${activeLabel.offsetHeight}px`);
  setLabelActivity(Math.max(0, labels.indexOf(activeLabel)));
};

const updateScrollMotion = (visualIndex: number) => {
  if (!labelList || !desktopTabs.matches || reducedMotion.matches) {
    setLabelActivity(activeIndex());
    return;
  }

  const lowerIndex = Math.floor(visualIndex);
  const upperIndex = Math.min(labels.length - 1, lowerIndex + 1);
  const mix = visualIndex - lowerIndex;
  const lowerLabel = labels[lowerIndex];
  const upperLabel = labels[upperIndex];

  if (!lowerLabel || !upperLabel) return;

  const y = lowerLabel.offsetTop + (upperLabel.offsetTop - lowerLabel.offsetTop) * mix;
  const height = lowerLabel.offsetHeight + (upperLabel.offsetHeight - lowerLabel.offsetHeight) * mix;

  labelList.style.setProperty("--active-y", `${y.toFixed(2)}px`);
  labelList.style.setProperty("--active-height", `${height.toFixed(2)}px`);
  setLabelActivity(visualIndex);
};

const setActive = (id: string, immediate = false, updateIndicator = true) => {
  const nextPanel = panels.find((panel) => panel.id === id);
  const currentPanel = panels.find((panel) => panel.classList.contains("is-active"));

  if (!nextPanel || currentPanel === nextPanel) return;

  const nextIndex = panels.indexOf(nextPanel);

  labelList?.style.setProperty("--active-index", String(Math.max(0, nextIndex)));

  labels.forEach((label) => {
    const active = label.dataset.target === id;
    label.classList.toggle("is-active", active);
    label.setAttribute("aria-current", active ? "true" : "false");
    label.setAttribute("aria-selected", active ? "true" : "false");
  });

  panels.forEach(clearHideTimer);

  if (immediate || !currentPanel || !desktopTabs.matches || reducedMotion.matches) {
    panels.forEach((panel) => {
      const active = panel === nextPanel;

      panel.toggleAttribute("hidden", !active);
      panel.classList.toggle("is-active", active);
      panel.classList.remove("is-exiting");
      panel.setAttribute("aria-hidden", active ? "false" : "true");
      panel.toggleAttribute("inert", !active);
    });

    if (updateIndicator) {
      window.requestAnimationFrame(updateActiveIndicator);
      window.setTimeout(updateActiveIndicator, 280);
    }
    return;
  }

  currentPanel.classList.remove("is-active");
  currentPanel.classList.add("is-exiting");
  currentPanel.setAttribute("aria-hidden", "true");
  currentPanel.setAttribute("inert", "");

  hideTimers.set(
    currentPanel,
    window.setTimeout(() => {
      currentPanel.hidden = true;
      currentPanel.classList.remove("is-exiting");
      hideTimers.delete(currentPanel);
    }, panelTransitionMs),
  );

  nextPanel.hidden = false;
  nextPanel.classList.remove("is-exiting");
  nextPanel.setAttribute("aria-hidden", "false");
  nextPanel.removeAttribute("inert");

  window.requestAnimationFrame(() => {
    nextPanel.classList.add("is-active");
    if (updateIndicator) {
      updateActiveIndicator();
      window.setTimeout(updateActiveIndicator, 280);
    }
  });
};

const activeIndex = () => labels.findIndex((label) => label.classList.contains("is-active"));

const setActiveByIndex = (index: number, focus = false, syncScroll = false, updateIndicator = true) => {
  const nextLabel = labels[index];
  const targetId = nextLabel?.dataset.target;

  if (!targetId) return;

  setActive(targetId, false, updateIndicator);

  if (focus) {
    nextLabel.focus();
  }

  if (syncScroll && desktopTabs.matches && section && section.dataset.enhanced) {
    const rect = section.getBoundingClientRect();
    const absoluteTop = window.scrollY + rect.top;
    const maxScroll = rect.height - window.innerHeight;
    const segmentCount = Math.max(1, labels.length - 1);
    const targetScroll = absoluteTop + maxScroll * (index / segmentCount) + (index === labels.length - 1 ? -10 : 10);
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  }
};

const onScroll = () => {
  if (!section || !desktopTabs.matches || !section.dataset.enhanced) return;

  const rect = section.getBoundingClientRect();
  const maxScroll = rect.height - window.innerHeight;

  if (maxScroll <= 0) return;

  const progress = clamp(-rect.top / maxScroll, 0, 1);
  const rawIndex = progress * (labels.length - 1);
  const baseIndex = clamp(Math.floor(rawIndex), 0, labels.length - 1);
  const segmentProgress = baseIndex === labels.length - 1 ? 0 : rawIndex - baseIndex;
  const transitionProgress = segmentProgress <= scrollHold ? 0 : clamp((segmentProgress - scrollHold) / (1 - scrollHold), 0, 1);
  const visualIndex = baseIndex + easeOut(transitionProgress);
  const index = transitionProgress > 0.56 ? Math.min(baseIndex + 1, labels.length - 1) : baseIndex;

  updateScrollMotion(visualIndex);

  if (activeIndex() !== index) {
    setActiveByIndex(index, false, false, false);
  }
};

if (section && labels.length > 0 && panels.length > 0) {
  section.dataset.enhanced = "true";
  setActive(panels[0].id, true);

  labels.forEach((label) => {
    label.addEventListener("click", () => {
      const index = labels.indexOf(label);
      if (index >= 0) {
        setActiveByIndex(index, false, true);
      }
    });

    label.addEventListener("keydown", (event) => {
      const currentIndex = labels.indexOf(label);
      const lastIndex = labels.length - 1;
      const nextIndex =
        event.key === "ArrowRight" || event.key === "ArrowDown"
          ? (currentIndex + 1) % labels.length
          : event.key === "ArrowLeft" || event.key === "ArrowUp"
            ? (currentIndex - 1 + labels.length) % labels.length
            : event.key === "Home"
              ? 0
              : event.key === "End"
                ? lastIndex
                : -1;

      if (nextIndex < 0) return;

      event.preventDefault();
      setActiveByIndex(nextIndex, true, true);
    });
  });

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => {
    onScroll();
    updateActiveIndicator();
  }, { passive: true });
  desktopTabs.addEventListener("change", updateActiveIndicator);
  
  // Initial check in case it loaded scrolled down
  onScroll();
  updateActiveIndicator();
}

export {};
