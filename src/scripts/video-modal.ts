/**
 * Video Modal
 * Converted from video_embedded.js
 *
 * Opens a modal overlay when elements with [data-video] (or .request-loader) are clicked.
 * Loads the YouTube iframe in #my-video-frame with autoplay.
 * Closes on .my-close click or clicking the overlay background.
 */

document.addEventListener('DOMContentLoaded', () => {
  const openModalButtons = document.querySelectorAll<HTMLElement>('.request-loader');
  const overlay = document.getElementById('modal-overlay');
  const closeModal = document.querySelector<HTMLElement>('.my-close');
  const videoFrame = document.getElementById('my-video-frame') as HTMLIFrameElement | null;

  if (!overlay || !videoFrame) return;

  openModalButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const videoUrl = btn.getAttribute('data-video');
      if (videoUrl) {
        videoFrame.src = videoUrl + '?autoplay=1';
        overlay.style.display = 'flex';
      }
    });
  });

  closeModal?.addEventListener('click', () => {
    overlay.style.display = 'none';
    videoFrame.src = '';
  });

  overlay.addEventListener('click', (e: MouseEvent) => {
    if (e.target === overlay) {
      overlay.style.display = 'none';
      videoFrame.src = '';
    }
  });
});
