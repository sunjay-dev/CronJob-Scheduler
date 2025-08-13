import { useEffect } from 'react';
import type { JobDetails } from '../../types'
import Headers  from './Headers'
interface Props {
  jobDetails: JobDetails;
  setJobDetails: React.Dispatch<React.SetStateAction<JobDetails>>;
}

export default function Advanced({ jobDetails, setJobDetails }: Props) {
  const { method, body, timezone } = jobDetails;
  const allowBody = ["POST", "PUT", "PATCH"].includes(method?.toUpperCase());

  useEffect(() => {
    if (!allowBody)
      setJobDetails(pre => ({ ...pre, body: "" }));

  }, [allowBody, setJobDetails])

  return (
    <>
      <div className="border border-gray-200 rounded-lg px-4 py-6 space-y-6">
        <div className="text-base flex flex-col space-y-2">
          <div className="flex flex-col space-y-2">
            <label className="font-medium text-gray-700">HTTP Method</label>
            <select
              value={method}
              onChange={e =>
                setJobDetails(prev => ({ ...prev, method: e.target.value }))
              }
              className="border-0 border-b-2 border-gray-400 px-3 py-2 focus:outline-none focus:border-purple-500 transition"
            >
              <option>GET</option>
              <option>POST</option>
              <option>PUT</option>
              <option>DELETE</option>
              <option>HEAD</option>
              <option>OPTIONS</option>
              <option>PATCH</option>
              <option>TRACE</option>
            </select>
          </div>

          <label className="font-medium text-gray-700">Request Body</label>
          <textarea
            rows={4}
            value={body}
            disabled={!allowBody}
            onChange={(e) =>
              setJobDetails(prev => ({ ...prev, body: e.target.value }))
            }
            className="border border-gray-300 resize-none rounded px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      <Headers jobDetails={jobDetails} setJobDetails={setJobDetails} />

      <div className="border border-gray-200 rounded-lg px-4 py-6 space-y-6">
        <div className="flex flex-col space-y-2">
          <label className="font-medium text-gray-700">Timezone</label>
          <select
            value={timezone}
            onChange={e =>
              setJobDetails(prev => ({ ...prev, timezone: e.target.value }))
            }
            className="border-0 border-b-2 border-gray-400 px-3 py-2 focus:outline-none focus:border-purple-500 transition"
          >
            <option value="UTC">UTC</option>
            <option value="Asia/Karachi">Asia/Karachi</option>
            <option value="Asia/Kolkata">Asia/Kolkata</option>
            <option value="Asia/Dubai">Asia/Dubai</option>
            <option value="Europe/London">Europe/London</option>
            <option value="America/New_York">America/New_York</option>
            <option value="America/Los_Angeles">America/Los_Angeles</option>
          </select>
        </div>
      </div>
    </>
  );
}


