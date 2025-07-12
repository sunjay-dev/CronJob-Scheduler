import { LayoutDashboard, ListChecks, History, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Sidebar({ collapsed = false }) {
  return (
    <aside
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white shadow z-40 p-4 transition-all duration-300 ${collapsed ? "w-56" : "w-16"
        }`}
    >
      <nav className="flex flex-col mt-2 gap-6 text-sm text-gray-700">
        <NavLink to="/" className={({ isActive }) =>
          `flex items-center gap-3 transition hover:text-purple-600 ${isActive && 'text-purple-600'}`}>
          <LayoutDashboard className="w-5 h-5" />
          {collapsed && <span>Dashboard</span>}
        </NavLink>

        <NavLink to="/jobs" className={({ isActive }) =>
          `flex items-center gap-3 transition hover:text-purple-600 ${isActive && 'text-purple-600'}`}>
          <ListChecks className="w-5 h-5" />
          {collapsed && <span>Jobs</span>}
        </NavLink>

        <NavLink to="/logs" className={({ isActive }) =>
          `flex items-center gap-3 transition hover:text-purple-600 ${isActive && 'text-purple-600'}`}>
          <History className="w-5 h-5" />
          {collapsed && <span>Logs</span>}
        </NavLink>

        <NavLink to="/settings" className={({ isActive }) =>
          `flex items-center gap-3 transition hover:text-purple-600 ${isActive && 'text-purple-600'}`}>
          <Settings className="w-5 h-5" />
          {collapsed && <span>Settings</span>}
        </NavLink>
      </nav>
    </aside>
  );
}
