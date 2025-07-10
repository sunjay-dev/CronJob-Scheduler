import { useState } from 'react';
import { Clock, Settings } from 'lucide-react';
import { Header, Sidebar, Common, Advanced, Footer } from '../components';

export default function CreateJob() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [tab, setTab] = useState<'common' | 'advanced'>('common');

  return (
    <div className="bg-gray-50 h-dvh w-dvw overflow-x-hidden font-[Inter]">

      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {sidebarOpen && <Sidebar />}

      <div
        className={`mt-16 py-6 px-18 transition-all duration-300 ${sidebarOpen && 'ml-64'}`}
      >

        <h1 className="text-2xl text-purple-600 mb-6">Create Cron Job</h1>

        <div className="flex gap-8 mb-4">
          <button
            type="button"
            onClick={() => setTab('common')}
            className={`flex flex-col items-center text-sm font-medium px-4 py-2 
      transition-all duration-300 ease-in-out
      ${tab === 'common'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500 hover:text-purple-500'
              }`}
          >
            <Clock className="w-6 h-6 mb-1 transition-transform duration-300" />
            COMMON
          </button>

          <button
            type="button"
            onClick={() => setTab('advanced')}
            className={`flex flex-col items-center text-sm font-medium px-4 py-2 
      transition-all duration-300 ease-in-out
      ${tab === 'advanced'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500 hover:text-purple-500'
              }`}
          >
            <Settings className="w-6 h-6 mb-1 transition-transform duration-300" />
            ADVANCED
          </button>
        </div>

        <form className="space-y-5 bg-white p-6 rounded-xl shadow mb-4">
          {tab === 'common' ? <Common /> : <Advanced />}

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-md transition"
          >
            Create Job
          </button>
        </form>
      <Footer />
      </div>
    </div>
  );
}
