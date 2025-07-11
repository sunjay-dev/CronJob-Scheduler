import { LayoutDashboard, ListChecks, History, Settings } from "lucide-react";
import { Link } from "react-router-dom";

export default function Sidebar({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <aside
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white shadow z-40 p-4 transition-all duration-300 ${
        collapsed ? "w-56" : "w-16"
      }`}
    >
      <nav className="flex flex-col mt-2 gap-6 text-sm text-gray-700">
        <Link to="/" className="flex items-center gap-3 hover:text-purple-600 transition">
          <LayoutDashboard className="w-5 h-5" />
          {collapsed && <span>Dashboard</span>}
        </Link>

        <Link to="/jobs" className="flex items-center gap-3 hover:text-purple-600 transition">
          <ListChecks className="w-5 h-5" />
          {collapsed && <span>Jobs</span>}
        </Link>

        <Link to="/logs" className="flex items-center gap-3 hover:text-purple-600 transition">
          <History className="w-5 h-5" />
          {collapsed && <span>Logs</span>}
        </Link>

        <Link to="/settings" className="flex items-center gap-3 hover:text-purple-600 transition">
          <Settings className="w-5 h-5" />
          {collapsed && <span>Settings</span>}
        </Link>
      </nav>
    </aside>
  );
}
