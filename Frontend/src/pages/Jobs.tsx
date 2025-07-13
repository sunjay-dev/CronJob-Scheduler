import { Timer } from 'lucide-react';
import { JobCard } from '../components';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { JobInterface } from '../types'


export default function Jobs() {

  const [jobs, setJobs] = useState<JobInterface[]>([]);
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/jobs`, {
      credentials: 'include',
    })
      .then(async (res) => {
        const data = await res.json();
        console.log(data);

        if (!res.ok)
          throw new Error(data.message || "Something went wrong");

        return data;
      })
      .then(data => {
        console.log(data);
        setJobs(data)
      }).catch(err => console.log(err))

  }, [])

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-normal text-purple-500">Cron jobs</h1>
        <Link to="/create" className="py-2 px-4 bg-purple-500 text-white flex items-center gap-1 rounded-sm active:scale-[0.98]">
          <Timer className='w-5 h-5' />
          Create Job
        </Link>
      </div>
    
      <div className="p-6 bg-white rounded-2xl mb-4">
        <div className="hidden md:grid grid-cols-[3fr_1.5fr_1fr_1fr_1fr_50px] gap-4 text-sm text-gray-600 font-medium px-4 mb-4">
          <span>Title, URL</span>
          <span>Next execution</span>
          <span>Status</span>
          <span className="text-center">Edit</span>
          <span className="text-center">History</span>
          <span className="text-center">Actions</span>
        </div>

        <div className="space-y-3">
          {jobs?.map(job =>
            <JobCard key={job._id}
              _id={job._id}
              url={job.data.url}
              jobName={job.data.name}
              method={job.data.method}
              nextRunAt={job.nextRunAt}
              disabled={job.disabled ?? false}
            />)}
        </div>
      </div>
    </>
  );
}
