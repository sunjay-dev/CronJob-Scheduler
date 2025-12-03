import { useState } from 'react';
import { Clock, Settings } from 'lucide-react';
import { Common, Advanced, Loader, Popup, ConfirmMenu } from '../components';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks';
import { addJob } from '../slices/jobSlice';
import type { JobDetails } from '../types';
import { jobSchema } from '../schemas/jobSchemas';
import { useConfirmExit } from '../hooks/useConfirmExit';
import { useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function CreateJob() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'common' | 'advanced'>('common');
  const [confirmAddJsonHeader, setConfirmAddJsonHeader] = useState(false);
  const user = useAppSelector(state => state.auth.user);
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const { register, handleSubmit, control, watch, setValue, formState: { isDirty, isSubmitting, isSubmitted, errors } } = useForm<JobDetails>(
    {
      resolver: zodResolver(jobSchema),
      defaultValues: {
        name: '',
        url: 'https://',
        method: 'GET',
        cron: '*/5 * * * *',
        headers: [],
        body: '',
        enabled: true,
        timezone: user?.timezone || 'UTC',
        timeout: 30,
        email: user?.emailNotifications
      }
    }
  );

  const onError = (errors: FieldErrors<JobDetails>) => {
    if (errors.name || errors.url) setTab('common');
    if (Object.keys(errors).length > 0)
      setMessage({ type: 'error', text: Object.values(errors)[0]?.message as string || 'Please fix the errors in the form.' });
    else
      setMessage(null);
  }

  useConfirmExit(isDirty, !isSubmitted && !isSubmitting);

  const submitJob = async (job: JobDetails) => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/jobs`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(job),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Something went wrong, please try again.");
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
      });
  };

  const onSubmit = (job: JobDetails) => {

    const allowBody = ["POST", "PUT", "PATCH"].includes(job.method?.toUpperCase());
    if (allowBody && job.body.trim()) {
      try {
        const parsed = JSON.parse(job.body);
        if (typeof parsed === "object" && parsed !== null) {
          const hasJsonHeader = job.headers?.some(
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

    submitJob(job);
  };

  return (
    <>
      {isSubmitting && <Loader />}
      <h1 className="text-3xl font-semibold text-purple-600 mb-6">Create Cron Job</h1>

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

      <form onSubmit={handleSubmit(onSubmit, onError)} className="bg-white p-6 rounded-xl shadow mb-4">
        {message && (
          <div className='w-full'>
            <Popup type={message.type} message={message.text} />
          </div>
        )}

        <fieldset disabled={isSubmitting} className='space-y-5'>
          {tab === 'common'
            ? <Common register={register} control={control} watch={watch} errors={errors} emailNotifications={user?.emailNotifications} />
            : <Advanced register={register} control={control} setValue={setValue} watch={watch} />
          }

          <button
            disabled={isSubmitting}
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
            setValue("headers", [
              ...(watch("headers") || []),
              { key: "Content-Type", value: "application/json" }
            ]);
            setConfirmAddJsonHeader(false);
            submitJob(watch());
          }}
          onCancel={() => {
            setConfirmAddJsonHeader(false);
            submitJob(watch());
          }}
        />
      )}
    </>
  );
}
