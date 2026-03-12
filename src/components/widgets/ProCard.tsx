import React from "react";
import { Sparkline } from "./Sparkline";

type Props = {
  title: string;
  subtitle: string;
  accent: string;
  chartValues?: number[];
};

export const ProCard: React.FC<Props> = ({
  title,
  subtitle,
  accent,
  chartValues
}) => {
  return (
    <article className="ios-card p-3 flex flex-col justify-between bg-gradient-to-br from-yellow-100 via-amber-50 to-orange-100">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] text-slate-600 font-medium">{title}</span>
      </div>
      {accent && <p className="text-xs text-slate-600 mb-1">{accent}</p>}
      {chartValues && chartValues.length > 1 ? (
        <div className="-mx-1">
          <Sparkline values={chartValues} />
          <div className="flex items-center justify-between text-[10px] text-slate-600 mt-1 px-1">
            <span>Now</span>
            <span>+24h</span>
          </div>
        </div>
      ) : null}
      <p className="text-[11px] text-slate-800 font-medium mt-2">{subtitle}</p>
    </article>
  );
};

