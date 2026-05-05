import { Award, Handshake } from "lucide-react";

/**
 * Visual badge showing the type of partnership Fidelis Logic holds with a brand.
 * - "Distribution Partner": premium amber tone, signaling deepest commercial tier.
 * - "Channel Partner": neutral slate tone for authorized channel relationships.
 *
 * Props:
 *  - type: "Distribution Partner" | "Channel Partner"
 *  - size: "xs" | "sm" | "md" (default "sm")
 */
export const PartnershipBadge = ({ type, size = "sm", className = "", testId }) => {
  if (!type) return null;

  const isDistribution = type === "Distribution Partner";
  const Icon = isDistribution ? Award : Handshake;

  const palette = isDistribution
    ? "bg-amber-50 text-amber-800 border-amber-200"
    : "bg-slate-100 text-slate-700 border-slate-200";

  const sizing =
    size === "xs"
      ? "text-[10px] px-2 py-0.5 gap-1"
      : size === "md"
      ? "text-sm px-3 py-1 gap-1.5"
      : "text-xs px-2.5 py-1 gap-1.5";

  const iconSize = size === "md" ? "w-3.5 h-3.5" : size === "xs" ? "w-3 h-3" : "w-3 h-3";

  return (
    <span
      className={`inline-flex items-center font-semibold uppercase tracking-wider rounded-full border ${palette} ${sizing} ${className}`}
      data-testid={testId}
    >
      <Icon className={iconSize} />
      {type}
    </span>
  );
};
