import { useState } from 'react';
import { Header, LogChart, LogCard, Sidebar, Footer } from '../components';

export default function Logs() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const logs = [
        { timestamp: '2025-07-09T00:10:00Z', status: 'success' },
        { timestamp: '2025-07-09T00:10:00Z', status: 'success' },
        { timestamp: '2025-07-09T01:15:00Z', status: 'failed' },
        { timestamp: '2025-07-09T01:15:01Z', status: 'failed' },
        { timestamp: '2025-07-09T01:15:04Z', status: 'failed' },
        { timestamp: '2025-07-09T01:45:00Z', status: 'success' },
        { timestamp: '2025-07-09T14:30:00Z', status: 'success' },
    ];

    return (
        <div className='font-[Inter] bg-gray-50 h-dvh w-dvw overflow-x-hidden'>

            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            <Sidebar collapsed={sidebarOpen} />

            <div className={`mt-16 p-12 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
                             <h1 className="text-3xl font-normal mb-6 text-purple-500">Logs</h1>

                    <LogChart logs={logs} />
                    <div className="bg-white p-6 mb-6 rounded-xl shadow">
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
                                 <Footer />
                </div>
            </div>
        </div>
    )
}
