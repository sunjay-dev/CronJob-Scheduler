import Cron from 'react-js-cron';
import 'react-js-cron/dist/styles.css';
import { Copy } from 'lucide-react';
import type { JobDetails } from '../types'


interface Props {
  jobDetails: JobDetails;
  setJobDetails: React.Dispatch<React.SetStateAction<JobDetails>>;
}

export default function Common({ jobDetails, setJobDetails }: Props) {
  const { name, url, cron, enabled } = jobDetails;

  return (
    <>
      <div className="border border-gray-200 rounded-lg px-4 py-6 space-y-6">

        <div className="text-base flex flex-col space-y-1">
          <label className="font-medium text-gray-700">Job Name</label>
          <input
            type="text"
            placeholder="e.g. Ping API"
            value={name}
            required
            onChange={(e) => setJobDetails(prev => ({ ...prev, name: e.target.value }))}
            className="border-0 border-b-2 border-gray-400 px-3 py-2 focus:outline-none focus:border-purple-500 transition"
          />
        </div>

        <div className="flex flex-col space-y-1">
          <label className="font-medium text-gray-700">Target URL</label>
          <input
            type="url"
            placeholder="https://example.com/api"
            value={url}
            onChange={(e) => setJobDetails(prev => ({ ...prev, url: e.target.value }))}
            className="border-0 border-b-2 border-gray-400 px-3 py-2 focus:outline-none focus:border-purple-500 transition"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setJobDetails(prev => ({ ...prev, enabled: !enabled }))}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${enabled ? 'bg-purple-600' : 'bg-gray-300'}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
            />
          </button>
          <label className="font-medium text-gray-700">Enable job</label>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg px-4 py-6 space-y-6">
        <div className="flex flex-col space-y-3">
          <label className="font-medium text-gray-700">Schedule</label>
          <div className="overflow-x-auto whitespace-nowrap">
            <Cron
              value={cron}
              setValue={(value: string) =>
                setJobDetails((prev) => ({ ...prev, cron: value }))
              }
              clearButton={false}
              className="!w-full"
            />
          </div>
        </div>

        <div className="flex flex-col space-y-1 mt-4">
          <div className="flex items-center justify-between">
            <label className="font-medium text-gray-700">Cron Expression</label>
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(cron)}
              className="text-gray-500 hover:text-purple-600 transition"
              title="Copy to clipboard"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>

          <input
            type="text"
            value={cron}
            readOnly
            className="text-center border-0 border-b-2 border-gray-400 bg-transparent px-1 py-1 font-mono text-gray-700 focus:outline-none focus:border-purple-500 transition"
          />
        </div>
      </div>
    </>
  );
}

