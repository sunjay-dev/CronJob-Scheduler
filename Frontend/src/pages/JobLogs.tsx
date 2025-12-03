import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { UserLogInterface } from '../types';
import { LogCard, Pagination, Loader } from '../components';
import { FileWarning } from 'lucide-react';
import { useAppSelector } from '../hooks';

export default function JobLogs() {
    const [jobName, setJobName] = useState('')
    const limit = 10
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { jobId } = useParams();
    const [logs, setLogs] = useState<UserLogInterface[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const user = useAppSelector(state => state.auth.user);
    useEffect(() => {
        setIsLoading(true);

        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/logs/${jobId}/?page=${page}&limit=${limit}`, {
            credentials: "include"
        }).then(async (res) => {
            const data = await res.json();

            if (!res.ok)
                throw new Error(data.message || "Something went wrong, Please try again later.");

            return data;
        }).then(data => {

            setJobName(data?.logs[0]?.name);
            setLogs(data.logs);
            setTotalPages(data.totalPages);
            setPage(data.page);
        }).catch(err => {
            console.error(err);
            navigate("/jobs");
        }).finally(() => {
            setIsLoading(false);
        });

    }, [jobId, navigate, page]);

    return (
        <>
            <h2 className="text-3xl font-semibold mb-6 text-purple-500 truncate">Logs for Job : {jobName}</h2>
            <div className="bg-white p-6 mb-6 rounded-xl shadow">
                <div className="flex justify-between text-sm gap-4 items-center text-gray-500 font-medium px-4 mb-2">
          <span>Method</span>
            <span className="text-center sm:text-left flex-1/4 sm:flex-none ">URL</span>
          <span className="hidden sm:block">Time</span>
          <span>Status</span>
          <span>Actions</span>
        </div>
                {isLoading ?
                    (<Loader />) : logs.length === 0 ? (
                        <div className="py-12 text-center text-gray-500 text-sm flex flex-col items-center">
                            <FileWarning className="w-8 h-8 mb-3 text-gray-400" />
                            <p>No logs found for this job.</p>
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
                    )
                }
            </div>
        </>
    );
}
