import React from "react";

type Props = {
  value: number;
};

export const MinimalUvCard: React.FC<Props> = ({ value }) => {
  return (
    <article className="ios-card col-span-2 flex flex-col justify-between p-4 bg-accent-pink/60">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="ios-pill text-[10px] bg-slate-900 text-white/90">
              Minimal UV
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Low UV, you are safe to enjoy the sun today.
          </p>
        </div>
        <div className="text-right">
          <div className="text-5xl font-semibold leading-none">{value}</div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500">
        <span>H: 0° L: 0°</span>
        <span>Today</span>
      </div>
    </article>
  );
};

