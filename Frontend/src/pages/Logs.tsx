import { useEffect, useState } from "react";
import { LogChart, LogTable } from "../components";
import type { InsightLog, UserLogInterface } from "../types";

export default function Logs() {
  const limit = 10;
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [logs, setLogs] = useState<UserLogInterface[]>([]);
  const [logsInsights, setLogsInsights] = useState<InsightLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined;

    const fetchLogs = () => {
      setIsLoading(true);

      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/logs?page=${page}&limit=${limit}`, {
        credentials: "include",
      })
        .then(async (res) => {
          const data = await res.json();

          if (!res.ok) throw new Error(data.message || "Something went wrong, Please try again later.");

          return data;
        })
        .then((data) => {
          setPage(data.page);
          setTotalPages(data.totalPages);
          setLogs(data.logs);
        })
        .catch((err) => console.error(err))
        .finally(() => setIsLoading(false));
    };

    fetchLogs();

    let TimeOutId: ReturnType<typeof setTimeout>;
    if (page === 1) {
      const now = new Date().getSeconds();
      const delay = (60 - now) * 1000 + 5000;
      TimeOutId = setTimeout(() => {
        fetchLogs();
        intervalId = setInterval(fetchLogs, 60_000);
      }, delay);
    }

    return () => {
      clearTimeout(TimeOutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [page]);

  useEffect(() => {
    const fetchInsights = () => {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/logs/insights`, {
        credentials: "include",
      })
        .then(async (res) => {
          const data = await res.json();

          if (!res.ok) throw new Error(data.message || "Something went wrong, Please try again later.");

          return data;
        })
        .then((data) => {
          setLogsInsights(data);
        })
        .catch((err) => console.error(err));
    };

    fetchInsights();
  }, []);

  return (
    <>
      <h1 className="text-3xl font-normal mb-6 text-purple-500">Logs</h1>

      <LogChart logs={logsInsights} />

      <div className="bg-white px-4 py-6 sm:px-6 mb-6 rounded-xl shadow">
        <LogTable logs={logs} isLoading={isLoading} page={page} setPage={setPage} totalPages={totalPages} />
      </div>
    </>
  );
}
