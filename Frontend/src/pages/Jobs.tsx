import { useState } from 'react';
import { Timer } from 'lucide-react';
import { Header, Sidebar, JobCard, Footer } from '../components';

export default function Jobs() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className='font-[Inter] bg-gray-50 h-dvh w-dvw overflow-x-hidden'>

      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <Sidebar collapsed={sidebarOpen} />

      <div className={`mt-16 p-12 transition-all duration-300 ${sidebarOpen? 'ml-64': 'ml-16'}`}>


        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-normal text-purple-500">Cron jobs</h1>
          <button className="p-2.5 bg-purple-500 text-white flex items-center gap-1 rounded-sm">
            <Timer  />
            Create Job
          </button>
        </div>

        <div className="p-6 bg-white rounded-2xl mb-4">
          <div className="hidden md:grid grid-cols-[3fr_1.5fr_1fr_1fr_1fr] text-sm text-gray-600 font-medium px-4 mb-4">
            <span>Title, URL</span>
            <span>Next execution</span>
            <span>Status</span>
            <span className="text-center">Edit</span>
            <span className="text-center">History</span>
          </div>

          <div className="space-y-3">
            <JobCard />
            <JobCard />
            <JobCard />
          </div>
        </div>
      <Footer />
      </div>
    </div>
  );
}
