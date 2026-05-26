import { useState } from "react";

/**
 * Renders a brand's logo with a multi-source fallback chain:
 *   1. Try each candidate src in `brand.logoImages` (in order)
 *   2. If all images fail to load, fall back to the wordmark text
 *      (`brand.logoText`) styled in the brand accent colour
 *
 * Backward-compatible: also accepts a single `brand.logoImage` string.
 *
 * Sizes:
 *  - sm:  ~24px tall  (compact strips)
 *  - md:  ~32px tall  (grid cards)
 *  - lg:  ~40px tall  (featured cards)
 *  - xl:  ~64px tall  (brand detail hero)
 */
const heightByVariant = {
  sm: "h-6",
  md: "h-8",
  lg: "h-10",
  xl: "h-16",
};

const fallbackTextSize = {
  sm: "text-base",
  md: "text-xl",
  lg: "text-2xl",
  xl: "text-5xl sm:text-6xl",
};

const resolveSources = (brand) => {
  if (Array.isArray(brand.logoImages) && brand.logoImages.length > 0) {
    return brand.logoImages.filter(Boolean);
  }
  if (brand.logoImage) return [brand.logoImage];
  return [];
};

export const BrandLogo = ({ brand, size = "md", className = "", testId }) => {
  const sources = resolveSources(brand);
  const [index, setIndex] = useState(0);
  const [allFailed, setAllFailed] = useState(sources.length === 0);

  if (!allFailed && sources.length > 0) {
    return (
      <img
        key={sources[index]}
        src={sources[index]}
        alt={`${brand.name} logo`}
        loading="lazy"
        onError={() => {
          if (index + 1 < sources.length) {
            setIndex(index + 1);
          } else {
            setAllFailed(true);
          }
        }}
        className={`${heightByVariant[size]} w-auto object-contain ${className}`}
        data-testid={testId}
      />
    );
  }

  return (
    <span
      className={`font-bold tracking-tight ${fallbackTextSize[size]} ${className}`}
      style={{ color: brand.accentColor }}
      data-testid={testId}
    >
      {brand.logoText}
    </span>
  );
};
