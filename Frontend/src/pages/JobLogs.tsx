import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { UserLogInterface } from '../types';
import { LogCard, Pagination } from '../components';

export default function JobLogs() {
    const [jobName, setJobName] = useState('')
    const limit = 10
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { jobId } = useParams();
    const [logs, setLogs] = useState<UserLogInterface[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/logs/${jobId}/?page=${page}&limit=${limit}`, {
            credentials: "include"
        }).then(async (res) => {
            const data = await res.json();
            console.log(data);

            if (!res.ok)
                throw new Error(data.message || "Something went wrong");

            return data;
        }).then(data => {
            console.log(data);
            
            setJobName(data?.logs[0]?.name)
            setLogs(data.logs);
            setTotalPages(data.totalPages);
            setPage(data.page);
        }).catch(err => console.log(err))
            .finally(() => {
                setLoading(false);
            })

    }, [jobId, page]);

    if (loading) return <div className="p-4">Loading logs...</div>;

    return (
        <>
            <h2 className="text-3xl font-normal mb-6 text-purple-500 truncate">Logs for Job : {jobName}</h2>
            <div className="bg-white p-6 mb-6 rounded-xl shadow">
                <div className="grid grid-cols-[1fr_2fr_2fr_1fr] text-sm gap-4 items-center text-gray-500 font-medium px-4 mb-2">
                    <span>Method</span>
                    <span>URL</span>
                    <span>Time</span>
                    <span className="text-center">Status</span>
                </div>

                <div className="text-sm text-gray-600 space-y-1">
                    {logs?.map(log =>
                        <LogCard key={log._id} timestamp={log.createdAt}
                            url={log.url}
                            method={log.method}
                            status={log.status} />
                    )}
                </div>
                <Pagination page={page} setPage={setPage} totalPages={totalPages} />
            </div>
        </>
    );
}
