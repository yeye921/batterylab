import { Link, useLocation } from "react-router-dom";
import { FlaskConical, GitCompareArrows, BarChart3 } from "lucide-react";

const navItems = [
  { path: "/experiments", label: "Experiments", icon: FlaskConical },
  { path: "/compare", label: "Compare", icon: GitCompareArrows },
];

export default function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-56 bg-sidebar flex flex-col z-50">
      <div className="flex items-center gap-2 px-5 py-5 border-b border-sidebar-border">
        <BarChart3 className="h-5 w-5 text-sidebar-primary" />
        <span className="text-sm font-semibold text-sidebar-foreground tracking-tight">
          BatteryLab
        </span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2.5 px-3 py-2 rounded text-[13px] font-medium transition-colors duration-100 ${
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-5 py-4 text-[11px] text-sidebar-muted border-t border-sidebar-border">
        v1.0.0
      </div>
    </aside>
  );
}
