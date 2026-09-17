export function initPackageExplorer() {
  const buttons = Array.from(document.querySelectorAll("[data-package-tab]"));
  const panels = Array.from(document.querySelectorAll("[data-package-panel]"));
  const search = document.querySelector("[data-package-search]");
  if (!buttons.length || !panels.length) return;

  const activate = (name) => {
    buttons.forEach((button) => {
      const active = button.dataset.packageTab === name;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", String(active));
    });
    panels.forEach((panel) => {
      panel.hidden = panel.dataset.packagePanel !== name;
    });
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => activate(button.dataset.packageTab));
  });
  activate(buttons[0].dataset.packageTab);

  search?.addEventListener("input", () => {
    const q = search.value.trim().toLowerCase();
    document.querySelectorAll("[data-package-card]").forEach((card) => {
      const haystack =
        (card.dataset.keywords || "") + " " + card.textContent.toLowerCase();
      card.hidden = q.length > 0 && !haystack.includes(q);
    });
  });

  document.querySelectorAll("[data-accordion-trigger]").forEach((button) => {
    button.addEventListener("click", () => {
      const panel = button.nextElementSibling;
      const open = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!open));
      panel.hidden = open;
    });
  });
}
