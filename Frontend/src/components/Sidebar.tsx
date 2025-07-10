export default function Sidebar() {
  return (
    <aside className="fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-white shadow z-40 p-4">
      <nav className="flex flex-col gap-4 text-sm text-gray-700">
        <a href="/" className="hover:text-purple-600">Dashboard</a>
        <a href="/jobs" className="hover:text-purple-600">Jobs</a>
        <a href="/logs" className="hover:text-purple-600">Logs</a>
        <a href="/settings" className="hover:text-purple-600">Settings</a>
      </nav>
    </aside>
  );
}
