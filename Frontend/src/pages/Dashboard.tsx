import { PlusCircle, List, Clock } from 'lucide-react';
import { StatCard, LogCard, Pagination } from '../components';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { JobInterface, UserLogInterface } from '../types'

export default function Dashboard() {
  const limit = 8;
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [logs, setLogs] = useState<UserLogInterface[]>([]);
  const [analytics, setAnalytics] = useState({
    total: 0,
    active: 0,
    disabled: 0,
  });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/jobs`, {
      credentials: 'include',
    })
      .then(async (res) => {
        const data = await res.json();
        console.log(data);

        if (!res.ok)
          throw new Error(data.message || "Something went wrong");

        return data;
      })
      .then((data: JobInterface[]) => {
        const activeCount = data.reduce((count, job) => job.disabled ? count : count + 1, 0)

        setAnalytics({
          total: data.length,
          active: activeCount,
          disabled: data.length - activeCount
        })
      }).catch(err => console.log(err));
  }, [])

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined;

    const fetchLogs = () => {
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
        setLogs(data.logs);
        setTotalPages(data.totalPages)
        setPage(data.page);
      }).catch(err => console.log(err));
    }

    fetchLogs();

    if (page === 1) {
      intervalId = setInterval(fetchLogs, 1000 * 60);
    }

    return () => {
      if (intervalId)
        clearInterval(intervalId);
    };

  }, [page]);

  return (
    <>
      <h1 className="text-3xl text-purple-600 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Jobs" value={analytics.total} />
        <StatCard title="Active Jobs" value={analytics.active} />
        <StatCard title="Disabled Jobs" value={analytics.disabled} />
        <StatCard title="Executed Today" value={3} />
      </div>

      <div className="flex justify-end gap-4 mb-6">
        <Link to="/logs" className="flex items-center gap-2 px-4 py-2 border border-purple-600 text-purple-600 rounded hover:bg-purple-50">
          <List className="w-5 h-5" />
          View All Jobs
        </Link>
        <Link to='/create' className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 active:scale-[0.98]">
          <PlusCircle className="w-5 h-5" />
          Create Job
        </Link>
      </div>

      <div className="bg-white p-6 rounded-xl shadow mb-4">
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
          {logs?.map(log =>
            <LogCard key={log._id}
              timestamp={log.createdAt}
              url={log.url}
              method={log.method}
              status={log.status}
            />
          )}
        </div>
        <Pagination page={page} setPage={setPage} totalPages={totalPages} />
      </div>
    </>
  );
}
