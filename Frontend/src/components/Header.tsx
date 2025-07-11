import { LogOut, Menu } from 'lucide-react';

interface Props {
  sidebarOpen: boolean;
  setSidebarOpen: (sidebarOpen: boolean) => void
}

export default function Header({sidebarOpen,setSidebarOpen}: Props) {
  
  return (
      <header className="fixed top-0 left-0 z-50 bg-white shadow-sm h-16 w-full px-6 flex items-center justify-between">
         <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-700 hover:text-purple-600"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <img src="/logo.webp" alt="Cron Job Logo" className="h-8 w-8" />
            <span className="text-xl font-semibold text-gray-800">Cron Job</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-700">
          <span className="hidden sm:inline">Hello, Sunjay Kumar</span>
          <button className="flex items-center gap-1 text-purple-600 hover:underline">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </header>
  );
}
