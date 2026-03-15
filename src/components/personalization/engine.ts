import type { ActivityId, ClothingCoverageId, FitzpatrickTypeId, HoursBand } from "./data";
import {
  ACTIVITIES,
  CLOTHING_COVERAGE_OPTIONS,
  HOURS_BANDS,
  SENSITIVITY_ITEMS
} from "./data";

export type RiskTier = "Low" | "Medium" | "High" | "Very High";

export type PersonalizationInputs = {
  skinType: FitzpatrickTypeId | null;
  sensitivityItemIds: string[];
  activities: Record<ActivityId, HoursBand | null>;
  clothingCoverage?: ClothingCoverageId | null;
  currentUv: number;
  peakUvNext24h?: number | null;
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function getHoursApprox(band: HoursBand) {
  return HOURS_BANDS.find((b) => b.id === band)?.hoursApprox ?? 0;
}

function skinFactor(skinType: FitzpatrickTypeId | null) {
  switch (skinType) {
    case "I":
      return 1.6;
    case "II":
      return 1.4;
    case "III":
      return 1.2;
    case "IV":
      return 1.0;
    case "V":
      return 0.9;
    case "VI":
      return 0.85;
    default:
      return 1.1;
  }
}

function sensitivityFactor(ids: string[]) {
  const selected = new Set(ids);
  let score = 0;
  for (const item of SENSITIVITY_ITEMS) {
    if (!selected.has(item.id)) continue;
    if (item.photosensitivity === "Yes") score += 2;
    else if (item.photosensitivity === "Possible") score += 1;
    else score += 0.5;
  }
  return 1 + clamp(score * 0.12, 0, 0.6);
}
export function estimateRiskTier(inputs: PersonalizationInputs): {
  tier: RiskTier;
  score: number;
  summary: string;
} {
  const uv = Math.max(inputs.currentUv, inputs.peakUvNext24h ?? 0);
  const uvFactor = uv <= 2 ? 0.6 : uv <= 5 ? 1 : uv <= 7 ? 1.3 : 1.6;

  let activityScore = 0;
  for (const a of ACTIVITIES) {
    const band = inputs.activities[a.id];
    if (!band) continue;
    activityScore += a.baseWeight * getHoursApprox(band);
  }
  const activityFactor = 1 + clamp(activityScore / 50, 0, 1.2);

  const score =
    uvFactor *
    activityFactor *
    skinFactor(inputs.skinType) *
    sensitivityFactor(inputs.sensitivityItemIds);

  const tier: RiskTier =
    score < 1.1 ? "Low" : score < 1.6 ? "Medium" : score < 2.3 ? "High" : "Very High";

  const summaryParts: string[] = [];
  if (inputs.skinType) summaryParts.push(`Skin type ${inputs.skinType}`);
  if (inputs.sensitivityItemIds.length > 0) summaryParts.push(`${inputs.sensitivityItemIds.length} sensitivity item(s)`);
  const activityCount = Object.values(inputs.activities).filter(Boolean).length;
  if (activityCount > 0) summaryParts.push(`${activityCount} activity(ies)`);

  return {
    tier,
    score,
    summary: summaryParts.length ? summaryParts.join(" • ") : "Using default assumptions"
  };
}

export function buildRecommendations(inputs: PersonalizationInputs): string[] {
  const recs: string[] = [];
  const uv = Math.max(inputs.currentUv, inputs.peakUvNext24h ?? 0);
  const sensitive = inputs.sensitivityItemIds.length > 0;
  const skin = inputs.skinType;

  // Core protection
  if (uv >= 3) {
    recs.push("Use broad-spectrum SPF and reapply every 2 hours outdoors.");
    recs.push("Prefer shade during peak UV hours (late morning to mid-afternoon).");
  } else {
    recs.push("UV is low right now, but protection is still wise for long outdoor time.");
  }

  // Clothing & accessories (hat, sunglasses, cover-up) — tailored to coverage + UV
  const cover = inputs.clothingCoverage ?? "tshirt_shorts";
  recs.push(
    "Wear a wide-brim hat (or cap with neck flap) to shade face, ears, and neck."
  );
  recs.push(
    "Use sunglasses labelled UV400 or category 3—wrap styles give extra side protection."
  );
  if (uv >= 5) {
    recs.push("At moderate–high UV, add a lightweight long-sleeve layer you can put on and off.");
  }
  if (cover === "swimwear") {
    recs.push(
      "With swimwear: add a rash shirt or cover-up for shoulders/back, and lip balm with SPF."
    );
    if (uv >= 6) {
      recs.push("Beach/pool days: reapply sunscreen after swimming; consider UV swim shirts and a sun umbrella.");
    }
  } else if (cover === "tshirt_shorts" || cover === "long_sleeves_shorts") {
    recs.push(
      "Legs still exposed—longer shorts, pants, or a sarong help when UV is strong."
    );
  } else if (cover === "tshirt_long_pants") {
    recs.push(
      "Arms are still exposed—swap to long sleeves or keep a UV shirt handy for peak hours."
    );
  } else if (cover === "long_sleeves_long_pants") {
    recs.push(
      "You’re well covered on body—focus on face, hands, and scalp: hat, shades, and SPF on backs of hands."
    );
  }
  recs.push("Closed shoes or socks reduce burn on feet during long walks or sport.");

  // Reapplication: only when the chosen activity / clothing matches
  const act = inputs.activities;
  const hasSwimContext =
    act.surfing != null || cover === "swimwear";
  const hasSweatySport =
    act.running != null || act.cycling != null || act.team_sport != null;
  const hasOutdoorWork = act.construction != null || act.gardening != null;

  if (hasSwimContext) {
    recs.push(
      "Swimming or heavy splashing: get out, dry skin, and reapply—even water-resistant products wear off; follow the label (e.g. 40/80 min water resistance)."
    );
    recs.push(
      "After swimming, towelling dry rubs sunscreen off—reapply once your skin is dry, even before 2 hours."
    );
    recs.push(
      "Pool/beach: reapply after long swim sessions; a UV rash shirt means less skin relying on lotion in the water."
    );
  }
  if (hasSweatySport) {
    recs.push(
      "Running / cycling / team sport: heavy sweating means reapplying more often than every 2 hours—pat dry, then reapply evenly."
    );
    recs.push(
      "Wiping or towelling sweat during sport removes sunscreen—reapply during water or half-time breaks."
    );
    recs.push(
      "Carry a travel-size sunscreen for mid-activity reapplication."
    );
  }
  if (hasOutdoorWork) {
    recs.push(
      "Construction / outdoor chores: heat and sweat wash sunscreen away faster—reapply on breaks, more often than every 2 hours when working hard."
    );
    recs.push(
      "Keep sunscreen accessible on site (travel size or pump)—towelling your face/neck removes protection, so reapply after wiping down."
    );
  }

  // Skin-type specificity
  if (skin === "I" || skin === "II") {
    recs.push("Your skin type burns easily—avoid unprotected midday sun even on partly cloudy days.");
    recs.push("Choose SPF 50+ when UV is moderate or higher.");
  } else if (skin === "III" || skin === "IV") {
    recs.push("You may still burn at moderate/high UV—use SPF 30+ and seek shade when UV peaks.");
  } else if (skin === "V" || skin === "VI") {
    recs.push("Darker skin can still be damaged by UV—use SPF 30+ for prolonged exposure and protect eyes/lips.");
  } else {
    recs.push("Select a skin type for more specific guidance.");
  }

  // Sensitivity items
  if (sensitive) {
    recs.push("Some selected medications/products may increase photosensitivity—reduce unprotected exposure time.");
    recs.push("Be stricter with reapplication and consider SPF 50+ if you’ll be outdoors.");
  }


  // Activity-based advice
  const activityCount = Object.values(inputs.activities).filter(Boolean).length;
  if (activityCount > 0) {
    recs.push("For regular outdoor activity/work, set reminders for sunscreen reapplication and hydration breaks.");
    if (uv >= 6) {
      recs.push("When UV is high, try shifting outdoor sessions to early morning or late afternoon.");
    }
  }

  return recs;
}

function clamp01(n: number) {
  return clamp(n, 0, 1);
}

function getExposedFraction(clothingCoverage?: ClothingCoverageId | null) {
  const id = clothingCoverage ?? "tshirt_shorts";
  return (
    CLOTHING_COVERAGE_OPTIONS.find((o) => o.id === id)?.exposedFraction ??
    0.55
  );
}

export function estimateSunscreenAmount(inputs: PersonalizationInputs): {
  mlPerApplication: number;
  tspPerApplication: number;
  label: string;
} {
  // Rule-of-thumb: ~35 mL (7 tsp) for an average adult full body application.
  // Scale by how much skin is exposed by clothing.
  const exposed = clamp01(getExposedFraction(inputs.clothingCoverage));
  const fullBodyMl = 35;
  const ml = fullBodyMl * exposed;
  const tsp = ml / 5; // 1 tsp ~= 5 mL

  const roundedMl = Math.max(5, Math.round(ml / 2) * 2); // round to nearest 2 mL, minimum 5 mL
  const roundedTsp = Math.max(1, Math.round((tsp + Number.EPSILON) * 10) / 10);

  const uv = Math.max(inputs.currentUv, inputs.peakUvNext24h ?? 0);
  const when =
    uv >= 3
      ? "Apply to exposed skin and reapply every 2 hours outdoors."
      : "Apply to exposed skin for prolonged outdoor time.";

  return {
    mlPerApplication: roundedMl,
    tspPerApplication: roundedTsp,
    label: when
  };
}

