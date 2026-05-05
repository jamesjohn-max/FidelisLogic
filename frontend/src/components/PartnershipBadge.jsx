import { Award } from "lucide-react";

/**
 * Visual badge showing the type of partnership Fidelis Logic holds with a brand.
 *
 * Tone:
 *  - "Distribution Partner": premium tier — solid deep amber with subtle ring,
 *    leading award icon. Communicates highest commercial commitment.
 *  - "Channel Partner": authorized tier — clean white pill with slate border
 *    and a small amber leading dot. Refined, secondary, on-brand.
 *
 * Props:
 *  - type: "Distribution Partner" | "Channel Partner"
 *  - size: "xs" | "sm" | "md" (default "sm")
 */
export const PartnershipBadge = ({ type, size = "sm", className = "", testId }) => {
  if (!type) return null;

  const isDistribution = type === "Distribution Partner";

  const sizing =
    size === "xs"
      ? "text-[10px] px-2 py-0.5 gap-1"
      : size === "md"
      ? "text-xs px-3 py-1.5 gap-2"
      : "text-[11px] px-2.5 py-1 gap-1.5";

  if (isDistribution) {
    const iconSize = size === "md" ? "w-3.5 h-3.5" : "w-3 h-3";
    return (
      <span
        className={`inline-flex items-center font-semibold uppercase tracking-[0.08em] rounded-full bg-amber-600 text-white shadow-sm ring-1 ring-amber-700/20 ${sizing} ${className}`}
        data-testid={testId}
      >
        <Award className={iconSize} strokeWidth={2.25} />
        Distribution Partner
      </span>
    );
  }

  const dotSize = size === "md" ? "w-1.5 h-1.5" : "w-1 h-1";
  return (
    <span
      className={`inline-flex items-center font-semibold uppercase tracking-[0.08em] rounded-full bg-white text-slate-700 border border-slate-300 ${sizing} ${className}`}
      data-testid={testId}
    >
      <span className={`${dotSize} rounded-full bg-amber-500 shrink-0`} aria-hidden="true" />
      Channel Partner
    </span>
  );
};
