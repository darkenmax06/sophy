/**
 * Banner Video - YouTube Background
 * Converted from script.js - initBannerVideo
 *
 * Loads the YouTube IFrame API, creates a player in #banner-video-background,
 * and handles autoplay, mute, loop, and responsive sizing.
 */

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: typeof YT;
  }
}

declare namespace YT {
  class Player {
    constructor(elementId: string, options: PlayerOptions);
    playVideo(): void;
    getIframe(): HTMLIFrameElement;
  }

  interface PlayerOptions {
    videoId: string;
    playerVars?: Record<string, string | number>;
    events?: {
      onReady?: (event: PlayerEvent) => void;
      onStateChange?: (event: PlayerEvent) => void;
    };
  }

  interface PlayerEvent {
    target: Player;
    data: number;
  }

  const PlayerState: {
    ENDED: number;
    PLAYING: number;
    PAUSED: number;
    BUFFERING: number;
    CUED: number;
  };
}

document.addEventListener('DOMContentLoaded', () => {
  const videoContainer = document.getElementById('banner-video-background');
  if (!videoContainer) return;

  let player: YT.Player;

  // Load the YouTube IFrame API script
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  const firstScript = document.getElementsByTagName('script')[0];
  firstScript.parentNode?.insertBefore(tag, firstScript);

  window.onYouTubeIframeAPIReady = function () {
    player = new YT.Player('banner-video-background', {
      videoId: 'P68V3iH4TeE',
      playerVars: {
        autoplay: 1,
        controls: 0,
        mute: 1,
        loop: 1,
        playlist: 'Ps-0f0K6izM',
        showinfo: 0,
        rel: 0,
        enablejsapi: 1,
        disablekb: 1,
        modestbranding: 1,
        iv_load_policy: 3,
        origin: window.location.origin,
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
      },
    });
  };

  function onPlayerReady(event: YT.PlayerEvent): void {
    event.target.playVideo();
    setYoutubeSize();
    window.addEventListener('resize', setYoutubeSize);
  }

  function onPlayerStateChange(event: YT.PlayerEvent): void {
    if (event.data === YT.PlayerState.ENDED) {
      player.playVideo();
    }
  }

  function setYoutubeSize(): void {
    const container = document.querySelector<HTMLElement>('.banner-video-container');
    if (!container) return;

    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    const aspectRatio = 16 / 9;
    let newWidth: number;
    let newHeight: number;

    if (containerWidth / containerHeight > aspectRatio) {
      newWidth = containerWidth;
      newHeight = containerWidth / aspectRatio;
    } else {
      newWidth = containerHeight * aspectRatio;
      newHeight = containerHeight;
    }

    if (player && player.getIframe) {
      const iframe = player.getIframe();
      iframe.width = String(newWidth);
      iframe.height = String(newHeight);
    }
  }

  // Handle YouTube postMessage errors silently
  window.addEventListener('message', (event: MessageEvent) => {
    if (event.origin !== 'https://www.youtube.com') return;
    try {
      JSON.parse(event.data);
    } catch {
      // Silently ignore parse errors from YouTube messages
    }
  });
});
