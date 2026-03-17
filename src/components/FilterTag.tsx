import { X } from "lucide-react";

interface FilterTagProps {
  label: string;
  value: string;
  onRemove: () => void;
}

export default function FilterTag({ label, value, onRemove }: FilterTagProps) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-secondary text-secondary-foreground text-xs font-medium border border-border">
      <span className="text-muted-foreground">{label}:</span>
      {value}
      <button onClick={onRemove} className="hover:text-destructive transition-colors">
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}
