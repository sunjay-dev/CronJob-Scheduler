import { useState } from 'react';
import { Clock, Settings } from 'lucide-react';
import { Common, Advanced, Loader, Popup, ConfirmMenu } from '../components';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks';
import { addJob } from '../slices/jobSlice';
import type { JobDetails } from '../types';
import { jobSchema } from '../schemas/jobSchemas';
import { useConfirmExit } from '../hooks/useConfirmExit';

export default function CreateJob() {
  const [tab, setTab] = useState<'common' | 'advanced'>('common');
  const [isLoading, setIsLoading] = useState(false);
  const [confirmAddJsonHeader, setConfirmAddJsonHeader] = useState(false);
  const user = useAppSelector(state => state.auth.user);
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const initialJobDetails: JobDetails = {
    name: '',
    url: 'https://',
    method: 'GET',
    cron: '*/5 * * * *',
    headers: [],
    body: '',
    enabled: true,
    timezone: user?.timezone || 'UTC',
    timeout: 30,
    email: true
  };

  const [jobDetails, setJobDetails] = useState<JobDetails>(initialJobDetails);

  const isFilled = JSON.stringify(jobDetails) !== JSON.stringify(initialJobDetails);
  useConfirmExit(isFilled, !isLoading);

  const navigate = useNavigate();

  const submitJob = async (job: JobDetails) => {
    setIsLoading(true);

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/jobs`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(job),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Something went wrong.");
        return data;
      })
      .then(data => {
        setMessage({ type: "success", text: data.message });
        dispatch(addJob(data.job));
        navigate("/jobs");
      })
      .catch(err => {
        setMessage({ type: "error", text: err.message });
      })
      .finally(() => {
        setTimeout(() => setMessage(null), 8000);
        setIsLoading(false);
      });
  };

  const handleSubmit = (e: React.FormEvent) => {
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

    submitJob(jobDetails);
  };

  return (
    <>
      {isLoading && <Loader />}
      <h1 className="text-3xl text-purple-600 mb-6">Create Cron Job</h1>

      <div className="flex gap-8 mb-4">
        <button
          type="button"
          onClick={() => setTab('common')}
          className={`flex flex-col items-center text-sm font-medium px-4 py-2 transition-all duration-300 ease-in-out
            ${tab === 'common' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-purple-500'}`}
        >
          <Clock className="w-6 h-6 mb-1 transition-transform duration-300" />
          COMMON
        </button>
        <button
          type="button"
          onClick={() => setTab('advanced')}
          className={`flex flex-col items-center text-sm font-medium px-4 py-2 transition-all duration-300 ease-in-out
            ${tab === 'advanced' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-purple-500'}`}
        >
          <Settings className="w-6 h-6 mb-1 transition-transform duration-300" />
          ADVANCED
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow mb-4">
        {message && (
          <div className='w-full'>
            <Popup type={message.type} message={message.text} />
          </div>
        )}

        <fieldset disabled={isLoading} className='space-y-5'>
          {tab === 'common'
            ? <Common jobDetails={jobDetails} setJobDetails={setJobDetails} />
            : <Advanced jobDetails={jobDetails} setJobDetails={setJobDetails} />
          }

          <button
            disabled={isLoading}
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-md transition"
          >
            Create Job
          </button>
        </fieldset>
      </form>
      {confirmAddJsonHeader && (
        <ConfirmMenu
          title="Add JSON Content-Type?"
          message="Your request body looks like JSON but no 'Content-Type: application/json' header was found. Add it automatically?"
          confirmText="Yes, Add"
          confirmColor="bg-purple-500 hover:bg-purple-700 text-white"
          onConfirm={() => {
            const updatedJob = {
              ...jobDetails,
              headers: [...jobDetails.headers, { key: "Content-Type", value: "application/json" }]
            };
            setConfirmAddJsonHeader(false);
            submitJob(updatedJob);
          }}
          onCancel={() => {
            setConfirmAddJsonHeader(false);
            submitJob(jobDetails);
          }}
        />
      )}
    </>
  );
}
