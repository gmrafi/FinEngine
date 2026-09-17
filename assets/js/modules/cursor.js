/**
 * High-Precision Mathematical Micro-Tracker & Mobile Touch Ripple
 * Provides a lightweight, GPU-accelerated cursor follower for desktop
 * and an ambient precision ripple effect for touch devices.
 */

export function initPrecisionCursor() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const hasFinePointer = window.matchMedia("(pointer: fine)").matches;

  // Touch micro-ripple handler for mobile and tablet
  function handleTouch(e) {
    if (e.pointerType && e.pointerType !== "touch") return;
    const clientX =
      e.clientX ?? (e.touches && e.touches[0] ? e.touches[0].clientX : null);
    const clientY =
      e.clientY ?? (e.touches && e.touches[0] ? e.touches[0].clientY : null);
    if (clientX == null || clientY == null) return;

    const ripple = document.createElement("div");
    ripple.className = "touch-micro-ripple";
    ripple.style.left = `${clientX}px`;
    ripple.style.top = `${clientY}px`;
    document.body.appendChild(ripple);

    window.setTimeout(() => {
      ripple.remove();
    }, 400);
  }

  window.addEventListener("touchstart", handleTouch, { passive: true });
  window.addEventListener("pointerdown", handleTouch, { passive: true });

  // Desktop Micro-Tracker Elements
  const ring = document.createElement("div");
  ring.className = "precision-cursor-ring";
  ring.setAttribute("aria-hidden", "true");

  const dot = document.createElement("div");
  dot.className = "precision-cursor-dot";
  dot.setAttribute("aria-hidden", "true");

  document.body.appendChild(ring);
  document.body.appendChild(dot);

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;
  let dotX = -100;
  let dotY = -100;
  let isHoveringInteractive = false;
  let isMouseDown = false;
  let isVisible = false;
  let rafId = null;

  function onMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isVisible) {
      isVisible = true;
      ring.style.opacity = "1";
      dot.style.opacity = "1";
      ringX = mouseX;
      ringY = mouseY;
      dotX = mouseX;
      dotY = mouseY;
    }

    if (!rafId) {
      rafId = requestAnimationFrame(render);
    }
  }

  function onMouseDown() {
    isMouseDown = true;
    ring.classList.add("is-clicked");
  }

  function onMouseUp() {
    isMouseDown = false;
    ring.classList.remove("is-clicked");
  }

  function onMouseLeave() {
    isVisible = false;
    ring.style.opacity = "0";
    dot.style.opacity = "0";
  }

  function onMouseEnter() {
    isVisible = true;
    ring.style.opacity = "1";
    dot.style.opacity = "1";
  }

  // Interactive element hover tracking
  document.addEventListener(
    "mouseover",
    (e) => {
      const target = e.target.closest(
        "a, button, input, select, textarea, [data-hero-tab], [data-playground-preset], .bento-card, .sim-chip",
      );
      if (target) {
        isHoveringInteractive = true;
        ring.classList.add("is-hovering");
      } else {
        isHoveringInteractive = false;
        ring.classList.remove("is-hovering");
      }
    },
    { passive: true },
  );

  function render() {
    if (!isVisible) {
      rafId = null;
      return;
    }

    // Smooth physics lerp
    const ringSpeed = isHoveringInteractive ? 0.28 : 0.22;
    ringX += (mouseX - ringX) * ringSpeed;
    ringY += (mouseY - ringY) * ringSpeed;

    dotX += (mouseX - dotX) * 0.75;
    dotY += (mouseY - dotY) * 0.75;

    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) scale(${isMouseDown ? 0.8 : isHoveringInteractive ? 1.45 : 1})`;
    dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;

    // Keep running RAF loop when moving
    const dist = Math.hypot(mouseX - ringX, mouseY - ringY);
    if (dist > 0.1 || isMouseDown || isHoveringInteractive) {
      rafId = requestAnimationFrame(render);
    } else {
      rafId = null;
    }
  }

  document.addEventListener("mousemove", onMouseMove, { passive: true });
  document.addEventListener("mousedown", onMouseDown, { passive: true });
  document.addEventListener("mouseup", onMouseUp, { passive: true });
  document.documentElement.addEventListener("mouseleave", onMouseLeave);
  document.documentElement.addEventListener("mouseenter", onMouseEnter);
}
