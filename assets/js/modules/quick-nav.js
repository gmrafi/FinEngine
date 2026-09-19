// Cmd+K / Ctrl+K quick-jump palette across FinEngine pages and packages.
const QUICK_ENTRIES = [];

export function initQuickNav() {
  const button = document.querySelector("[data-quick-nav-toggle]");
  const overlay = document.createElement("div");
  overlay.className = "quicknav-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Quick navigation");
  overlay.innerHTML = `
    <div class="quicknav-panel">
      <div class="quicknav-input-row">
        <span class="quicknav-glyph" aria-hidden="true">⌘K</span>
        <input class="quicknav-input" data-quicknav-input type="text" placeholder="Search docs, packages, simulators…" autocomplete="off" spellcheck="false" />
        <button class="quicknav-close" type="button" data-quicknav-close aria-label="Close quick navigation">Esc</button>
      </div>
      <div class="quicknav-results" data-quicknav-results></div>
    </div>`;
  document.body.appendChild(overlay);

  const input = overlay.querySelector(".quicknav-input");
  const results = overlay.querySelector("[data-quicknav-results]");

  function buildEntries() {
    if (QUICK_ENTRIES.length) return QUICK_ENTRIES;
    const root = document.body?.dataset.rootPath || "";
    QUICK_ENTRIES.push(
      { label: "Home", group: "Pages", href: `${root}` },
      { label: "Product surface", group: "Pages", href: `${root}product/` },
      { label: "Simulation Lab", group: "Pages", href: `${root}simulation/` },
      { label: "Documentation Hub", group: "Pages", href: `${root}docs/` },
      { label: "Methodology", group: "Pages", href: `${root}methodology/` },
      { label: "Python SDK & Quant", group: "Pages", href: `${root}python/` },
      {
        label: "AI & Models Lab (Coming Soon)",
        group: "Pages",
        href: `${root}ai/`,
      },
      { label: "Contact", group: "Pages", href: `${root}contact/` },
      { label: "About", group: "Pages", href: `${root}about/` },
      {
        label: "@finengine/core",
        group: "Packages",
        href: `${root}docs/core/`,
      },
      {
        label: "@finengine/math",
        group: "Packages",
        href: `${root}docs/math/`,
      },
      { label: "@finengine/ui", group: "Packages", href: `${root}docs/ui/` },
      {
        label: "Python API (PyPI)",
        group: "Packages",
        href: `${root}python/#python-api`,
      },
      {
        label: "Examples gallery",
        group: "Packages",
        href: `${root}docs/examples/`,
      },
      {
        label: "Student Installment Simulator",
        group: "Simulators",
        href: `${root}simulation/#simulator-student`,
      },
      {
        label: "SME Working Capital Simulator",
        group: "Simulators",
        href: `${root}simulation/#simulator-sme`,
      },
      {
        label: "Merchant Restock Simulator",
        group: "Simulators",
        href: `${root}simulation/#simulator-merchant`,
      },
      {
        label: "Release v0.3.0",
        group: "Resources",
        href: "https://github.com/gmrafi/FinEngine/releases/tag/v0.3.0",
      },
      {
        label: "StackBlitz TypeScript Sandbox (1-Click)",
        group: "Cloud Sandboxes",
        href: "https://stackblitz.com/github/gmrafi/FinEngine?file=examples/quickstart.ts",
      },
      {
        label: "Google Colab Python Notebook (1-Click)",
        group: "Cloud Sandboxes",
        href: "https://colab.research.google.com/github/gmrafi/FinEngine/blob/main/examples/finengine_quickstart.ipynb",
      },
      {
        label: "jsDelivr & unpkg CDN Guides",
        group: "Cloud Sandboxes",
        href: `${root}docs/#cloud-sandboxes`,
      },
      {
        label: "Report an issue",
        group: "Resources",
        href: "https://github.com/gmrafi/FinEngine/issues/new/choose",
      },
      {
        label: "GitHub repository",
        group: "Resources",
        href: "https://github.com/gmrafi/FinEngine",
      },
    );
    return QUICK_ENTRIES;
  }

  function render(filter = "") {
    const q = filter.trim().toLowerCase();
    const entries = buildEntries().filter(
      (e) => !q || `${e.label} ${e.group}`.toLowerCase().includes(q),
    );
    if (!entries.length) {
      results.innerHTML = '<div class="quicknav-empty">No matches.</div>';
      return;
    }
    let group = "";
    results.innerHTML = entries
      .map((e) => {
        const g = `<div class="quicknav-group">${e.group}</div>`;
        const head = e.group !== group ? g : "";
        group = e.group;
        return `${head}<a class="quicknav-item" href="${e.href}" data-quicknav-item>${e.label}</a>`;
      })
      .join("");
  }

  function open() {
    overlay.classList.add("is-open");
    input.value = "";
    render("");
    input.focus();
  }
  function close() {
    overlay.classList.remove("is-open");
  }

  if (button) button.addEventListener("click", open);
  overlay
    .querySelector("[data-quicknav-close]")
    .addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  input.addEventListener("input", () => render(input.value));
  input.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      open();
    }
  });
}
