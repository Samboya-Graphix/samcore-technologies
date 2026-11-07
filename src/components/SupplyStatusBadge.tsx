import React from "react";
import {
  CheckCircle2,
  ShieldCheck,
  Clock,
  Calendar,
  XCircle,
} from "lucide-react";
import { Product } from "@/lib/types";
import { getSupplyBadgeConfig } from "@/lib/utils";

interface SupplyStatusBadgeProps {
  product: Product;
  showSublabel?: boolean;
  size?: "sm" | "md";
}

export function SupplyStatusBadge({
  product,
  showSublabel = false,
  size = "sm",
}: SupplyStatusBadgeProps) {
  const cfg = getSupplyBadgeConfig(product);

  const IconComponent = {
    check: CheckCircle2,
    shield: ShieldCheck,
    clock: Clock,
    calendar: Calendar,
    x: XCircle,
  }[cfg.iconType];

  const borderStyleClass = {
    solid: "border-solid",
    dashed: "border-dashed",
    double: "border-double border-2",
    dotted: "border-dotted border-2",
  }[cfg.borderStyle];

  return (
    <div className="inline-flex flex-col gap-1">
      <span
        className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-wider font-semibold border border-black ${borderStyleClass} ${
          cfg.isInverted
            ? "bg-black text-white"
            : `bg-white text-black ${cfg.patternClass}`
        } ${
          size === "sm"
            ? "px-2.5 py-1 text-[11px] leading-none"
            : "px-3 py-1.5 text-xs leading-none"
        } rounded-sm`}
      >
        <IconComponent className={size === "sm" ? "w-3.5 h-3.5 shrink-0" : "w-4 h-4 shrink-0"} />
        <span>{cfg.label}</span>
      </span>
      {showSublabel && (
        <span className="text-xs text-black/70 font-medium">{cfg.sublabel}</span>
      )}
    </div>
  );
}
