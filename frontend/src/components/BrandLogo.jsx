import { useState } from "react";

/**
 * Renders a brand's logo inside a fixed-dimension container so every brand
 * occupies the same visual footprint, no matter the underlying image's
 * aspect ratio. The image is centred and scaled with `object-contain`.
 *
 * Multi-source fallback chain:
 *   1. Try each candidate src in `brand.logoImages` (in order)
 *   2. If all images fail, render the wordmark text (`brand.logoText`)
 *      styled in the brand accent colour, sized to fit the same box.
 *
 * Sizes (width × height, ~2:1 ratio so wordmarks have room to breathe):
 *  - sm:  80 × 40 px   (compact strips)
 *  - md:  128 × 64 px  (grid cards)
 *  - lg:  160 × 80 px  (featured cards)
 *  - xl:  224 × 112 px (brand detail hero)
 */
const sizeByVariant = {
  sm: { box: "w-20 h-10", text: "text-sm" },
  md: { box: "w-32 h-16", text: "text-xl" },
  lg: { box: "w-40 h-20", text: "text-2xl" },
  xl: { box: "w-56 h-28", text: "text-4xl sm:text-5xl" },
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
  const { box, text } = sizeByVariant[size];

  const wrapperClass = `inline-flex items-center justify-center shrink-0 ${box} ${className}`;

  if (!allFailed && sources.length > 0) {
    return (
      <div className={wrapperClass} data-testid={testId}>
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
          className="max-w-full max-h-full w-auto h-auto object-contain"
        />
      </div>
    );
  }

  return (
    <div className={wrapperClass} data-testid={testId}>
      <span
        className={`font-bold tracking-tight ${text} truncate`}
        style={{ color: brand.accentColor }}
      >
        {brand.logoText}
      </span>
    </div>
  );
};
