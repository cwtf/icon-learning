const section = document.querySelector<HTMLElement>("[data-courses-tabbed]");
const labels = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-course-label]"));
const panels = Array.from(document.querySelectorAll<HTMLElement>("[data-course-panel]"));

const setActive = (id: string) => {
  labels.forEach((label) => {
    const active = label.dataset.target === id;
    label.classList.toggle("is-active", active);
    label.setAttribute("aria-current", active ? "true" : "false");
    label.setAttribute("aria-selected", active ? "true" : "false");
  });

  panels.forEach((panel) => {
    panel.toggleAttribute("hidden", panel.id !== id);
  });
};

if (section && labels.length > 0 && panels.length > 0) {
  section.dataset.enhanced = "true";
  setActive(panels[0].id);

  labels.forEach((label) => {
    label.addEventListener("click", () => {
      const targetId = label.dataset.target;
      const target = targetId ? document.getElementById(targetId) : null;

      if (!target) return;

      setActive(target.id);
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
      const nextLabel = labels[nextIndex];
      const targetId = nextLabel.dataset.target;

      if (targetId) {
        setActive(targetId);
        nextLabel.focus();
      }
    });
  });
}

export {};
