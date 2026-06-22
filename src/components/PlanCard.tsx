import type { PlanResult } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

const CT: Record<string, string> = { budget: "经济", "mid-range": "舒适", luxury: "轻奢", "ultra-luxury": "顶奢" };
const GR = ["from-primary to-primary-light", "from-[#2d6a4f] to-[#52b788]", "from-accent to-[#f5c56a]", "from-[#6a4c93] to-[#a07dd8]", "from-[#e07a5f] to-[#f4a261]", "from-[#3d5a80] to-[#98c1d9]"];

interface PC { plan: PlanResult; idx: number; totalPlans: number; pax: number; night: number; onClick?: () => void; }

export default function PlanCard({ plan, idx, totalPlans, pax, night, onClick }: PC) {
  const i = plan.island;
  const top = idx === 0;

  return (
    <Card className={"overflow-hidden transition-all duration-200 hover:shadow-lg cursor-pointer " + (top ? "ring-2 ring-accent/40" : "")} onClick={onClick}>
      <div className="relative h-64 overflow-hidden bg-bg">
        <img src={i.image} alt={i.name_cn} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          onError={e => {
            const g = GR[idx % GR.length];
            const img = e.target as HTMLImageElement;
            img.style.display = "none";
            const p = img.parentElement!;
            if (!p.querySelector(".ph")) {
              const d = document.createElement("div");
              d.className = "ph absolute inset-0 flex items-center justify-center bg-gradient-to-br " + g;
              d.innerHTML = "<span class='text-6xl text-white/40 font-bold'>" + i.name_cn.charAt(0) + "</span>";
              p.appendChild(d);
            }
          }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className={"absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm " + (top ? "bg-accent text-white" : "bg-black/40 text-white")}>
          {top ? "🏳️" : "🎲"} {top ? "首推" : "方案" + (idx + 1)}
        </div>
        <div className="absolute bottom-4 left-5 right-5 text-white">
          <h3 className="text-xl font-bold">{i.name_cn}</h3>
          <p className="text-sm text-white/80">{i.name_en}</p>
        </div>
      </div>
      <div className="p-5 space-y-4">
        <div className="flex flex-wrap gap-2">
          {[["📍", i.atoll], ["⭐".repeat(i.rating) + "☆".repeat(5 - i.rating)], ["🚎", i.transfer], ["🍔☕", i.meal_plan], ["🏷️", CT[i.category] || i.category]].map(a => (
            <span key={a[0] + a[1]} className="text-xs px-2.5 py-1 rounded-md bg-bg text-text-secondary">{a[0]} {a[1]}</span>
          ))}
        </div>
        <p className="text-sm text-text-secondary leading-relaxed">{i.description}</p>
        {i.highlights.length > 0 && <div className="flex flex-wrap gap-1.5">{i.highlights.map(h => <Badge key={h}>{h}</Badge>)}</div>}
        {plan.matchedPrefs.length > 0 && <div className="flex flex-wrap gap-1.5">{plan.matchedPrefs.map(p => <Badge key={p} variant="accent">{"✅" + p}</Badge>)}</div>}
        <div className="flex items-baseline gap-3 p-3 rounded-lg bg-gradient-to-r from-primary/5 to-accent/5">
          <div>
            <span className="text-2xl font-bold text-primary">¥{plan.totalPerPerson.toLocaleString()}</span>
            <span className="text-xs text-text-muted ml-1">/人</span>
            <div className="text-xs text-text-muted mt-0.5">
              双人4晚套餐 ¥{i.price_per_person_min.toLocaleString()}–{i.price_per_person_max.toLocaleString()}
              {plan.seasonMultiplier !== 1 ? "（" + plan.seasonLabel + "×" + plan.seasonMultiplier + "）" : ""}
            </div>
          </div>
          <div className="ml-auto text-right">
            <div className="text-lg font-bold text-accent">¥{plan.total.toLocaleString()}</div>
            <span className="text-xs text-text-muted">{pax}人×{night}晚预估总价</span>
          </div>
        </div>
        <div><h4 className="text-sm font-semibold text-pros mb-2">推荐理由 · {plan.reason}</h4>
          <ul className="space-y-1">{i.advantages.map((a, ai) => <li key={ai} className="text-sm text-text-secondary pl-4 relative before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-pros before:rounded-full">{a}</li>)}</ul>
        </div>
        {i.disadvantages.length > 0 && (<div><h4 className="text-sm font-semibold text-cons mb-2">注意事项</h4><ul className="space-y-1">{i.disadvantages.map((d, di) => <li key={di} className="text-sm text-text-secondary pl-4">{d}</li>)}</ul></div>)}
        <div><h4 className="text-xs font-semibold text-text-secondary mb-2">🔆 适合人群</h4><div className="flex flex-wrap gap-1.5">{i.best_for.map(b => <span key={b} className="text-xs px-2.5 py-1 rounded-full bg-bg text-text-secondary">{b}</span>)}</div></div>
        <div className="text-xs text-text-secondary p-3 rounded-md bg-accent/5 border-l-2 border-accent">📕 {i.seasonal_notes}</div>
      </div>
    </Card>
  );
}