export function initTerminalPill() {
  const tabsContainer = document.querySelector(".hero-terminal-tabs");
  if (!tabsContainer) return;
  const tabs = tabsContainer.querySelectorAll(".hero-terminal-tab");
  if (!tabs.length) return;

  const pill = document.createElement("div");
  pill.className = "hero-terminal-pill";
  pill.setAttribute("aria-hidden", "true");
  tabsContainer.appendChild(pill);

  function positionPill(activeTab) {
    if (!activeTab) return;
    const tabRect = activeTab.getBoundingClientRect();
    const containerRect = tabsContainer.getBoundingClientRect();
    pill.style.left = `${tabRect.left - containerRect.left}px`;
    pill.style.width = `${tabRect.width}px`;
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      positionPill(tab);
    });
  });

  requestAnimationFrame(() => {
    const activeTab = tabsContainer.querySelector(
      ".hero-terminal-tab.is-active",
    );
    if (activeTab) {
      setTimeout(() => positionPill(activeTab), 500);
    }
  });

  window.addEventListener("resize", () => {
    const activeTab = tabsContainer.querySelector(
      ".hero-terminal-tab.is-active",
    );
    if (activeTab) positionPill(activeTab);
  });
}
