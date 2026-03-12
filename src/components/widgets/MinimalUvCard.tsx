import React from "react";

type Props = {
  value: number;
};

export const MinimalUvCard: React.FC<Props> = ({ value }) => {
  return (
    <article className="ios-card col-span-2 flex flex-col justify-between p-4 bg-gradient-to-br from-pink-100 via-purple-50 to-pink-200">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="ios-pill text-[10px] bg-slate-900 text-white/90">
              Minimal UV
            </span>
          </div>
          <p className="text-xs text-slate-600">
            Low UV, you are safe to enjoy the sun today.
          </p>
        </div>
        <div className="text-right">
          <div className="text-5xl font-semibold leading-none text-slate-900">{value}</div>
        </div>
      </div>
    </article>
  );
};

