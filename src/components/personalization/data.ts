export type FitzpatrickTypeId = "I" | "II" | "III" | "IV" | "V" | "VI";

export type FitzpatrickType = {
  id: FitzpatrickTypeId;
  name: string;
  description: string;
  typicalResponse: string;
  color: string;
};

export const FITZPATRICK_TYPES: FitzpatrickType[] = [
  {
    id: "I",
    name: "Type I",
    description: "Very fair skin",
    typicalResponse: "Always burns, never tans",
    color: "#FDEBD3"
  },
  {
    id: "II",
    name: "Type II",
    description: "Fair skin",
    typicalResponse: "Usually burns, tans minimally",
    color: "#F5D5B8"
  },
  {
    id: "III",
    name: "Type III",
    description: "Medium skin",
    typicalResponse: "Sometimes mild burn, gradually tans",
    color: "#D7A97C"
  },
  {
    id: "IV",
    name: "Type IV",
    description: "Olive / light brown skin",
    typicalResponse: "Rarely burns, tans easily",
    color: "#C68E5A"
  },
  {
    id: "V",
    name: "Type V",
    description: "Brown skin",
    typicalResponse: "Very rarely burns, tans very easily",
    color: "#8D5C3E"
  },
  {
    id: "VI",
    name: "Type VI",
    description: "Deeply pigmented skin",
    typicalResponse: "Almost never burns",
    color: "#5A3825"
  }
];

export type SensitivityItem = {
  id: string;
  label: string;
  category: "Medication" | "Skin product";
  photosensitivity: "Yes" | "Possible" | "Unknown";
  note: string;
  examples?: string[];
};

export const SENSITIVITY_ITEMS: SensitivityItem[] = [
  {
    id: "doxycycline",
    label: "Tetracycline antibiotics",
    category: "Medication",
    photosensitivity: "Yes",
    note: "Can increase sunburn risk.",
    examples: ["Doxycycline", "Minocycline", "Tetracycline"]
  },
  {
    id: "isotretinoin",
    label: "Isotretinoin",
    category: "Medication",
    photosensitivity: "Possible",
    note: "Can increase skin dryness and sensitivity."
  },
  {
    id: "thiazides",
    label: "Thiazide diuretics",
    category: "Medication",
    photosensitivity: "Possible",
    note: "May increase sensitivity to UV."
  },
  {
    id: "retinoid",
    label: "Topical retinoid (tretinoin/retinol)",
    category: "Skin product",
    photosensitivity: "Possible",
    note: "May increase irritation; use sunscreen."
  },
  {
    id: "aha_bha",
    label: "AHA/BHA exfoliants",
    category: "Skin product",
    photosensitivity: "Possible",
    note: "Exfoliation can make skin more sun-sensitive."
  },
  {
    id: "benzoyl_peroxide",
    label: "Benzoyl peroxide",
    category: "Skin product",
    photosensitivity: "Possible",
    note: "Can dry/irritate skin; be extra sun-safe."
  }
];

/** Optional common conditions—used for tailored sun-safety tips (not a diagnosis). */
export type SkinConditionItem = {
  id: string;
  label: string;
  note: string;
};

export const SKIN_CONDITION_ITEMS: SkinConditionItem[] = [
  {
    id: "eczema",
    label: "Eczema / atopic dermatitis",
    note: "Skin barrier is often weaker; some sunscreens sting—patch test new products."
  },
  {
    id: "psoriasis",
    label: "Psoriasis",
    note: "Controlled sun can help some people; burning or overexposure can trigger flares."
  },
  {
    id: "rosacea",
    label: "Rosacea",
    note: "Heat and UV commonly trigger flushing and flare-ups."
  },
  {
    id: "acne",
    label: "Acne-prone skin",
    note: "Still need daily SPF; choose non-comedogenic, oil-free formulas if you prefer."
  },
  {
    id: "melasma",
    label: "Melasma / dark patches",
    note: "Sun quickly worsens pigmentation—strict protection and reapplication matter."
  },
  {
    id: "vitiligo",
    label: "Vitiligo",
    note: "Depigmented areas burn more easily—extra SPF and covering those spots helps."
  },
  {
    id: "skin_cancer_history",
    label: "Skin cancer history or many moles",
    note: "Higher priority for protection, shade, and regular skin checks with a clinician."
  },
  {
    id: "contact_dermatitis",
    label: "Sensitive skin / contact dermatitis",
    note: "Fragrance and some filters irritate—fragrance-free and minimal-ingredient SPF often suit better."
  }
];

export type ActivityId =
  | "construction"
  | "gardening"
  | "running"
  | "cycling"
  | "team_sport"
  | "surfing"
  | "outdoor_cafe";

export type Activity = {
  id: ActivityId;
  label: string;
  kind: "Work" | "Sport" | "Leisure";
  baseWeight: number; // higher = more UV exposure likelihood
};

export const ACTIVITIES: Activity[] = [
  { id: "construction", label: "Construction / trade work", kind: "Work", baseWeight: 4 },
  { id: "gardening", label: "Gardening / outdoor chores", kind: "Work", baseWeight: 3 },
  { id: "running", label: "Running", kind: "Sport", baseWeight: 2 },
  { id: "cycling", label: "Cycling", kind: "Sport", baseWeight: 3 },
  { id: "team_sport", label: "Team sport training/matches", kind: "Sport", baseWeight: 3 },
  { id: "surfing", label: "Surfing / beach time", kind: "Leisure", baseWeight: 4 },
  { id: "outdoor_cafe", label: "Outdoor dining / walking", kind: "Leisure", baseWeight: 1 }
];

export type HoursBand = "0-2" | "2-5" | "5-10" | "10+";

export const HOURS_BANDS: { id: HoursBand; label: string; hoursApprox: number }[] = [
  { id: "0-2", label: "0–2 hrs/week", hoursApprox: 1 },
  { id: "2-5", label: "2–5 hrs/week", hoursApprox: 3.5 },
  { id: "5-10", label: "5–10 hrs/week", hoursApprox: 7.5 },
  { id: "10+", label: "10+ hrs/week", hoursApprox: 12 }
];

export type ClothingCoverageId =
  | "swimwear"
  | "tshirt_shorts"
  | "tshirt_long_pants"
  | "long_sleeves_shorts"
  | "long_sleeves_long_pants";

export type ClothingCoverageOption = {
  id: ClothingCoverageId;
  icon: string;
  label: string;
  detail: string;
  exposedFraction: number; // 0..1 of body skin typically exposed
};

export const CLOTHING_COVERAGE_OPTIONS: ClothingCoverageOption[] = [
  {
    id: "swimwear",
    icon: "👙",
    label: "Swimwear",
    detail: "Most skin exposed",
    exposedFraction: 1
  },
  {
    id: "tshirt_shorts",
    icon: "👕🩳",
    label: "T‑shirt + shorts",
    detail: "Arms + lower legs exposed",
    exposedFraction: 0.611
  },
  {
    id: "tshirt_long_pants",
    icon: "👕👖",
    label: "T‑shirt + long pants",
    detail: "Arms exposed",
    exposedFraction: 0.389
  },
  {
    id: "long_sleeves_shorts",
    icon: "🧥🩳",
    label: "Long sleeves + shorts",
    detail: "Lower legs exposed",
    exposedFraction: 0.389
  },
  {
    id: "long_sleeves_long_pants",
    icon: "🧥👖",
    label: "Long sleeves + long pants",
    detail: "Only face/neck/hands exposed",
    exposedFraction: 0.2
  }
];

