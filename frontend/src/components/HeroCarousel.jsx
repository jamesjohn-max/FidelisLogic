import { useEffect, useState } from "react";

/**
 * Full-bleed background image carousel for hero sections.
 *
 * Behaviour:
 *  - Cross-fades between images with a slow easing (low-distraction).
 *  - Auto-advances every `interval` ms (default 6s).
 *  - Honours prefers-reduced-motion: shows the first image only.
 *  - Pauses when the tab is hidden to avoid wasted work.
 *
 * Layout:
 *  - Positioned absolutely to fill its parent (`absolute inset-0`).
 *  - The parent MUST be `relative` and clip overflow.
 *  - Images use `object-cover` so they always fill the hero.
 *  - Decorative only: rendered with `aria-hidden` and empty alt.
 *
 * Props:
 *  - images: string[]                      // ordered image URLs
 *  - interval?: number                     // ms between slide changes (default 6000)
 *  - transitionMs?: number                 // fade duration (default 1200)
 *  - className?: string                    // appended to the wrapper
 *  - testId?: string                       // data-testid on the wrapper
 */
export const HeroCarousel = ({
  images = [],
  interval = 6000,
  transitionMs = 1200,
  className = "",
  testId,
}) => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let timerId;
    const tick = () => {
      setActive((i) => (i + 1) % images.length);
    };
    const start = () => {
      timerId = setInterval(tick, interval);
    };
    const stop = () => {
      if (timerId) clearInterval(timerId);
      timerId = undefined;
    };

    start();

    // Pause when tab is hidden, resume on focus
    const onVisibility = () => {
      if (document.hidden) {
        stop();
      } else {
        stop();
        start();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [images, interval]);

  if (!images || images.length === 0) return null;

  return (
    <div
      className={`absolute inset-0 z-0 ${className}`}
      aria-hidden="true"
      data-testid={testId}
    >
      {images.map((src, idx) => (
        <img
          key={`${src}-${idx}`}
          src={src}
          alt=""
          loading={idx === 0 ? "eager" : "lazy"}
          fetchpriority={idx === 0 ? "high" : "auto"}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: idx === active ? 1 : 0,
            transition: `opacity ${transitionMs}ms ease-in-out`,
            willChange: "opacity",
          }}
        />
      ))}
    </div>
  );
};
