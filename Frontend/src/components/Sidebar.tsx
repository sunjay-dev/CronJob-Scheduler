import { LayoutDashboard, ListChecks, History, Settings } from "lucide-react";

export default function Sidebar({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <aside
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white shadow z-40 p-4 transition-all duration-300 ${
        collapsed ? "w-64" : "w-16"
      }`}
    >
      <nav className="flex flex-col mt-2 gap-6 text-sm text-gray-700">
        <a href="/dashboard" className="flex items-center gap-3 hover:text-purple-600 transition">
          <LayoutDashboard className="w-5 h-5" />
          {collapsed && <span>Dashboard</span>}
        </a>

        <a href="/jobs" className="flex items-center gap-3 hover:text-purple-600 transition">
          <ListChecks className="w-5 h-5" />
          {collapsed && <span>Jobs</span>}
        </a>

        <a href="/logs" className="flex items-center gap-3 hover:text-purple-600 transition">
          <History className="w-5 h-5" />
          {collapsed && <span>Logs</span>}
        </a>

        <a href="/settings" className="flex items-center gap-3 hover:text-purple-600 transition">
          <Settings className="w-5 h-5" />
          {collapsed && <span>Settings</span>}
        </a>
      </nav>
    </aside>
  );
}
