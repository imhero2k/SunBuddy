import React from "react";
import {
  ACTIVITIES,
  CLOTHING_COVERAGE_OPTIONS,
  FITZPATRICK_TYPES,
  HOURS_BANDS,
  SENSITIVITY_ITEMS,
  type ActivityId,
  type ClothingCoverageId,
  type FitzpatrickTypeId,
  type HoursBand
} from "./data";
import { buildRecommendations, estimateRiskTier, estimateSunscreenAmount } from "./engine";
import { useLocalStorageState } from "./useLocalStorageState";

type Props = {
  currentUv: number;
  peakUvNext24h?: number | null;
};

type Prefs = {
  skinType: FitzpatrickTypeId | null;
  sensitivityItemIds: string[];
  activities: Record<ActivityId, HoursBand | null>;
  clothingCoverage?: ClothingCoverageId | null;
};

const DEFAULT_ACTIVITIES: Record<ActivityId, HoursBand | null> = {
  construction: null,
  gardening: null,
  running: null,
  cycling: null,
  team_sport: null,
  surfing: null,
  outdoor_cafe: null
};

/** Returns dark readable text on light bg, light text on dark bg */
function contrastTextOnHex(hex: string): { primary: string; secondary: string } {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16) || 0;
  const g = parseInt(h.slice(2, 4), 16) || 0;
  const b = parseInt(h.slice(4, 6), 16) || 0;
  const y = (r * 299 + g * 587 + b * 114) / 1000;
  if (y > 160) {
    return { primary: "#0f172a", secondary: "rgba(15,23,42,0.75)" };
  }
  return { primary: "#fafafa", secondary: "rgba(250,250,250,0.85)" };
}

