import type { Island, PlanResult, RecommendResult } from "@/types"

function getSeason(dateStr: string): string {
  if (!dateStr) return "unknown";
  const m = new Date(dateStr).getMonth() + 1;
  return m >= 12 || m <= 4 ? "peak" : m >= 5 && m <= 10 ? "low" : "shoulder";
}

function seasonLabel(s: string): string {
  const m: Record<string, string> = { peak: "旺季（12-4月）", low: "淡季（5-10月）", shoulder: "平季（11月）" };
  return m[s] || "";
}

function seasonMultiplier(s: string): number {
  const m: Record<string, number> = { peak: 1.2, low: 0.85 };
  return m[s] || 1;
}

export function recommend(
  islands: Island[], bLo: number, bHi: number, pax: number, night: number,
  dateStr: string, prefs: string[]
): RecommendResult {
  const sea = getSeason(dateStr);
  const smu = seasonMultiplier(sea);

  // Filter: show islands within budget (total price for 2 people 4 nights)
  let candidates = islands.filter(i =>
    i.price_per_person_min * 0.8 <= bHi + 3000 &&
    i.price_per_person_max * 1.2 >= bLo
  );
  if (candidates.length === 0) candidates = islands;

  // Score each island
  const scored = candidates.map(island => {
    let score = 0;
    const im = (island.price_per_person_min + island.price_per_person_max) / 2;
    const bm = (bLo + bHi) / 2;
    const br = bHi - bLo;

    // Price match score (40%)
    if (island.price_per_person_min >= bLo && island.price_per_person_max <= bHi) {
      score += 30;
      score += (1 - Math.abs(im - bm) / (br || 1)) * 10;
    } else {
      const overlap = Math.min(island.price_per_person_max, bHi) - Math.max(island.price_per_person_min, bLo);
      score += (overlap / (island.price_per_person_max - island.price_per_person_min)) * 20;
    }

    // Preference match (35%)
    if (prefs.length > 0) {
      let matchCount = 0;
      prefs.forEach(p => {
        if (island.best_for.some(b => b.includes(p))) matchCount++;
        if (island.highlights.some(h => h.includes(p))) matchCount++;
        if (island.advantages.some(a => a.includes(p))) matchCount++;
      });
      score += (matchCount / prefs.length) * 25;
    }

    // Score bonus (15%)
    score += (island.score / 10) * 15;

    return { island, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const plans: PlanResult[] = scored.map((item, idx) => {
    const i = item.island;
    const ap = (i.price_per_person_min + i.price_per_person_max) / 2;
    const pp = Math.round(ap / 2 * smu);
    const tot = Math.round(pp * pax * (night / 4));

    const matchedPrefs: string[] = [];
    if (prefs.length > 0) {
      prefs.forEach(p => {
        if (i.best_for.some(b => b.includes(p)) ||
            i.highlights.some(h => h.includes(p)) ||
            i.advantages.some(a => a.includes(p))) {
          matchedPrefs.push(p);
        }
      });
    }

    return {
      island: i, score: item.score, totalPerPerson: pp, total: tot,
      reason: idx === 0 ? "综合评分最高" : "推荐方案" + (idx + 1),
      matchedPrefs, seasonLabel: seasonLabel(sea), seasonMultiplier: smu
    };
  });

  return {
    plans,
    meta: {
      budgetLo: bLo, budgetHi: bHi, pax, night, season: sea,
      seasonLabel: seasonLabel(sea), selectedPrefs: prefs, totalCandidates: candidates.length
    }
  };
}
