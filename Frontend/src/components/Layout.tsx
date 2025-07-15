import { useState } from 'react';
import { Header, Sidebar, Footer } from './';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  return (
    <div className="bg-gray-50 h-dvh overflow-x-hidden font-[Inter] selection:bg-purple-500 selection:text-white">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Sidebar collapsed={sidebarOpen} />

      <div className={`mt-16 p-12 transition-all duration-300 ${sidebarOpen ? 'ml-56' : 'ml-16'}`}>
        <Outlet />
        <Footer />
      </div>
    </div>
  );
}
