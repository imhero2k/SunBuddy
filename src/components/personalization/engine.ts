import type { ActivityId, FitzpatrickTypeId, HoursBand } from "./data";
import { ACTIVITIES, HOURS_BANDS, SENSITIVITY_ITEMS } from "./data";

export type RiskTier = "Low" | "Medium" | "High" | "Very High";

export type PersonalizationInputs = {
  skinType: FitzpatrickTypeId | null;
  sensitivityItemIds: string[];
  activities: Record<ActivityId, HoursBand | null>;
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

  const score = uvFactor * activityFactor * skinFactor(inputs.skinType) * sensitivityFactor(inputs.sensitivityItemIds);

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
    recs.push("Wear a hat, UV-rated sunglasses, and cover up when possible.");
    recs.push("Prefer shade during peak UV hours (late morning to mid-afternoon).");
  } else {
    recs.push("UV is low right now, but protection is still wise for long outdoor time.");
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

