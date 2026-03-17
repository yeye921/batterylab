import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowUpDown } from "lucide-react";
import { experiments, type Experiment } from "@/data/mockData";
import FilterTag from "@/components/FilterTag";
import StatusBadge from "@/components/StatusBadge";

const batteryTypes = ["NCM811", "LFP", "NCA", "NCM622", "LCO"];
const temperatures = [-10, 0, 25, 35, 45, 55];

type SortKey = keyof Experiment;

export default function ExperimentsPage() {
  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedTemps, setSelectedTemps] = useState<number[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortAsc, setSortAsc] = useState(false);

  const filtered = useMemo(() => {
    let data = experiments.filter((e) => {
      if (search && !e.name.toLowerCase().includes(search.toLowerCase()) && !e.id.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedTypes.length && !selectedTypes.includes(e.batteryType)) return false;
      if (selectedTemps.length && !selectedTemps.includes(e.temperature)) return false;
      return true;
    });
    data.sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortAsc ? cmp : -cmp;
    });
    return data;
  }, [search, selectedTypes, selectedTemps, sortKey, sortAsc]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  const toggleType = (t: string) => setSelectedTypes((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);
  const toggleTemp = (t: number) => setSelectedTemps((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);

  const columns: { key: SortKey; label: string; className?: string }[] = [
    { key: "id", label: "ID", className: "font-mono-data" },
    { key: "name", label: "Name" },
    { key: "batteryType", label: "Type" },
    { key: "temperature", label: "Temp (°C)", className: "font-mono-data text-right" },
    { key: "chargeCondition", label: "Charge" },
    { key: "cycles", label: "Cycles", className: "font-mono-data text-right" },
    { key: "status", label: "Status" },
    { key: "date", label: "Date", className: "font-mono-data" },
  ];

  return (
    <div>
      <h1 className="text-lg font-semibold mb-4">Experiments</h1>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search experiments..."
            className="h-8 pl-8 pr-3 rounded border border-border bg-card text-sm focus:outline-none focus:ring-1 focus:ring-ring w-56"
          />
        </div>

        {/* Type filter */}
        <select
          onChange={(e) => { if (e.target.value) toggleType(e.target.value); e.target.value = ""; }}
          value=""
          className="h-8 px-2 rounded border border-border bg-card text-sm text-muted-foreground focus:outline-none"
        >
          <option value="">Battery Type</option>
          {batteryTypes.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>

        {/* Temp filter */}
        <select
          onChange={(e) => { if (e.target.value) toggleTemp(Number(e.target.value)); e.target.value = ""; }}
          value=""
          className="h-8 px-2 rounded border border-border bg-card text-sm text-muted-foreground focus:outline-none"
        >
          <option value="">Temperature</option>
          {temperatures.map((t) => <option key={t} value={t}>{t}°C</option>)}
        </select>

        {/* Active filter tags */}
        {selectedTypes.map((t) => (
          <FilterTag key={t} label="Type" value={t} onRemove={() => toggleType(t)} />
        ))}
        {selectedTemps.map((t) => (
          <FilterTag key={t} label="Temp" value={`${t}°C`} onRemove={() => toggleTemp(t)} />
        ))}
      </div>

      {/* Table */}
      <div className="border border-border rounded bg-card overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key)}
                  className={`px-3 py-2 text-left text-xs font-medium text-muted-foreground cursor-pointer select-none hover:text-foreground ${col.className?.includes("text-right") ? "text-right" : ""}`}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    <ArrowUpDown className="h-3 w-3" />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((exp) => (
              <tr key={exp.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors duration-75">
                <td className="px-3 py-1.5 font-mono-data text-xs">
                  <Link to={`/experiments/${exp.id}`} className="text-primary hover:underline">{exp.id}</Link>
                </td>
                <td className="px-3 py-1.5 text-xs font-medium">{exp.name}</td>
                <td className="px-3 py-1.5 text-xs">{exp.batteryType}</td>
                <td className="px-3 py-1.5 font-mono-data text-xs text-right">{exp.temperature}</td>
                <td className="px-3 py-1.5 text-xs">{exp.chargeCondition}</td>
                <td className="px-3 py-1.5 font-mono-data text-xs text-right">{exp.cycles}</td>
                <td className="px-3 py-1.5"><StatusBadge status={exp.status} /></td>
                <td className="px-3 py-1.5 font-mono-data text-xs">{exp.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">No experiments found.</div>
        )}
      </div>
      <div className="mt-2 text-xs text-muted-foreground">{filtered.length} results</div>
    </div>
  );
}
