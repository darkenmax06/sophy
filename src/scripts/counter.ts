/**
 * Counter Animation
 * Extracted from original script.js - initCounter
 *
 * Observes all .counter elements. When visible, animates
 * from 0 to the data-target value over approximately 2 seconds.
 */

document.addEventListener('DOMContentLoaded', () => {
  const counters = document.querySelectorAll<HTMLElement>('.counter');

  if (counters.length === 0) return;

  function updateCount(counter: HTMLElement): void {
    const target = parseInt(counter.getAttribute('data-target') || '0', 10);
    const currentText = counter.textContent?.replace('+', '') || '0';
    const count = parseInt(currentText, 10);
    const duration = 2000;
    const steps = 60;
    const increment = Math.max(1, Math.ceil(target / steps));
    const delay = Math.floor(duration / (target / increment));

    if (count < target) {
      const nextCount = Math.min(target, count + increment);
      counter.textContent = String(nextCount);
      setTimeout(() => {
        updateCount(counter);
      }, delay);
    } else {
      counter.textContent = String(target);
    }
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const counter = entry.target as HTMLElement;
          updateCount(counter);
          observer.unobserve(counter);
        }
      });
    },
    {
      threshold: 0.5,
    }
  );

  counters.forEach((counter) => observer.observe(counter));
});
