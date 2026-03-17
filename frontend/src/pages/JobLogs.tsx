import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { LogTable, LogFilters } from "../components";
import type { UserLogInterface } from "../types";

export default function JobLogs() {
  const [jobName, setJobName] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { jobId } = useParams();
  const [logs, setLogs] = useState<UserLogInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [methodFilter, setMethodFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (statusFilter) queryParams.append("status", statusFilter);
    if (methodFilter) queryParams.append("method", methodFilter);

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/logs/${jobId}/?${queryParams.toString()}`, {
      credentials: "include",
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Something went wrong, Please try again later.");

        return data;
      })
      .then((data) => {
        setJobName(data?.logs[0]?.name);
        setLogs(data.logs);
        setTotalPages(data.totalPages);
        setPage(data.page);
      })
      .catch((err) => {
        console.error(err);
        navigate("/jobs");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [jobId, navigate, page, statusFilter, methodFilter, limit]);

  return (
    <>
      <h2 className="text-3xl font-normal text-purple-500 truncate mb-6">Logs for Job : {jobName}</h2>

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
          emptyMessage="No logs found for this job."
          limit={limit}
          setLimit={setLimit}
        />
      </div>
    </>
  );
}
