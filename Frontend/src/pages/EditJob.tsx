import { useEffect, useState } from 'react';
import { Clock, Settings } from 'lucide-react';
import { Common, Advanced, ConfirmMenu, Loader, Popup } from '../components';
import { useParams, useNavigate } from 'react-router-dom';
import type { JobDetails } from '../types'
import { useAppDispatch } from '../hooks';
import { updateJob } from '../slices/jobSlice';
import { jobSchema } from '../schemas/jobSchemas';
import { useConfirmExit } from '../hooks/useConfirmExit';

export default function EditJob() {
    const { jobId } = useParams();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [tab, setTab] = useState<'common' | 'advanced'>('common');
    const [confirmEdit, setConfirmEdit] = useState(false);
    const [confirmAddJsonHeader, setConfirmAddJsonHeader] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [initialJobDetails, setInitialJobDetails] = useState<JobDetails | null>(null);
    const [jobDetails, setJobDetails] = useState<JobDetails>({
        name: '',
        url: 'https://',
        method: 'GET',
        cron: '*/5 * * * *',
        headers: [],
        body: '',
        enabled: true,
        timezone: 'UTC',
        timeout: 30,
        email: true
    });

    const isFilled = JSON.stringify(jobDetails) !== JSON.stringify(initialJobDetails);
    useConfirmExit(isFilled);

    useEffect(() => {
        setIsLoading(true)

        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/jobs/${jobId}`, {
            credentials: "include",
        }).then(async (res) => {
            const data = await res.json();

            if (!res.ok)
                throw new Error(data.message || "Something went wrong, Please try again later.");

            return data;
        })
            .then(res => {
                if (!Array.isArray(res) || res.length === 0) return;
                const job = res[0];
                const details = {
                    name: job.data.name,
                    method: job.data.method,
                    url: job.data.url,
                    enabled: !job.disabled,
                    timezone: job.repeatTimezone,
                    cron: job.repeatInterval,
                    body: job.data.body,
                    email: job.data.email,
                    timeout: job.data.timeout,
                    headers: job.data?.headers && typeof job.data.headers === 'object'
                        ? Object.entries(job.data.headers).map(([key, value]) => ({ key, value: String(value) }))
                        : []
                };
                setJobDetails(details)
                setInitialJobDetails(details);
            }).catch(err => {
                console.error(err);
                navigate("/jobs")
            })
            .finally(() => {
                setIsLoading(false);
            });

    }, [jobId, navigate])


    const handleJobEdit = (e: React.FormEvent) => {
        e.preventDefault();

        const result = jobSchema.safeParse(jobDetails);
        if (!result.success) {
            setMessage({ type: 'error', text: result.error.issues[0].message });
            return;
        }

        const allowBody = ["POST", "PUT", "PATCH"].includes(jobDetails.method?.toUpperCase());
        if (allowBody && jobDetails.body.trim()) {
            try {
                const parsed = JSON.parse(jobDetails.body);
                if (typeof parsed === "object" && parsed !== null) {
                    const hasJsonHeader = jobDetails.headers.some(
                        h => h.key?.toLowerCase() === "content-type" && h.value?.toLowerCase() === "application/json"
                    );
                    if (!hasJsonHeader) {
                        setConfirmAddJsonHeader(true);
                        return;
                    }
                }
            } catch {
                // not JSON, skip
            }
        }

        setConfirmEdit(true);
    };

    const submitEditJob = () => {

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

            if (!res.ok)
                throw new Error(data.message || "Something went wrong, Please try again later.");

            return data;
        })
            .then(data => {
                setMessage({ type: "success", text: data.message });
                dispatch(updateJob(data.job));
                navigate("/jobs");
            }).catch(err => {
                setMessage({ type: "error", text: err.message });
            }).finally(() => {
                setTimeout(() => setMessage(null), 8000);
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

            <form onSubmit={handleJobEdit} className="bg-white p-6 rounded-xl shadow mb-4">
                {message && (<div className='w-full'>
                    <Popup type={message.type} message={message.text} />
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

            {confirmEdit && (
                <ConfirmMenu
                    title='Confirm Edit'
                    message="Are you sure you want to Edit this job?"
                    confirmText="Yes, Edit"
                    confirmColor="bg-purple-500 hover:bg-purple-700 text-white"
                    onConfirm={() => {
                        submitEditJob();
                        setConfirmEdit(false);
                    }}
                    onCancel={() => setConfirmEdit(false)}
                />
            )}

            {confirmAddJsonHeader && (
                <ConfirmMenu
                    title="Add JSON Content-Type?"
                    message="Your request body looks like JSON but no 'Content-Type: application/json' header was found. Add it automatically?"
                    confirmText="Yes, Add"
                    confirmColor="bg-purple-500 hover:bg-purple-700 text-white"
                    onConfirm={() => {
                        setJobDetails(prev => ({
                            ...prev,
                            headers: [...prev.headers, { key: "Content-Type", value: "application/json" }]
                        }));
                        setConfirmAddJsonHeader(false);
                        setConfirmEdit(true);
                    }}
                    onCancel={() => {
                        setConfirmAddJsonHeader(false);
                        setConfirmEdit(true);
                    }}
                />
            )}

        </>
    )
}
