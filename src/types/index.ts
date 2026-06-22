export interface Island {
  id: string; name_cn: string; name_en: string; atoll: string; rating: number;
  category: "budget" | "mid-range" | "luxury" | "ultra-luxury";
  price_per_person_min: number; price_per_person_max: number; currency: string;
  highlights: string[]; description: string; advantages: string[];
  disadvantages: string[]; transfer: string; meal_plan: string;
  best_for: string[]; room_types: string[]; image: string; score: number;
  seasonal_notes: string; detail_pdf: string;
}
export interface PlanResult {
  island: Island; score: number; totalPerPerson: number; total: number;
  reason: string; matchedPrefs: string[]; seasonLabel: string; seasonMultiplier: number;
}
export interface RecommendMeta {
  budgetLo: number; budgetHi: number; pax: number; night: number;
  season: string; seasonLabel: string; selectedPrefs: string[]; totalCandidates: number;
}
export interface RecommendResult { plans: PlanResult[]; meta: RecommendMeta; }
