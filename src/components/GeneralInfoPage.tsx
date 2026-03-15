import React from "react";

export const GeneralInfoPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs tracking-wide text-slate-500 uppercase">
          General information
        </p>
        <h1 className="text-xl font-semibold text-slate-900 mt-1">
          Skin cancer context & trends
        </h1>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl">
          Australia has one of the world&apos;s highest rates of skin cancer. Sun
          protection and early detection remain central public health messages.
        </p>
      </div>

      <article className="ios-card p-4 md:p-5">
        <h2 className="text-sm font-semibold text-slate-900">
          Historical skin cancer trends (graph)
        </h2>
        <div
          className="mt-4 flex min-h-[220px] items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/80"
          aria-hidden="true"
        >
          <span className="text-sm font-medium text-slate-400 tracking-wide">
            Placeholder — graph goes here
          </span>
        </div>
      </article>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <article className="ios-card p-4 md:p-5">
          <h2 className="text-sm font-semibold text-slate-900">
            Why it matters
          </h2>
          <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
            Skin cancer is one of the most common cancer groups in Australia. Most
            cases are linked to UV exposure over a lifetime—so everyday choices in
            the sun add up.
          </p>
          <ul className="mt-3 space-y-2 text-[11px] text-slate-600 list-disc list-inside leading-relaxed">
            <li>
              <strong className="text-slate-800">Scale</strong> — Very large numbers
              of people are treated for skin cancer each year, which affects
              individuals, families, and health systems.
            </li>
            <li>
              <strong className="text-slate-800">UV is preventable</strong> — You
              can&apos;t change past sunburns, but you can reduce UV from here on:
              shade, clothing, hats, sunglasses, and sunscreen when UV is moderate
              or high.
            </li>
            <li>
              <strong className="text-slate-800">Melanoma &amp; other skin cancers</strong>{" "}
              — Melanoma is serious; keratinocyte cancers (e.g. basal and squamous
              cell) are even more common. Both are strongly tied to sun damage.
            </li>
            <li>
              <strong className="text-slate-800">Early detection</strong> — New,
              changing, or non-healing spots are worth a clinical check; earlier
              treatment usually means better outcomes.
            </li>
          </ul>
        </article>
        <article className="ios-card p-4">
          <h2 className="text-sm font-semibold text-slate-900">
            What you can do
          </h2>
          <ul className="mt-2 space-y-2 text-[11px] text-slate-600 list-disc list-inside">
            <li>Slip, slop, slap, seek, slide—especially when UV is 3+.</li>
            <li>Check your skin; see a doctor for new or changing spots.</li>
            <li>Use SunBuddy&apos;s dashboard and personalisation as reminders, not a
              substitute for clinical care.</li>
          </ul>
        </article>
      </div>

      <article className="ios-card p-4 md:p-5">
        <h2 className="text-sm font-semibold text-slate-900">
          Authoritative sources
        </h2>
        <div
          className="mt-4 flex min-h-[120px] items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/80"
          aria-hidden="true"
        >
          <span className="text-sm font-medium text-slate-400 tracking-wide">
            Placeholder — sources go here
          </span>
        </div>
        <p className="text-[10px] text-slate-400 mt-3">
          SunBuddy does not provide medical advice. For diagnosis or treatment, see
          a qualified health professional.
        </p>
      </article>
    </div>
  );
};
