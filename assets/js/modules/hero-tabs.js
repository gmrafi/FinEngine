// Handles copy buttons inside the flagship homepage terminal card
export function initHeroTabs() {
  document.querySelectorAll("[data-hero-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.copyTarget;
      const code = document.getElementById(id);
      if (!code) return;
      const text = code.innerText.replace(/\n{3,}/g, "\n\n").trimEnd();
      const restore = btn.textContent;
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
      btn.textContent = "Copied! ✓";
      btn.classList.add("is-copied");
      setTimeout(() => {
        btn.textContent = restore;
        btn.classList.remove("is-copied");
      }, 1100);
    });
  });
}
