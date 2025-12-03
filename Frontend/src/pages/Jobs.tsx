import { Ban, PlusCircle } from "lucide-react";
import { JobCard, Loader } from "../components";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../hooks";
import { removeJob, setJobs, updateJobStatus } from "../slices/jobSlice";

export default function Jobs() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL!;
  const jobs = useAppSelector((state) => state.jobs.jobs);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (jobs.length !== 0) return;

    setIsLoading(true);

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/jobs`, {
      credentials: "include",
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Something went wrong, Please try again later.");

        return data;
      })
      .then((data) => {
        dispatch(setJobs(data));
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeStatus = (id: string, status: boolean) => {
    setIsLoading(true);
    fetch(`${backendUrl}/api/jobs/status`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId: id, status }),
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Something went wrong, Please try again later.");

        return data;
      })
      .then(() => {
        dispatch(updateJobStatus({ jobId: id, disabled: !status }));
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  };

  const handleDeleteJob = (id: string) => {
    setIsLoading(true);
    fetch(`${backendUrl}/api/jobs/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Something went wrong, Please try again later.");

        return data;
      })
      .then(() => {
        dispatch(removeJob(id));
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-normal text-purple-500">Cron jobs</h1>
        <Link to="/create" className="py-2 px-4 bg-purple-500 text-white flex items-center gap-1.5 rounded-sm active:scale-[0.98]">
          <PlusCircle className="w-5 h-5" />
          Create Job
        </Link>
      </div>

      <div className="sm:px-6 py-6 px-4 bg-white rounded-xl shadow mb-4">
        <div className="grid grid-cols-[2.5fr_1fr_40px] sm:grid-cols-[2.5fr_1.5fr_1.5fr_1fr_1fr_1fr_40px] gap-4 text-sm text-gray-600 font-medium px-4 mb-4">
          <span>Title, URL</span>
          <span className="text-center hidden sm:block">Last execution</span>
          <span className="text-center hidden sm:block">Next execution</span>
          <span className="text-center">Status</span>
          <span className="text-center hidden sm:block">Edit</span>
          <span className="text-center hidden sm:block">History</span>
          <span className="text-center">Actions</span>
        </div>

        {jobs.length === 0 ? (
          <div className="py-12 text-center text-gray-500 text-sm flex flex-col items-center">
            <Ban className="w-8 h-8 mb-3 text-gray-400" />
            <p>No jobs found. Create a new one to get started!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <JobCard
                key={job._id}
                _id={job._id}
                url={job.data.url}
                jobName={job.data.name}
                method={job.data.method}
                nextRunAt={job.nextRunAt}
                lastRunAt={job.lastRunAt}
                disabled={job.disabled ?? false}
                handleChangeStatus={handleChangeStatus}
                handleDeleteJob={handleDeleteJob}
                timeFormat24={user?.timeFormat24}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
