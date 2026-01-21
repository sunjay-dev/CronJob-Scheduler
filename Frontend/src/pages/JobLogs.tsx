import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { UserLogInterface } from "../types";
import { LogTable } from "../components";

export default function JobLogs() {
  const [jobName, setJobName] = useState("");
  const limit = 10;
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { jobId } = useParams();
  const [logs, setLogs] = useState<UserLogInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/logs/${jobId}/?page=${page}&limit=${limit}`, {
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
  }, [jobId, navigate, page]);

  return (
    <>
      <h2 className="text-3xl font-normal mb-6 text-purple-500 truncate">Logs for Job : {jobName}</h2>
      <div className="bg-white px-4 py-6 sm:px-6 mb-6 rounded-xl shadow">
        <LogTable
          logs={logs}
          isLoading={isLoading}
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          emptyMessage="No logs found for this job."
        />
      </div>
    </>
  );
}
