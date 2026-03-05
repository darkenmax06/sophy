/**
 * Scroll Animations
 * Extracted from original script.js - initAnimateData
 *
 * Observes all elements with [data-animate] attribute.
 * When they enter the viewport, the CSS animation class is applied
 * and opacity is set to 1. Supports optional data-delay (ms).
 */

document.addEventListener('DOMContentLoaded', () => {
  const elements = document.querySelectorAll<HTMLElement>('[data-animate]');

  if (elements.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          const animationClass = el.getAttribute('data-animate');
          const delay = parseInt(el.getAttribute('data-delay') || '0', 10);

          setTimeout(() => {
            if (animationClass) {
              el.classList.add(animationClass);
            }
            el.style.opacity = '1';
            observer.unobserve(el);
          }, delay);
        }
      });
    },
    {
      threshold: 0.1,
    }
  );

  elements.forEach((el) => observer.observe(el));
});
