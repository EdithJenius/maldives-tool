import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

const PRESETS = [
  { label: "经济", min: 1000, max: 10000 },
  { label: "舒适", min: 10000, max: 25000 },
  { label: "轻奢", min: 25000, max: 50000 },
  { label: "顶奢", min: 50000, max: 120000 }
];

const PREFS = [
  { tag: "蜜月", label: "蜜月" },
  { tag: "浮潜", label: "浮潜" },
  { tag: "亲子", label: "亲子" },
  { tag: "一价全包", label: "一价全包" },
  { tag: "拖尾沙滩", label: "拖尾沙滩" },
  { tag: "海底餐厅", label: "海底餐厅" },
  { tag: "奢华体验", label: "奢华体验" },
  { tag: "性价比", label: "性价比" }
];

interface SP {
  onGenerate: (p: { budgetLo: number; budgetHi: number; pax: number; night: number; dateStr: string; prefs: string[] }) => void;
  islandCount: number;
  searchTerm: string;
  onSearchChange: (s: string) => void;
}

export default function Sidebar({ onGenerate, islandCount, searchTerm, onSearchChange }: SP) {
  const [budgetLo, setBudgetLo] = useState(15000);
  const [budgetHi, setBudgetHi] = useState(40000);
  const [pax, setPax] = useState(2);
  const [night, setNight] = useState(4);
  const defaultDate = () => { const d = new Date(); d.setMonth(d.getMonth() + 2); return d.toISOString().split("T")[0]; };
  const [dateStr, setDateStr] = useState(defaultDate());
  const [prefs, setPrefs] = useState<string[]>([]);
  const [activePreset, setActivePreset] = useState<number | null>(null);

  return (
    <Card className="sticky top-4">
      <CardContent className="p-5 space-y-5">
        <h2 className="text-base font-semibold text-text pb-3 border-b border-border mb-4">出行需求</h2>
        <div className="space-y-2">
          <Label>双人总预算（CNY）</Label>
          <div className="flex items-center gap-2">
            <Input type="number" value={budgetLo} onChange={e => { const v = Math.min(Number(e.target.value), budgetHi - 2000); setBudgetLo(v); setActivePreset(null); }} min={1000} />
            <span className="text-text-muted text-sm">–</span>
            <Input type="number" value={budgetHi} onChange={e => { const v = Math.max(Number(e.target.value), budgetLo + 2000); setBudgetHi(v); setActivePreset(null); }} min={1000} />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {PRESETS.map((p, i) => (
              <button key={p.label} onClick={() => { setBudgetLo(p.min); setBudgetHi(p.max); setActivePreset(i); }}
                className={"px-3 py-1 text-xs rounded-full border transition-all " + (activePreset === i ? "bg-primary text-white border-primary" : "border-border text-text-secondary hover:border-primary hover:text-primary")}>
                {p.label} ¥{p.min / 1000}k-{p.max / 1000}k
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2"><Label>人数</Label><Input type="number" value={pax} onChange={e => setPax(Math.max(1, Number(e.target.value)))} /></div>
          <div className="space-y-2"><Label>出行日期</Label><Input type="date" value={dateStr} onChange={e => setDateStr(e.target.value)} /></div>
        </div>
        <div className="space-y-2">
          <Label>偏好（可多选）</Label>
          <div className="flex flex-wrap gap-1.5">
            {PREFS.map(o => (
              <button key={o.tag} onClick={() => setPrefs(p => p.includes(o.tag) ? p.filter(t => t !== o.tag) : [...p, o.tag])}
                className={"px-2.5 py-1.5 text-xs rounded-full border transition-all " + (prefs.includes(o.tag) ? "bg-primary/10 text-primary border-primary-light font-medium" : "border-border text-text-secondary hover:border-primary-light")}>
                {o.label}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Label>住宿晚数</Label>
          <Select value={night} onChange={e => setNight(Number(e.target.value))}>
            <option value={4}>4晚（标准·双人）</option>
            <option value={5}>5晚（深度）</option>
            <option value={7}>7晚（深度）</option>
            <option value={10}>10晚（超深度）</option>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>搜索岛屿</Label>
          <Input type="text" placeholder="输入中文或英文名..." value={searchTerm} onChange={e => onSearchChange(e.target.value)} />
        </div>
        <Button className="w-full h-11 text-base font-semibold" onClick={() => onGenerate({ budgetLo, budgetHi: budgetHi, pax, night, dateStr, prefs })}>
          生成推荐方案
        </Button>
        <p className="text-xs text-center text-text-muted">基于知识库 · 智能匹配</p>
        <div className="flex justify-around pt-2 border-t border-border">
          <div className="text-center"><div className="text-lg font-bold text-primary">{islandCount}</div><div className="text-xs text-text-muted">知识库岛屿</div></div>
          <div className="text-center"><div className="text-lg font-bold text-primary">4</div><div className="text-xs text-text-muted">价位档</div></div>
        </div>
      </CardContent>
    </Card>
  );
}