/**
 * Theme Toggle (Light/Dark Mode)
 * Extracted from original script.js - initThemeSwitch
 */

document.addEventListener('DOMContentLoaded', () => {
  const themeSwitch = document.getElementById('themeSwitch');
  const themeIcon = document.getElementById('themeIcon');

  if (!themeSwitch || !themeIcon) return;

  // Check current state set by the inline script in BaseLayout
  const isLightMode = (): boolean => document.body.classList.contains('lightmode');

  // Set initial icon
  if (isLightMode()) {
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
  } else {
    themeIcon.classList.remove('fa-sun');
    themeIcon.classList.add('fa-moon');
  }

  /**
   * Update all logos based on the current theme.
   * - .site-logo: swap between logo.png and logo-dark.png
   * - .partner-logo: swap between normal and -dark variants
   */
  function updateLogos(): void {
    const siteLogos = document.querySelectorAll<HTMLImageElement>('.site-logo');
    const partnerLogos = document.querySelectorAll<HTMLImageElement>('.partner-logo');

    if (isLightMode()) {
      siteLogos.forEach((img) => {
        img.src = img.src.replace('logo.png', 'logo-dark.png');
      });

      partnerLogos.forEach((img) => {
        if (!img.src.includes('-dark')) {
          img.src = img.src.replace('.png', '-dark.png');
        }
      });
    } else {
      siteLogos.forEach((img) => {
        img.src = img.src.replace('logo-dark.png', 'logo.png');
      });

      partnerLogos.forEach((img) => {
        img.src = img.src.replace('-dark.png', '.png');
      });
    }
  }

  // Initial logo update
  updateLogos();

  // Observe DOM changes so dynamically added logos also get updated
  const observer = new MutationObserver(() => {
    updateLogos();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Toggle theme on click
  themeSwitch.addEventListener('click', () => {
    document.body.classList.toggle('lightmode');

    if (isLightMode()) {
      localStorage.setItem('lightmode', 'active');
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
    } else {
      localStorage.removeItem('lightmode');
      themeIcon.classList.remove('fa-sun');
      themeIcon.classList.add('fa-moon');
    }

    updateLogos();
  });
});
