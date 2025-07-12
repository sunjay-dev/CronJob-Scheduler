import { useEffect, useState } from 'react';
import { LogChart, LogCard } from '../components';
import type {UserLogInterface} from '../types'

export default function Logs() {
    const [logs, setLogs] = useState<UserLogInterface[]>([]);
    useEffect(()=> {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/logs`, {
              credentials: 'include',
            })
              .then(async (res) => {
                const data = await res.json();
                console.log(data);
        
                if (!res.ok)
                  throw new Error(data.message || "Something went wrong");
        
                return data;
              })
              .then(data => {
                console.log(data);
                setLogs(data.logs)
              }).catch(err => console.log(err))
    }, [])


    return (
        <>
            <h1 className="text-3xl font-normal mb-6 text-purple-500">Logs</h1>

            <LogChart logs={logs ?? []} />
            <div className="bg-white p-6 mb-6 rounded-xl shadow">
                <div className="grid grid-cols-[1fr_2fr_2fr_1fr] text-sm gap-4 items-center text-gray-500 font-medium px-4 mb-2">
                    <span>Method</span>
                    <span>URL</span>
                    <span>Time</span>
                    <span className="text-center">Status</span>
                </div>

                <div className="text-sm text-gray-600 space-y-1">
                    {logs?.map(log => 
                        <LogCard key={log._id} timestamp={log.createdAt}
                        url={log.url}
                        method={log.method}
                        status={log.status} />
                    )}
                    
                </div>
            </div>
        </>
    )
}
