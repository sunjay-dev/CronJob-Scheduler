import { Timer } from 'lucide-react';
import { JobCard } from '../components';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// interface JobInterface {

// }

export default function Jobs() {

  const [jobs, setJobs] = useState();
      useEffect(()=> {
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
          <Link to="/create" className="p-2.5 bg-purple-500 text-white flex items-center gap-1 rounded-sm">
            <Timer  />
            Create Job
          </Link>
        </div>

        <div className="p-6 bg-white rounded-2xl mb-4">
          <div className="hidden md:grid grid-cols-[3fr_1.5fr_1fr_1fr_1fr] text-sm text-gray-600 font-medium px-4 mb-4">
            <span>Title, URL</span>
            <span>Next execution</span>
            <span>Status</span>
            <span className="text-center">Edit</span>
            <span className="text-center">History</span>
          </div>

          <div className="space-y-3">
            {/* {jobs?.map(job => <JobCard />)} */}
            
          </div>
        </div>
      </>
  );
}
