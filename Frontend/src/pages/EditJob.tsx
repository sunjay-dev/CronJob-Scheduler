import { useEffect, useState } from 'react';
import { Clock, Settings } from 'lucide-react';
import { Common, Advanced, ConfirmMenu, Loader, Popup } from '../components';
import { useParams, useNavigate } from 'react-router-dom';
import type { JobDetails, JobResponse } from '../types'
import { useAppDispatch } from '../hooks';
import { updateJob } from '../slices/jobSlice';

export default function EditJob() {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [tab, setTab] = useState<'common' | 'advanced'>('common');
    const [confirmEdit, setConfirmEdit] = useState(false);
    const [response, setResponse] = useState<JobResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [jobDetails, setJobDetails] = useState<JobDetails>({
        name: '',
        url: 'https://',
        method: 'GET',
        cron: '*/5 * * * *',
        headers: [],
        body: '',
        enabled: true,
        timezone: 'UTC'
    });

    const dispatch = useAppDispatch();

    useEffect(() => {
        setIsLoading(true)

        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/jobs/${jobId}`, {
            credentials: "include",
        }).then(async (res) => {
            const data = await res.json();

            if (!res.ok)
                throw new Error(data.message || "Something went wrong");

            return data;
        })
            .then(res => {
                if (!Array.isArray(res) || res.length === 0) return;
                const job = res[0];

                console.log(job);
                setJobDetails({
                    name: job.data.name,
                    method: job.data.method,
                    url: job.data.url,
                    enabled: !job.disabled,
                    timezone: job.repeatTimezone,
                    cron: job.repeatInterval,
                    body: '',
                    headers: job.data?.headers && typeof job.data.headers === 'object'
                        ? Object.entries(job.data.headers).map(([key, value]) => ({ key, value: String(value) }))
                        : []
                })

            }).catch(err => {
                console.log(err);
                navigate('/jobs')
            })
            .finally(() => {
                setIsLoading(false);
            });

    }, [jobId, navigate])

    const handleEditJob = () => {

        if (!jobDetails.url.trim() || !jobDetails.cron.trim()) {
            alert('Please fill required fields');
            return;
        }

        setIsLoading(true);
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/jobs/${jobId}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jobDetails),
        }).then(async (res) => {
            const data = await res.json();
            console.log(data);

            if (!res.ok)
                throw new Error(data.message || "Something went wrong");

            return data;
        })
            .then(data => {
                setResponse({ type: "success", message: data.message });
                dispatch(updateJob(data.job));
                navigate('/jobs');
            }).catch(err => {
                setResponse({ type: "error", message: err.message });
            }).finally(() => {
                setTimeout(() => setResponse(null), 8000);
                setIsLoading(false);
            })
    };

    return (
        <>
            {isLoading && <Loader />}
            <h1 className="text-3xl text-purple-600 mb-6">Edit Cron Job</h1>

            <div className="flex gap-8 mb-4">
                <button
                    type="button"
                    onClick={() => setTab('common')}
                    className={`flex flex-col items-center text-sm font-medium px-4 py-2 
      transition-all duration-300 ease-in-out
      ${tab === 'common'
                            ? 'text-purple-600 border-b-2 border-purple-600'
                            : 'text-gray-500 hover:text-purple-500'
                        }`}
                >
                    <Clock className="w-6 h-6 mb-1 transition-transform duration-300" />
                    COMMON
                </button>

                <button
                    type="button"
                    onClick={() => setTab('advanced')}
                    className={`flex flex-col items-center text-sm font-medium px-4 py-2 
      transition-all duration-300 ease-in-out
      ${tab === 'advanced'
                            ? 'text-purple-600 border-b-2 border-purple-600'
                            : 'text-gray-500 hover:text-purple-500'
                        }`}
                >
                    <Settings className="w-6 h-6 mb-1 transition-transform duration-300" />
                    ADVANCED
                </button>
            </div>

            <form onSubmit={e => { e.preventDefault(); setConfirmEdit(true); }} className="bg-white p-6 rounded-xl shadow mb-4">
                {response && (<div className='w-full'>
                    <Popup type={response.type} message={response.message} />
                </div>)}
                <fieldset disabled={isLoading} className='space-y-5'>
                    {tab === 'common' ? (
                        <Common jobDetails={jobDetails} setJobDetails={setJobDetails} />
                    ) : (
                        <Advanced jobDetails={jobDetails} setJobDetails={setJobDetails} />
                    )}

                    <button
                        disabled={isLoading}
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-md transition"
                    >
                        Edit Job
                    </button>
                </fieldset>
            </form>

            {confirmEdit &&
                <ConfirmMenu
                    title='Confirm Edit'
                    message="Are you sure you want to Edit this job?"
                    confirmText="Yes, Edit"
                    confirmColor="bg-purple-500 hover:bg-purple-700 text-white"
                    onConfirm={() => {
                        handleEditJob();
                        setConfirmEdit(false);
                    }}
                    onCancel={() => setConfirmEdit(false)}
                />
            }
        </>
    )
}
