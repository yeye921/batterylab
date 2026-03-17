export interface Experiment {
  id: string;
  name: string;
  batteryType: string;
  temperature: number;
  chargeCondition: string;
  date: string;
  status: "completed" | "running" | "failed";
  cycles: number;
  capacity: number; // mAh
  notes: string;
}

export interface CycleData {
  cycle: number;
  chargeCapacity: number;
  dischargeCapacity: number;
  efficiency: number;
  temperature: number;
  voltage: number;
}

const batteryTypes = ["NCM811", "LFP", "NCA", "NCM622", "LCO"];
const chargeConditions = ["CC-CV 1C", "CC-CV 0.5C", "CC-CV 2C", "CC 1C", "Pulse 1C"];
const statuses: Experiment["status"][] = ["completed", "running", "failed"];

export const experiments: Experiment[] = Array.from({ length: 40 }, (_, i) => ({
  id: `EXP-${String(i + 1).padStart(4, "0")}`,
  name: `${batteryTypes[i % batteryTypes.length]} Cycle Test #${i + 1}`,
  batteryType: batteryTypes[i % batteryTypes.length],
  temperature: [25, 35, 45, 55, -10, 0][i % 6],
  chargeCondition: chargeConditions[i % chargeConditions.length],
  date: new Date(2025, 0, 1 + i * 3).toISOString().split("T")[0],
  status: statuses[i % 3 === 2 && i > 30 ? 2 : i % 10 === 5 ? 1 : 0],
  cycles: Math.floor(100 + Math.random() * 900),
  capacity: Math.floor(2000 + Math.random() * 3000),
  notes: `Batch ${Math.ceil((i + 1) / 5)} experiment`,
}));

export function generateCycleData(experimentId: string, cycles: number): CycleData[] {
  const seed = experimentId.charCodeAt(experimentId.length - 1);
  const degradationRate = 0.02 + (seed % 5) * 0.01;
  const initialCapacity = 3000 + (seed % 10) * 200;

  return Array.from({ length: cycles }, (_, i) => {
    const degradation = 1 - degradationRate * (i / cycles);
    const noise = () => (Math.random() - 0.5) * 0.02;
    const dc = initialCapacity * degradation * (1 + noise());
    const cc = dc * (1.005 + noise() * 0.5);
    return {
      cycle: i + 1,
      chargeCapacity: Math.round(cc * 100) / 100,
      dischargeCapacity: Math.round(dc * 100) / 100,
      efficiency: Math.round((dc / cc) * 10000) / 100,
      temperature: 25 + Math.sin(i / 50) * 5 + (Math.random() - 0.5) * 2,
      voltage: 3.6 + Math.sin(i / 30) * 0.3 + noise(),
    };
  });
}
