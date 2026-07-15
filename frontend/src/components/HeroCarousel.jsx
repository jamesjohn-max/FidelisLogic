import { useEffect, useRef, useState } from "react";

/**
 * Full-bleed background image carousel for hero sections.
 *
 * Behaviour:
 *  - Cross-fades between images with a slow easing (low-distraction).
 *  - Auto-advances every `interval` ms (default 6s).
 *  - Optional dot navigation lets users jump to any slide; clicking a dot
 *    resets the auto-advance timer.
 *  - Honours prefers-reduced-motion: shows the first image only.
 *  - Pauses when the tab is hidden to avoid wasted work.
 *
 * Layout:
 *  - Image stack positioned absolutely to fill the parent (`absolute inset-0`).
 *  - The parent MUST be `relative` and clip overflow.
 *  - Decorative image stack: `aria-hidden`, empty alt.
 *  - Dots render as an accessible <nav> in a subtle glass pill.
 */
export const HeroCarousel = ({
  images = [],
  interval = 6000,
  transitionMs = 1200,
  showDots = true,
  className = "",
  testId,
}) => {
  const [active, setActive] = useState(0);
  const timerRef = useRef(null);

  const shouldAutoplay = () => {
    if (!images || images.length <= 1) return false;
    if (
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return false;
    }
    return true;
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startTimer = () => {
    stopTimer();
    if (!shouldAutoplay()) return;
    timerRef.current = setInterval(() => {
      setActive((i) => (i + 1) % images.length);
    }, interval);
  };

  useEffect(() => {
    startTimer();
    const onVisibility = () => {
      if (document.hidden) {
        stopTimer();
      } else {
        startTimer();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stopTimer();
      document.removeEventListener("visibilitychange", onVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images, interval]);

  const goTo = (idx) => {
    if (idx === active) return;
    setActive(idx);
    startTimer(); // reset auto-rotate so the next change is a full interval away
  };

  if (!images || images.length === 0) return null;

  return (
    <>
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

      {showDots && images.length > 1 && (
        <nav
          className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/15 shadow-lg"
          aria-label="Hero carousel navigation"
          data-testid={testId ? `${testId}-dots` : "hero-carousel-dots"}
        >
          {images.map((_, idx) => {
            const isActive = idx === active;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => goTo(idx)}
                aria-label={`Show slide ${idx + 1} of ${images.length}`}
                aria-current={isActive ? "true" : "false"}
                className={`h-2 rounded-full transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-white/70 focus:ring-offset-2 focus:ring-offset-black/30 ${
                  isActive
                    ? "w-8 bg-white"
                    : "w-2 bg-white/45 hover:bg-white/75"
                }`}
                data-testid={testId ? `${testId}-dot-${idx}` : `hero-carousel-dot-${idx}`}
              />
            );
          })}
        </nav>
      )}
    </>
  );
};
