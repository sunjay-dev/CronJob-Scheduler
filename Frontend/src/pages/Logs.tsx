import { useEffect, useState } from 'react';
import { LogChart, LogCard, Pagination, Loader } from '../components';
import type { UserLogInterface } from '../types'
import { FileWarning } from 'lucide-react';

export default function Logs() {
  const limit = 10;
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [logs, setLogs] = useState<UserLogInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined;

    const fetchLogs = () => {
      setIsLoading(true);

      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/logs?page=${page}&limit=${limit}`, {
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
          setPage(data.page);
          setTotalPages(data.totalPages)
          setLogs(data.logs)
        }).catch(err => console.log(err))
        .finally(()=> setIsLoading(false));
    }

    fetchLogs();

    if (page === 1) {
      intervalId = setInterval(fetchLogs, 1000 * 60);
    }

    return () => {
      if (intervalId)
        clearInterval(intervalId);
    };
  }, [page])


  return (
    <>
      <h1 className="text-3xl font-normal mb-6 text-purple-500">Logs</h1>

      <LogChart logs={logs ?? []} />
      <div className="bg-white p-6 mb-6 rounded-xl shadow">
        <div className="grid grid-cols-[1fr_2fr_2fr_2fr_1fr] text-sm gap-4 items-center text-gray-500 font-medium px-4 mb-2">
          <span>Method</span>
          <span>URL</span>
          <span>Time</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        {isLoading ? <Loader /> : 
        logs.length === 0 ? (
          <div className="py-12 text-center text-gray-500 text-sm flex flex-col items-center">
            <FileWarning className="w-8 h-8 mb-3 text-gray-400" />
            <p>No logs found.</p>
          </div>
        ) : (
          <>
            <div className="text-sm text-gray-600 space-y-1">
              {logs.map(log => (
                <LogCard
                  key={log._id}
                  log={log}
                />
              ))}
            </div>
            <Pagination page={page} setPage={setPage} totalPages={totalPages} />
          </>
        )}
      </div>
    </>
  )
}
