import type { PlanResult, RecommendMeta } from "@/types"
import { Button } from "@/components/ui/button"
import PlanCard from "@/components/PlanCard"
import { Copy, Printer } from "lucide-react"

interface RP { plans: PlanResult[]; meta: RecommendMeta; onCopy: () => void; onPrint: () => void; onIslandClick: (id: string) => void; }

export default function Results({ plans, meta, onCopy, onPrint, onIslandClick }: RP) {
  if (plans.length === 0) {
    return (<div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="text-6xl mb-4">🏝️</div>
      <h3 className="text-lg font-semibold text-text mb-2">开始你的马尔代夫之旅</h3>
      <p className="text-sm text-text-muted max-w-sm mb-6">填写左侧需求，我们将从知识库中智能匹配最适合的岛屿方案</p>
      <div className="flex gap-3 flex-wrap justify-center">
        <div className="px-4 py-2 bg-card rounded-lg shadow-sm text-sm text-text-secondary">📚 已收录 {meta.totalCandidates || 0} 个热门岛屿</div>
        <div className="px-4 py-2 bg-card rounded-lg shadow-sm text-sm text-text-secondary">💰 覆盖经济到顶奢全价位</div>
        <div className="px-4 py-2 bg-card rounded-lg shadow-sm text-sm text-text-secondary">🔆 合理搭配优势与注意事项</div>
      </div>
    </div>);
  }

  const prefText = meta.selectedPrefs.length > 0 ? "偏好: " + meta.selectedPrefs.join("、") + " · " : "";

  return (<div>
    <div className="flex items-start justify-between gap-3 mb-6">
      <div>
        <h2 className="text-xl font-bold text-text">推荐方案</h2>
        <p className="text-sm text-text-muted mt-0.5">
          {prefText + "双人预算 ¥" + meta.budgetLo.toLocaleString() + "–" + meta.budgetHi.toLocaleString() +
            " · " + meta.pax + "人" + meta.night + "晚" + (meta.seasonLabel ? " · " + meta.seasonLabel : "") + " · 共匹配 " + plans.length + " 个岛屿"}
        </p>
      </div>
      <div className="flex gap-2 shrink-0">
        <Button variant="outline" size="sm" onClick={onCopy} className="gap-1.5"><Copy size={14} /> 复制方案</Button>
        <Button variant="outline" size="sm" onClick={onPrint} className="gap-1.5"><Printer size={14} /> 打印方案</Button>
      </div>
    </div>
    <div className="space-y-6">{plans.map((p, i) => <PlanCard key={p.island.id} plan={p} idx={i} totalPlans={plans.length} pax={meta.pax} night={meta.night} onClick={() => onIslandClick(p.island.id)} />)}</div>
  </div>);
}