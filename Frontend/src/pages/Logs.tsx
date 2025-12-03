import { useEffect, useState } from 'react';
import { LogChart, LogCard, Pagination, Loader } from '../components';
import type { InsightLog, UserLogInterface } from '../types'
import { FileWarning } from 'lucide-react';
import { useAppSelector } from '../hooks';

export default function Logs() {
  const limit = 10;
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [logs, setLogs] = useState<UserLogInterface[]>([]);
  const [logsInsights, setLogsInsights] = useState<InsightLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = useAppSelector(state => state.auth.user);
  
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined;

    const fetchLogs = () => {
      setIsLoading(true);

      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/logs?page=${page}&limit=${limit}`, {
        credentials: 'include',
      })
        .then(async (res) => {
          const data = await res.json();

          if (!res.ok)
            throw new Error(data.message || "Something went wrong, Please try again later.");

          return data;
        })
        .then(data => {
          setPage(data.page);
          setTotalPages(data.totalPages)
          setLogs(data.logs)
        }).catch(err => console.error(err))
        .finally(()=> setIsLoading(false));
    }

    fetchLogs();

    let TimeOutId: ReturnType<typeof setTimeout>;
    if (page === 1) {
      const now = new Date().getSeconds();
      const delay = (60 - now) * 1000 + 5000;
      TimeOutId = setTimeout(()=> {
        fetchLogs();
        intervalId = setInterval(fetchLogs, 60_000);
      }, delay);
    }

    return () => {
      clearTimeout(TimeOutId);
      if (intervalId)
        clearInterval(intervalId);
    };
  }, [page]);

  useEffect(() => {
    const fetchInsights = () => {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/logs/insights`, {
        credentials: 'include',
      })
        .then(async (res) => {
          const data = await res.json();

          if (!res.ok)
            throw new Error(data.message || "Something went wrong, Please try again later.");

          return data;
        })
        .then(data => {
          setLogsInsights(data);
        }).catch(err => console.error(err));
    }

    fetchInsights();
  }, []);


  return (
    <>
      <h1 className="text-3xl font-semibold mb-6 text-purple-500">Logs</h1>

      <LogChart logs={logsInsights} />

      <div className="bg-white p-6 mb-6 rounded-xl shadow">
        <div className="flex justify-between text-sm gap-4 items-center text-gray-500 font-medium px-4 mb-2">
          <span>Method</span>
            <span className="text-center sm:text-left flex-1/4 sm:flex-none ">URL</span>
          <span className="hidden sm:block">Time</span>
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
                  timeFormat24={user?.timeFormat24}
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
