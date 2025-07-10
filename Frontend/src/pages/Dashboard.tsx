// pages/Dashboard.tsx

import { useState } from 'react';
import { Header, StatCard ,LogCard, Sidebar, Footer } from '../components';
import { PlusCircle, List, Clock } from 'lucide-react';

export default function Dashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="bg-gray-50 h-dvh w-dvw overflow-x-hidden font-[Inter]">
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            {sidebarOpen && <Sidebar />}

            <div className={`mt-16 transition-all duration-300 ${sidebarOpen ? 'ml-64' : ''}`}>
                <div className="p-8">

                    {/* Top - Welcome Message */}
                    <h1 className="text-3xl text-purple-600 mb-4">Dashboard</h1>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <StatCard title="Total Jobs" value={12} />
                        <StatCard title="Active Jobs" value={8} />
                        <StatCard title="Disabled Jobs" value={4} />
                        <StatCard title="Executed Today" value={3} />
                    </div>

                    <div className="flex justify-end gap-4 mb-6">
                        <button className="flex items-center gap-2 px-4 py-2 border border-purple-600 text-purple-600 rounded hover:bg-purple-50">
                            <List className="w-5 h-5" />
                            View All Jobs
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                            <PlusCircle className="w-5 h-5" />
                            Create Job
                        </button>
                    </div>

                    <div className="bg-white p-6  rounded shadow">
                        <div className="mb-5 flex items-center gap-2 text-gray-700 font-semibold text-xl">
                            <Clock className="w-5 h-5" />
                            Recent Logs
                        </div>

                        <div className="grid grid-cols-[1fr_2fr_2fr_1fr] text-sm gap-4 items-center text-gray-500 font-medium px-4 mb-2">
                            <span>Method</span>
                            <span>URL</span>
                            <span>Time</span>
                            <span className="text-center">Status</span>
                        </div>

                        <div className="text-sm text-gray-600 space-y-1">
                            <LogCard
                                timestamp="2025-07-09T10:45:00.000Z"
                                url="https://uniride.sunjay.xyz"
                                method="GET"
                                status="success"
                            />

                            <LogCard
                                timestamp="2025-07-09T08:00:00.000Z"
                                url="https://uniride.sunjay.xyz/api"
                                method="POST"
                                status="failed"
                            />
                        </div>
                    </div>

                </div>
                <Footer />
            </div>
        </div>
    );
}