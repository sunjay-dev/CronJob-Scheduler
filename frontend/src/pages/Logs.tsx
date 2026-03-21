import { useEffect, useState } from "react";
import { LogChart, LogTable, LogFilters } from "../components";
import type { InsightLog, UserLogInterface } from "../types";
import { apiFetch } from "../utils/apiFetch";

export default function Logs() {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [logs, setLogs] = useState<UserLogInterface[]>([]);
  const [logsInsights, setLogsInsights] = useState<InsightLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [methodFilter, setMethodFilter] = useState("");

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined;

    const fetchLogs = (shouldLoad = true) => {
      if (shouldLoad) setIsLoading(true);

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (statusFilter) queryParams.append("status", statusFilter);
      if (methodFilter) queryParams.append("method", methodFilter);

      apiFetch(`/api/v1/logs?${queryParams.toString()}`)
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
        fetchLogs(false);
        intervalId = setInterval(() => fetchLogs(false), 60_000);
      }, delay);
    }

    return () => {
      clearTimeout(TimeOutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [page, statusFilter, methodFilter, limit]);

  useEffect(() => {
    const fetchInsights = () => {
      apiFetch("/api/v1/logs/insights")
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
      <h1 className="text-3xl font-normal text-purple-500 mb-6">Logs</h1>

      <LogChart logs={logsInsights} />

      <LogFilters
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        methodFilter={methodFilter}
        setMethodFilter={setMethodFilter}
        setPage={setPage}
      />

      <div className="bg-white px-4 py-6 sm:px-6 mb-6 rounded-xl shadow">
        <LogTable
          logs={logs}
          isLoading={isLoading}
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          limit={limit}
          setLimit={setLimit}
        />
      </div>
    </>
  );
}
