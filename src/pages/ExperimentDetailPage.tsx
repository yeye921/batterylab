import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ReactEChartsCore from "echarts-for-react";
import { experiments, generateCycleData } from "@/data/mockData";
import StatusBadge from "@/components/StatusBadge";

export default function ExperimentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const experiment = experiments.find((e) => e.id === id);
  const cycleData = useMemo(() => experiment ? generateCycleData(experiment.id, experiment.cycles) : [], [experiment]);

  if (!experiment) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground">Experiment not found.</p>
        <Link to="/experiments" className="text-primary text-sm mt-2 inline-block">← Back</Link>
      </div>
    );
  }

  const capacityOption = {
    grid: { top: 40, right: 20, bottom: 40, left: 60 },
    tooltip: { trigger: "axis" as const },
    legend: { data: ["Charge Capacity", "Discharge Capacity"], top: 4, textStyle: { fontSize: 11 } },
    xAxis: { type: "category" as const, data: cycleData.map((d) => d.cycle), name: "Cycle", nameLocation: "center" as const, nameGap: 28, axisLabel: { fontSize: 10 } },
    yAxis: { type: "value" as const, name: "mAh", nameLocation: "center" as const, nameGap: 42, axisLabel: { fontSize: 10 } },
    series: [
      { name: "Charge Capacity", type: "line", data: cycleData.map((d) => d.chargeCapacity), smooth: true, symbol: "none", lineStyle: { width: 1.5 }, itemStyle: { color: "#0EA5E9" } },
      { name: "Discharge Capacity", type: "line", data: cycleData.map((d) => d.dischargeCapacity), smooth: true, symbol: "none", lineStyle: { width: 1.5 }, itemStyle: { color: "#10B981" } },
    ],
  };

  const efficiencyOption = {
    grid: { top: 40, right: 20, bottom: 40, left: 60 },
    tooltip: { trigger: "axis" as const },
    legend: { data: ["Efficiency", "Temperature"], top: 4, textStyle: { fontSize: 11 } },
    xAxis: { type: "category" as const, data: cycleData.map((d) => d.cycle), name: "Cycle", nameLocation: "center" as const, nameGap: 28, axisLabel: { fontSize: 10 } },
    yAxis: [
      { type: "value" as const, name: "%", nameLocation: "center" as const, nameGap: 35, min: 90, axisLabel: { fontSize: 10 } },
      { type: "value" as const, name: "°C", nameLocation: "center" as const, nameGap: 35, axisLabel: { fontSize: 10 }, position: "right" as const },
    ],
    series: [
      { name: "Efficiency", type: "line", data: cycleData.map((d) => d.efficiency), smooth: true, symbol: "none", lineStyle: { width: 1.5 }, itemStyle: { color: "#0EA5E9" } },
      { name: "Temperature", type: "line", yAxisIndex: 1, data: cycleData.map((d) => Math.round(d.temperature * 10) / 10), smooth: true, symbol: "none", lineStyle: { width: 1.5, type: "dashed" as const }, itemStyle: { color: "#F59E0B" } },
    ],
  };

  const info = [
    ["ID", experiment.id],
    ["Battery Type", experiment.batteryType],
    ["Temperature", `${experiment.temperature}°C`],
    ["Charge Condition", experiment.chargeCondition],
    ["Cycles", experiment.cycles],
    ["Capacity", `${experiment.capacity} mAh`],
    ["Date", experiment.date],
  ];

  return (
    <div>
      <Link to="/experiments" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-3.5 w-3.5" /> Experiments
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-lg font-semibold">{experiment.name}</h1>
        <StatusBadge status={experiment.status} />
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {info.map(([label, value]) => (
          <div key={label} className="border border-border rounded bg-card px-3 py-2">
            <div className="text-[11px] text-muted-foreground">{label}</div>
            <div className="text-sm font-medium font-mono-data">{value}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="border border-border rounded bg-card p-4">
          <h2 className="text-xs font-medium text-muted-foreground mb-2">Capacity vs Cycle</h2>
          <ReactEChartsCore option={capacityOption} style={{ height: 300 }} />
        </div>
        <div className="border border-border rounded bg-card p-4">
          <h2 className="text-xs font-medium text-muted-foreground mb-2">Efficiency & Temperature</h2>
          <ReactEChartsCore option={efficiencyOption} style={{ height: 300 }} />
        </div>
      </div>

      {/* Data table */}
      <div className="border border-border rounded bg-card overflow-auto">
        <h2 className="text-xs font-medium text-muted-foreground px-3 py-2 border-b border-border">Cycle Data (first 50)</h2>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              {["Cycle", "Charge (mAh)", "Discharge (mAh)", "Efficiency (%)", "Temp (°C)", "Voltage (V)"].map((h) => (
                <th key={h} className="px-3 py-1.5 text-left font-medium text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cycleData.slice(0, 50).map((d) => (
              <tr key={d.cycle} className="border-b border-border last:border-0 hover:bg-secondary/30">
                <td className="px-3 py-1 font-mono-data">{d.cycle}</td>
                <td className="px-3 py-1 font-mono-data">{d.chargeCapacity.toFixed(1)}</td>
                <td className="px-3 py-1 font-mono-data">{d.dischargeCapacity.toFixed(1)}</td>
                <td className="px-3 py-1 font-mono-data">{d.efficiency.toFixed(2)}</td>
                <td className="px-3 py-1 font-mono-data">{d.temperature.toFixed(1)}</td>
                <td className="px-3 py-1 font-mono-data">{d.voltage.toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
