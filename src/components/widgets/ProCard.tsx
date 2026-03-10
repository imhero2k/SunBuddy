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
    <article className="ios-card p-3 flex flex-col justify-between bg-accent-yellow/70">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] text-slate-500">{title}</span>
      </div>
      <p className="text-xs text-slate-500 mb-1">{accent}</p>
      {chartValues && chartValues.length > 1 ? (
        <div className="-mx-1">
          <Sparkline values={chartValues} />
          <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1 px-1">
            <span>Now</span>
            <span>+24h</span>
          </div>
        </div>
      ) : null}
      <p className="text-[11px] text-slate-700">{subtitle}</p>
    </article>
  );
};