export const PersonalizationPanel: React.FC<Props> = ({
  currentUv,
  peakUvNext24h
}) => {
  const [prefs, setPrefs] = useLocalStorageState<Prefs>("sunbuddy:prefs", {
    skinType: null,
    sensitivityItemIds: [],
    activities: DEFAULT_ACTIVITIES,
    clothingCoverage: "tshirt_shorts"
  });

  const clothingCoverage: ClothingCoverageId =
    prefs.clothingCoverage ?? "tshirt_shorts";

  const risk = estimateRiskTier({
    skinType: prefs.skinType,
    sensitivityItemIds: prefs.sensitivityItemIds,
    activities: prefs.activities,
    clothingCoverage,
    currentUv,
    peakUvNext24h
  });

  const recs = buildRecommendations({
    skinType: prefs.skinType,
    sensitivityItemIds: prefs.sensitivityItemIds,
    activities: prefs.activities,
    clothingCoverage,
    currentUv,
    peakUvNext24h
  });

  const sunscreen = estimateSunscreenAmount({
    skinType: prefs.skinType,
    sensitivityItemIds: prefs.sensitivityItemIds,
    activities: prefs.activities,
    clothingCoverage,
    currentUv,
    peakUvNext24h
  });

  const toggleSensitivity = (id: string) => {
    setPrefs((p) => {
      const set = new Set(p.sensitivityItemIds);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      return { ...p, sensitivityItemIds: Array.from(set) };
    });
  };

  const setActivityBand = (id: ActivityId, band: HoursBand | null) => {
    setPrefs((p) => ({ ...p, activities: { ...p.activities, [id]: band } }));
  };

  const setClothingCoverage = (id: ClothingCoverageId) => {
    setPrefs((p) => ({ ...p, clothingCoverage: id }));
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <article className="ios-card p-4 lg:col-span-2">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-sm font-semibold text-slate-900">
              Personalisation
            </div>
            <div className="text-xs text-slate-500">
              Choose what fits you for more specific guidance.
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-xs font-medium text-slate-700 mb-2">
              Fitzpatrick skin type
            </div>
            <div className="grid grid-cols-2 gap-3">
              {FITZPATRICK_TYPES.map((t) => {
                const selected = prefs.skinType === t.id;
                const { primary, secondary } = contrastTextOnHex(t.color);
                return (
                  <button
                    key={t.id}
                    className={[
                      "text-left rounded-2xl border-2 min-h-[5.5rem] px-4 py-3 shadow-sm transition-transform active:scale-[0.98]",
                      selected
                        ? "ring-2 ring-slate-900 ring-offset-2 scale-[1.02] shadow-md"
                        : "border-black/10 hover:border-black/20"
                    ].join(" ")}
                    style={{
                      backgroundColor: t.color,
                      borderColor: selected ? "rgb(15 23 42)" : "rgba(0,0,0,0.08)",
                      color: primary
                    }}
                    onClick={() =>
                      setPrefs((p) => ({ ...p, skinType: t.id }))
                    }
                    type="button"
                  >
                    <div
                      className="text-sm font-bold tracking-tight"
                      style={{ color: primary }}
                    >
                      {t.name}
                    </div>
                    <div
                      className="text-[11px] mt-2 leading-snug font-medium"
                      style={{ color: secondary }}
                    >
                      {t.typicalResponse}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="text-[11px] text-slate-500 mt-2">
              Examples are general. If unsure, choose the closest match.
            </div>
          </div>

          <div>
            <div className="text-xs font-medium text-slate-700 mb-2">
              Medication & skin products
            </div>
            <div className="space-y-2">
              {SENSITIVITY_ITEMS.map((item) => {
                const checked = prefs.sensitivityItemIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={[
                      "w-full text-left rounded-2xl border px-3 py-2",
                      checked
                        ? "border-orange-600 bg-orange-50"
                        : "border-slate-200 bg-white"
                    ].join(" ")}
                    onClick={() => toggleSensitivity(item.id)}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-xs font-semibold text-slate-900">
                        {item.label}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {item.photosensitivity}
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      {item.note}
                    </div>
                    {checked && item.examples && item.examples.length > 0 && (
                      <ul className="mt-2 flex flex-wrap gap-1">
                        {item.examples.map((ex) => (
                          <li
                            key={ex}
                            className={[
                              "px-2 py-1 rounded-full text-[10px] border",
                              checked
                                ? "border-orange-200 bg-white text-slate-700"
                                : "border-slate-200 bg-white text-slate-600"
                            ].join(" ")}
                          >
                            {ex}
                          </li>
                        ))}
                      </ul>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="text-xs font-medium text-slate-700 mb-2">
              Clothing you’re wearing
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CLOTHING_COVERAGE_OPTIONS.map((o) => {
                const selected = clothingCoverage === o.id;
                return (
                  <button
                    key={o.id}
                    type="button"
                    className={[
                      "w-full text-left rounded-2xl border px-3 py-2",
                      selected
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-white text-slate-900"
                    ].join(" ")}
                    onClick={() => setClothingCoverage(o.id)}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base leading-none" aria-hidden="true">
                          {o.icon}
                        </span>
                        <div className="text-xs font-semibold">{o.label}</div>
                      </div>
                      <div
                        className={[
                          "text-[10px]",
                          selected ? "text-white/80" : "text-slate-500"
                        ].join(" ")}
                      >
                        {Math.round(o.exposedFraction * 100)}% exposed
                      </div>
                    </div>
                    <div
                      className={[
                        "text-[11px] mt-1",
                        selected ? "text-white/80" : "text-slate-500"
                      ].join(" ")}
                    >
                      {o.detail}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="text-[11px] text-slate-500 mt-2">
              This estimate assumes sunscreen on exposed skin only.
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="text-xs font-medium text-slate-700 mb-2">
              Outdoor activity / work
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {ACTIVITIES.map((a) => (
                <div
                  key={a.id}
                  className="rounded-2xl border border-slate-200 bg-white p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs font-semibold text-slate-900 truncate min-w-0">
                      {a.label}
                    </div>
                    <div className="text-[10px] text-slate-500 shrink-0">
                      {a.kind}
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    <button
                      type="button"
                      className={[
                        "px-2 py-1 rounded-full text-[10px] border",
                        prefs.activities[a.id] == null
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-white text-slate-600 border-slate-200"
                      ].join(" ")}
                      onClick={() => setActivityBand(a.id, null)}
                    >
                      None
                    </button>
                    {HOURS_BANDS.map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        className={[
                          "px-2 py-1 rounded-full text-[10px] border",
                          prefs.activities[a.id] === b.id
                            ? "bg-slate-900 text-white border-slate-900"
                            : "bg-white text-slate-600 border-slate-200"
                        ].join(" ")}
                        onClick={() => setActivityBand(a.id, b.id)}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </article>

      <aside className="ios-card p-4">
        <div className="text-sm font-semibold text-slate-900">
          Your estimated risk
        </div>
        <div className="text-xs text-slate-500 mt-1">{risk.summary}</div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs text-slate-500">Risk tier</div>
          <div
            className={[
              "px-2 py-1 rounded-full text-xs font-semibold",
              risk.tier === "Low"
                ? "bg-emerald-50 text-emerald-700"
                : risk.tier === "Medium"
                ? "bg-yellow-50 text-yellow-700"
                : risk.tier === "High"
                ? "bg-orange-50 text-orange-700"
                : "bg-red-50 text-red-700"
            ].join(" ")}
          >
            {risk.tier}
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3">
          <div className="text-xs font-semibold text-slate-900">
            Recommended sunscreen amount
          </div>
          <div className="mt-1 flex items-baseline justify-between gap-3">
            <div className="text-[11px] text-slate-500">Per application</div>
            <div className="text-sm font-semibold text-slate-900">
              {sunscreen.mlPerApplication} mL
              <span className="text-[11px] text-slate-500 font-normal">
                {" "}
                ({sunscreen.tspPerApplication} tsp)
              </span>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            {sunscreen.label}
          </div>
        </div>

        <div className="mt-4">
          <div className="text-xs font-medium text-slate-700 mb-2">
            Personalised recommendations
          </div>
          <ul className="space-y-2">
            {recs.slice(0, 16).map((r, idx) => (
              <li key={idx} className="text-[11px] text-slate-600">
                {r}
              </li>
            ))}
          </ul>
          <div className="text-[10px] text-slate-400 mt-3">
            This is general guidance, not medical advice.
          </div>
        </div>
      </aside>
    </section>
  );
};

