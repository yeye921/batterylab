import { useState, useMemo } from "react";
import ReactEChartsCore from "echarts-for-react";
import { experiments, generateCycleData } from "@/data/mockData";
import FilterTag from "@/components/FilterTag";

const COLORS = ["#0EA5E9", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#06B6D4", "#84CC16"];

export default function ComparePage() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 8 ? [...prev, id] : prev);
  };

  const datasets = useMemo(() =>
    selected.map((id) => {
      const exp = experiments.find((e) => e.id === id)!;
      return { exp, data: generateCycleData(exp.id, exp.cycles) };
    }), [selected]);

  const maxCycles = Math.max(1, ...datasets.map((d) => d.data.length));

  const chartOption = {
    grid: { top: 50, right: 20, bottom: 50, left: 65 },
    tooltip: { trigger: "axis" as const },
    legend: { data: datasets.map((d) => d.exp.id), top: 4, textStyle: { fontSize: 11 } },
    xAxis: { type: "category" as const, data: Array.from({ length: maxCycles }, (_, i) => i + 1), name: "Cycle", nameLocation: "center" as const, nameGap: 30, axisLabel: { fontSize: 10 } },
    yAxis: { type: "value" as const, name: "Discharge Capacity (mAh)", nameLocation: "center" as const, nameGap: 48, axisLabel: { fontSize: 10 } },
    series: datasets.map((d, i) => ({
      name: d.exp.id,
      type: "line",
      data: d.data.map((c) => c.dischargeCapacity),
      smooth: true,
      symbol: "none",
      lineStyle: { width: 1.5 },
      itemStyle: { color: COLORS[i % COLORS.length] },
    })),
  };

  const effOption = {
    grid: { top: 50, right: 20, bottom: 50, left: 65 },
    tooltip: { trigger: "axis" as const },
    legend: { data: datasets.map((d) => d.exp.id), top: 4, textStyle: { fontSize: 11 } },
    xAxis: { type: "category" as const, data: Array.from({ length: maxCycles }, (_, i) => i + 1), name: "Cycle", nameLocation: "center" as const, nameGap: 30, axisLabel: { fontSize: 10 } },
    yAxis: { type: "value" as const, name: "Efficiency (%)", nameLocation: "center" as const, nameGap: 40, min: 90, axisLabel: { fontSize: 10 } },
    series: datasets.map((d, i) => ({
      name: d.exp.id,
      type: "line",
      data: d.data.map((c) => c.efficiency),
      smooth: true,
      symbol: "none",
      lineStyle: { width: 1.5 },
      itemStyle: { color: COLORS[i % COLORS.length] },
    })),
  };

  return (
    <div>
      <h1 className="text-lg font-semibold mb-1">Compare Experiments</h1>
      <p className="text-xs text-muted-foreground mb-4">Select up to 8 experiments to compare side by side.</p>

      {/* Selected tags */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {selected.map((id) => (
            <FilterTag key={id} label="Exp" value={id} onRemove={() => toggle(id)} />
          ))}
        </div>
      )}

      {/* Selection table */}
      <div className="border border-border rounded bg-card overflow-auto mb-6 max-h-56">
        <table className="w-full text-xs">
          <thead className="sticky top-0">
            <tr className="border-b border-border bg-secondary/50">
              <th className="px-3 py-1.5 w-8"></th>
              <th className="px-3 py-1.5 text-left font-medium text-muted-foreground">ID</th>
              <th className="px-3 py-1.5 text-left font-medium text-muted-foreground">Name</th>
              <th className="px-3 py-1.5 text-left font-medium text-muted-foreground">Type</th>
              <th className="px-3 py-1.5 text-right font-medium text-muted-foreground">Temp</th>
              <th className="px-3 py-1.5 text-right font-medium text-muted-foreground">Cycles</th>
            </tr>
          </thead>
          <tbody>
            {experiments.filter((e) => e.status === "completed").map((exp) => (
              <tr
                key={exp.id}
                onClick={() => toggle(exp.id)}
                className={`border-b border-border last:border-0 cursor-pointer transition-colors duration-75 ${
                  selected.includes(exp.id) ? "bg-primary/5" : "hover:bg-secondary/30"
                }`}
              >
                <td className="px-3 py-1">
                  <input type="checkbox" checked={selected.includes(exp.id)} readOnly className="rounded border-border" />
                </td>
                <td className="px-3 py-1 font-mono-data">{exp.id}</td>
                <td className="px-3 py-1 font-medium">{exp.name}</td>
                <td className="px-3 py-1">{exp.batteryType}</td>
                <td className="px-3 py-1 font-mono-data text-right">{exp.temperature}°C</td>
                <td className="px-3 py-1 font-mono-data text-right">{exp.cycles}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Charts */}
      {datasets.length > 0 ? (
        <div className="space-y-4">
          <div className="border border-border rounded bg-card p-4">
            <h2 className="text-xs font-medium text-muted-foreground mb-2">Discharge Capacity Comparison</h2>
            <ReactEChartsCore option={chartOption} style={{ height: 360 }} />
          </div>
          <div className="border border-border rounded bg-card p-4">
            <h2 className="text-xs font-medium text-muted-foreground mb-2">Efficiency Comparison</h2>
            <ReactEChartsCore option={effOption} style={{ height: 360 }} />
          </div>
        </div>
      ) : (
        <div className="border border-border rounded bg-card py-20 text-center text-sm text-muted-foreground">
          Select experiments above to start comparing.
        </div>
      )}
    </div>
  );
}
