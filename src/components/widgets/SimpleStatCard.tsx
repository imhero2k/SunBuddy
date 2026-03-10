import React from "react";

type Variant = "cloud" | "burn" | "sunscreen";

type Props = {
  title: string;
  value: string;
  variant: Variant;
};

const variantAccent: Record<Variant, string> = {
  cloud: "☁️",
  burn: "🔥",
  sunscreen: "🧴"
};

export const SimpleStatCard: React.FC<Props> = ({ title, value, variant }) => {
  return (
    <article className="ios-card p-3 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-slate-500">{title}</span>
        <span className="text-base">{variantAccent[variant]}</span>
      </div>
      <p className="text-sm font-semibold text-slate-800">{value}</p>
    </article>
  );
};

