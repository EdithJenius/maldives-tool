import { useState, useEffect, useCallback, useRef } from "react"
import type { Island, RecommendResult } from "@/types"
import { recommend } from "@/lib/recommend"
import Sidebar from "@/components/Sidebar"
import Results from "@/components/Results"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import "./index.css"

export default function App() {
  const [islands, setIslands] = useState<Island[]>([]);
  const [result, setResult] = useState<RecommendResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedIslandId, setSelectedIslandId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const toastRef = useRef<HTMLDivElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    fetch("/maldives-tool/data/islands.json")
      .then(r => r.json())
      .then(d => setIslands(d))
      .catch(() => {});
  }, []);

  const handleGenerate = useCallback((params: any) => {
    setLoading(true);
    setTimeout(() => {
      const res = recommend(islands, params.budgetLo, params.budgetHi, params.pax, params.night, params.dateStr, params.prefs);
      setResult(res);
      setLoading(false);
    }, 500);
  }, [islands]);

  const showToast = useCallback((msg: string) => {
    if (toastRef.current) {
      toastRef.current.textContent = msg;
      toastRef.current.classList.add("show");
      clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => {
        if (toastRef.current) toastRef.current.classList.remove("show");
      }, 3000);
    }
  }, []);

  const handleCopy = useCallback(() => {
    if (!result) return;
    const plans = result.plans;
    const meta = result.meta;
    const lines = ["【马尔代夫 · 推荐方案】"];
    lines.push("双人预算: ¥" + meta.budgetLo.toLocaleString() + "–" + meta.budgetHi.toLocaleString() + "  |  人数: " + meta.pax + "人 |  住宿: " + meta.night + "晚");
    if (meta.selectedPrefs.length) lines.push("偏好: " + meta.selectedPrefs.join("、"));
    if (meta.seasonLabel) lines.push("季节: " + meta.seasonLabel);
    lines.push("");
    plans.forEach((plan, idx) => {
      const i = plan.island;
      lines.push((idx === 0 ? "🏳️ 首推" : "🎲 方案" + (idx + 1)) + "：" + i.name_cn + "（" + i.name_en + "）");
      lines.push("📍 " + i.atoll + "  |  ⭐" + i.rating + "星  |  🚎 " + i.transfer + "  |  🍔☕" + i.meal_plan);
      lines.push("💰 ¥" + plan.totalPerPerson.toLocaleString() + "/人·双人4晚套餐 ¥" + plan.total.toLocaleString());
      if (plan.matchedPrefs.length) lines.push("✅ 匹配偏好: " + plan.matchedPrefs.join("、"));
      i.advantages.forEach(a => lines.push("  • " + a));
      if (i.disadvantages.length) lines.push("  注意: " + i.disadvantages.join("；"));
      lines.push("  📕 " + i.seasonal_notes);
      lines.push("");
    });
    lines.push("— 数据仅供内部参考 —");
    const text = lines.join("\n");
    navigator.clipboard.writeText(text).then(
      () => showToast("✅ 方案已复制"),
      () => {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        showToast("✅ 方案已复制");
      }
    );
  }, [result, showToast]);

  const selectedIsland = selectedIslandId ? islands.find(i => i.id === selectedIslandId) || null : null;

  let filteredPlans = result?.plans || [];
  if (searchTerm && result) {
    const tl = searchTerm.toLowerCase();
    filteredPlans = result.plans.filter(p =>
      p.island.name_cn.includes(searchTerm) || p.island.name_en.toLowerCase().includes(tl)
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <header className="relative overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-primary-light">
        <div className="absolute inset-0 opacity-15" style={{backgroundImage:"radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(232,168,56,0.3) 0%, transparent 40%)"}} />
        <div className="relative max-w-[1400px] mx-auto px-6 sm:px-8 py-8 sm:py-9 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide">马尔代夫 · 方案推荐</h1>
          <p className="text-white/75 text-sm mt-1 font-light">杭州超值假期有限公司 · 输入预算与需求，智能匹配最合适的岛屿方案</p>
        </div>
      </header>
      <div className="flex flex-col lg:flex-row max-w-[1400px] mx-auto w-full flex-1">
        <aside className="w-full lg:w-[380px] lg:min-w-[380px] p-4 lg:p-5 lg:sticky lg:top-0 lg:self-start lg:max-h-screen lg:overflow-y-auto">
          <Sidebar onGenerate={handleGenerate} islandCount={islands.length} searchTerm={searchTerm} onSearchChange={s => setSearchTerm(s)} />
        </aside>
        <main className="flex-1 p-4 lg:p-6 min-h-[400px]">
          <Results plans={filteredPlans} meta={result?.meta||{budgetLo:0,budgetHi:0,pax:2,night:4,season:"",seasonLabel:"",selectedPrefs:[],totalCandidates:0}}
            onCopy={handleCopy} onPrint={() => window.print()} onIslandClick={id => setSelectedIslandId(id)} />
        </main>
      </div>
      <footer className="text-center py-6 text-text-muted text-xs border-t border-border mt-auto">
        <p>数据仅供内部参考 · 实际价格以实时查询为准</p>
      </footer>
      <Dialog open={loading} onOpenChange={() => {}}>
        <DialogContent className="flex flex-col items-center gap-4 bg-transparent border-none shadow-none">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-white/30 border-t-white" />
          <p className="text-white text-sm font-medium">正在智能匹配最佳方案...</p>
        </DialogContent>
      </Dialog>
      <Dialog open={!!selectedIsland} onOpenChange={open => { if (!open) setSelectedIslandId(null); }}>
        {selectedIsland && (
          <DialogContent className="max-w-5xl w-[95vw] max-h-[95vh] bg-card p-0 rounded-xl overflow-hidden">
            <div className="p-4 pb-3 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-text">{selectedIsland.name_cn} <span className="text-sm text-text-muted font-normal">{selectedIsland.name_en}</span></h2>
                <p className="text-xs text-text-muted mt-0.5">📍 {selectedIsland.atoll} · 🚎 {selectedIsland.transfer} · 🍔☕ {selectedIsland.meal_plan}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-muted hidden sm:inline">点击弹窗外关闭</span>
                <button onClick={() => setSelectedIslandId(null)} className="sm:hidden p-1.5 rounded-md hover:bg-border/50 transition-colors" aria-label="关闭">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
            {selectedIsland.detail_pdf ? (
              <div className="w-full h-[75vh]">
                <iframe src={selectedIsland.detail_pdf} className="w-full h-full border-0" title={selectedIsland.name_cn} />
                <div className="p-3 text-center border-t border-border">
                  <a href={selectedIsland.detail_pdf} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">在新标签页中打开PDF</a>
                </div>
              </div>
            ) : (
              <p className="text-sm text-text-muted text-center py-12">暂无详细资料</p>
            )}
          </DialogContent>
        )}
      </Dialog>
      <div ref={toastRef} className="fixed bottom-10 left-1/2 -translate-x-1/2 -translate-y-4 bg-black/80 text-white px-6 py-2.5 rounded-lg text-sm opacity-0 transition-all duration-300 pointer-events-none z-50" />
    </div>
  );
}