interface StatusBadgeProps {
  status: "completed" | "running" | "failed";
}

const styles: Record<string, string> = {
  completed: "bg-success/10 text-success",
  running: "bg-primary/10 text-primary",
  failed: "bg-destructive/10 text-destructive",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}
