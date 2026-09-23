'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Video koji se pušta tek na klik.
 *
 * Preko snimka stoji krug s trouglom. Klik pušta video i krug nestaje; klik
 * na sam video ga zaustavlja i krug se vraća. Kad se korak zatvori (drugi
 * mjesec postane otvoren), video staje — inače bi mu zvuk išao iz zatvorene
 * kartice.
 *
 * `preload="none"`: dok niko ne klikne, ne skida se ništa osim postera.
 */
export default function SeasonVideo({
  src,
  poster,
  label,
  labels,
  active,
}: {
  src: string;
  poster: string;
  label: string;
  labels: { play: string; pause: string };
  active: boolean;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!active) video.current?.pause();
  }, [active]);

  const toggle = () => {
    const el = video.current;
    if (!el) return;
    if (el.paused) void el.play();
    else el.pause();
  };

  return (
    <div className="pe-video" data-playing={playing}>
      <video
        ref={video}
        className="pe-video__el"
        src={src}
        poster={poster}
        playsInline
        preload="none"
        aria-label={label}
        onClick={toggle}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />
      <button
        type="button"
        className="pe-video__play"
        aria-label={`${playing ? labels.pause : labels.play}: ${label}`}
        onClick={toggle}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M8.5 5.6v12.8a.6.6 0 0 0 .92.5l10.1-6.4a.6.6 0 0 0 0-1L9.42 5.1a.6.6 0 0 0-.92.5Z" />
        </svg>
      </button>
    </div>
  );
}
