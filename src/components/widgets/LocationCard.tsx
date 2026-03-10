import React from "react";

export const LocationCard: React.FC = () => {
  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs text-slate-500">Location</span>
        <button className="text-[11px] text-slate-500 underline-offset-2 underline">
          Change
        </button>
      </div>
      <article className="ios-card h-40 flex items-center justify-center bg-slate-100/80">
        <span className="text-xs text-slate-400">Map placeholder</span>
      </article>
    </section>
  );
};

