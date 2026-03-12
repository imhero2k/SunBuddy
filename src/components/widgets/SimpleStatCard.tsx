import React from "react";

type Variant = "cloud" | "burn" | "sunscreen";

type Props = {
  title: string;
  value: string;
  subtitle?: string;
  variant: Variant;
};

const variantAccent: Record<Variant, string> = {
  cloud: "☁️",
  burn: "🔥",
  sunscreen: "🧴"
};

const variantGradient: Record<Variant, string> = {
  cloud: "from-blue-50 to-sky-100",
  burn: "from-orange-50 to-red-100",
  sunscreen: "from-yellow-50 to-amber-100"
};

export const SimpleStatCard: React.FC<Props> = ({ title, value, subtitle, variant }) => {
  // Special handling for sunscreen to make SPF more prominent
  const isSunscreen = variant === "sunscreen";
  
  return (
    <article className={`ios-card p-3 flex flex-col justify-between bg-gradient-to-br ${variantGradient[variant]}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-slate-600 font-medium">{title}</span>
        <span className="text-base">{variantAccent[variant]}</span>
      </div>
      <div>
        {isSunscreen ? (
          <>
            <p className="text-lg font-bold text-slate-900">{value}</p>
            {subtitle && (
              <p className="text-xs text-slate-600 mt-1.5 font-medium">{subtitle}</p>
            )}
          </>
        ) : (
          <>
            <p className="text-sm font-semibold text-slate-800">{value}</p>
            {subtitle && (
              <p className="text-xs text-slate-600 mt-1">{subtitle}</p>
            )}
          </>
        )}
      </div>
    </article>
  );
};

