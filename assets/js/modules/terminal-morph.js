const TAB_FILES = {
  shell: "quickstart.sh",
  js: "quickstart.mjs",
  cdn: "./",
};

export function initTerminalMorph() {
  const tabs = Array.from(document.querySelectorAll("[data-hero-tab]"));
  const panes = Array.from(document.querySelectorAll("[data-hero-pane]"));
  const fileLabel = document.querySelector(".hero-terminal-file");
  if (!tabs.length || !panes.length) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  function assignLineDelays(pane) {
    const children = Array.from(
      pane.querySelectorAll(".hero-terminal-pre code > *"),
    );
    children.forEach((el, idx) => {
      el.style.setProperty("--line-delay", `${Math.min(idx * 0.03, 0.22)}s`);
    });
  }

  panes.forEach(assignLineDelays);

  function switchTab(targetKey) {
    const targetPane = panes.find((p) => p.dataset.heroPane === targetKey);
    const targetTab = tabs.find((t) => t.dataset.heroTab === targetKey);
    if (!targetPane || !targetTab) return;

    // Update active tab buttons immediately
    tabs.forEach((t) => {
      const active = t === targetTab;
      t.classList.toggle("is-active", active);
      t.setAttribute("aria-selected", String(active));
    });

    // Update terminal filename in the titlebar
    if (fileLabel && TAB_FILES[targetKey]) {
      fileLabel.textContent = TAB_FILES[targetKey];
    }

    // Hide all other panes and deactivate them
    panes.forEach((p) => {
      if (p !== targetPane) {
        p.classList.remove("is-active", "is-typing");
        p.hidden = true;
      }
    });

    // Unhide and activate the target pane
    targetPane.hidden = false;
    void targetPane.offsetHeight;
    targetPane.classList.add("is-active");

    // Remove any leftover cursor
    const existingCursor = targetPane.querySelector(".hero-terminal-cursor");
    if (existingCursor) existingCursor.remove();

    if (prefersReduced.matches) {
      targetPane.classList.add("is-typing");
      return;
    }

    // Snappy, non-blocking typing stagger
    targetPane.classList.add("is-typing");

    // Append blinking cursor to code block
    const cursor = document.createElement("span");
    cursor.className = "hero-terminal-cursor";
    cursor.setAttribute("aria-hidden", "true");
    cursor.style.animation = "cursor-blink 1s step-end infinite";
    const codeEl = targetPane.querySelector(".hero-terminal-pre code");
    if (codeEl) codeEl.appendChild(cursor);
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", (e) => {
      e.preventDefault();
      const targetKey = tab.dataset.heroTab;
      switchTab(targetKey);
    });
  });

  // Ensure initial active tab has cursor and correct file name
  const activeTab =
    tabs.find((t) => t.classList.contains("is-active")) || tabs[0];
  if (activeTab) {
    const initialKey = activeTab.dataset.heroTab;
    if (fileLabel && TAB_FILES[initialKey]) {
      fileLabel.textContent = TAB_FILES[initialKey];
    }
    const initialPane = panes.find((p) => p.dataset.heroPane === initialKey);
    if (initialPane) {
      initialPane.classList.add("is-active", "is-typing");
      const codeEl = initialPane.querySelector(".hero-terminal-pre code");
      if (codeEl && !initialPane.querySelector(".hero-terminal-cursor")) {
        const cursor = document.createElement("span");
        cursor.className = "hero-terminal-cursor";
        cursor.setAttribute("aria-hidden", "true");
        cursor.style.animation = "cursor-blink 1s step-end infinite";
        codeEl.appendChild(cursor);
      }
    }
  }
}
