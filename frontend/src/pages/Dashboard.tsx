import { PlusCircle, List, Clock } from "lucide-react";
import { StatCard, LogTable } from "../components";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { setJobs } from "../slices/jobSlice";
import { useAppDispatch, useAppSelector } from "../hooks";
import type { JobInterface, UserLogInterface } from "../types";
import { apiFetch } from "../utils/apiFetch";

export default function Dashboard() {
  const limit = 8;
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [logs, setLogs] = useState<UserLogInterface[]>([]);
  const [analytics, setAnalytics] = useState({
    total: 0,
    active: 0,
    disabled: 0,
    logs: 0,
  });
  const user = useAppSelector((state) => state.auth.user);
  const jobs = useAppSelector((state) => state.jobs.jobs);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!jobs.length) return;

    const activeCount = jobs.reduce((count, job) => (job.disabled ? count : count + 1), 0);
    setAnalytics((pre) => ({
      ...pre,
      total: jobs.length,
      active: activeCount,
      disabled: jobs.length - activeCount,
    }));
  }, [jobs]);

  useEffect(() => {
    if (!user) return;
    if (jobs.length !== 0) return;

    apiFetch("/api/v1/jobs")
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Something went wrong, Please try again later.");

        return data;
      })
      .then((data: JobInterface[]) => {
        dispatch(setJobs(data));
      })
      .catch((err) => console.error(err));
  }, [dispatch, jobs.length, user]);

  useEffect(() => {
    if (!user) return;
    let intervalId: ReturnType<typeof setInterval> | undefined;

    const fetchLogs = () => {
      setIsLoading(true);
      apiFetch(`/api/v1/logs?page=${page}&limit=${limit}`)
        .then(async (res) => {
          const data = await res.json();

          if (!res.ok) throw new Error(data.message || "Something went wrong, Please try again later.");

          return data;
        })
        .then((data) => {
          setAnalytics((pre) => ({ ...pre, logs: data.total }));
          setLogs(data.logs);
          setTotalPages(data.totalPages);
          setPage(data.page);
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
  }, [page, user]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const loginMethod = params.get("loginMethod");

    if (loginMethod) {
      localStorage.setItem("lastLoginMethod", loginMethod);
      params.delete("loginMethod");
      const newUrl = `${window.location.pathname} ${params.toString()}`;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);

  return (
    <>
      <h1 className="text-3xl font-normal text-purple-600 mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Jobs" value={analytics.total} />
        <StatCard title="Active Jobs" value={analytics.active} />
        <StatCard title="Disabled Jobs" value={analytics.disabled} />
        <StatCard title="Total Logs" value={analytics.logs} />
      </div>

      <div className="flex justify-center md:justify-end gap-4 mb-6">
        <Link
          to="/jobs"
          className="flex items-center gap-2 px-4 py-2 border border-purple-600 text-purple-600 rounded hover:bg-purple-50"
        >
          <List className="w-5 h-5" />
          View All Jobs
        </Link>
        <Link
          to="/create"
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 active:scale-[0.98]"
        >
          <PlusCircle className="w-5 h-5" />
          Create Job
        </Link>
      </div>

      <div className="bg-white px-4 py-6 sm:px-6 rounded-xl shadow mb-4">
        <div className="mb-5 flex items-center gap-2 text-gray-700 font-semibold text-xl">
          <Clock className="w-5 h-5" />
          Recent Logs
        </div>

        <LogTable logs={logs} isLoading={isLoading} page={page} setPage={setPage} totalPages={totalPages} />
      </div>
    </>
  );
}
