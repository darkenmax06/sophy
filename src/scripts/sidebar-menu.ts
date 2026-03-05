/**
 * Sidebar Menu
 * Extracted from original script.js - initSidebar, initEditSidebar, initSidebarDropdown
 */

document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initEditSidebar();
  initSidebarDropdown();
});

/**
 * Main sidebar: open on .nav-btn click, close on .close-btn or .sidebar-overlay click.
 */
function initSidebar(): void {
  const menuBtn = document.querySelector<HTMLElement>('.nav-btn');
  const closeBtn = document.querySelector<HTMLElement>('.close-btn');
  const overlay = document.querySelector<HTMLElement>('.sidebar-overlay');
  const sidebar = document.querySelector<HTMLElement>('.sidebar');

  if (!sidebar) return;

  menuBtn?.addEventListener('click', () => {
    overlay?.classList.add('active');
    setTimeout(() => {
      sidebar.classList.add('active');
    }, 200);
  });

  closeBtn?.addEventListener('click', () => {
    sidebar.classList.remove('active');
    setTimeout(() => {
      overlay?.classList.remove('active');
    }, 200);
  });

  overlay?.addEventListener('click', () => {
    sidebar.classList.remove('active');
    setTimeout(() => {
      overlay.classList.remove('active');
    }, 200);
  });
}

/**
 * Content-edit sidebar: open on .content-edit click, close on .close-btn-second click.
 */
function initEditSidebar(): void {
  const contentBtn = document.querySelector<HTMLElement>('.content-edit');
  const closeBtn = document.querySelector<HTMLElement>('.close-btn-second');
  const overlay = document.querySelector<HTMLElement>('.content-overlay');
  const sidebar = document.querySelector<HTMLElement>('.content-edit-sidebar');

  if (!sidebar) return;

  contentBtn?.addEventListener('click', () => {
    sidebar.classList.add('active');
    setTimeout(() => {
      overlay?.classList.add('active');
    }, 200);
  });

  closeBtn?.addEventListener('click', () => {
    sidebar.classList.remove('active');
    setTimeout(() => {
      overlay?.classList.remove('active');
    }, 200);
  });
}

/**
 * Sidebar dropdown: toggle .sidebar-dropdown-menu on .sidebar-dropdown-btn click.
 * Only one dropdown is open at a time.
 */
function initSidebarDropdown(): void {
  const dropdownButtons = document.querySelectorAll<HTMLElement>('.sidebar-dropdown-btn');

  dropdownButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const parent = btn.parentElement;
      const dropdownMenu = parent?.nextElementSibling as HTMLElement | null;

      if (!dropdownMenu || !dropdownMenu.classList.contains('sidebar-dropdown-menu')) return;

      const isOpen = dropdownMenu.classList.contains('active');

      // Close all other dropdown menus
      document.querySelectorAll<HTMLElement>('.sidebar-dropdown-menu').forEach((menu) => {
        if (menu !== dropdownMenu) {
          menu.classList.remove('active');
        }
      });

      // Toggle the clicked dropdown
      dropdownMenu.classList.toggle('active', !isOpen);
    });
  });
}
