import { Pencil, FileText } from 'lucide-react';

interface Props {
  jobName: string;
  method: string;
  url:string;
}

export default function JobCard({jobName,method, url}: Props) {
  return (
    <div className="bg-white cursor-pointer hover:shadow-sm border border-gray-300 rounded-lg p-4 transition grid grid-cols-1 md:grid-cols-[3fr_1.5fr_1fr_1fr_1fr] items-center text-sm gap-4">
     <div>
        <h2 className="font-semibold text-gray-800">{jobName}</h2>
        <p className="text-xs text-gray-500 uppercase">{method} • {url}</p>
      </div>

      <div className="text-gray-700 text-sm truncate">
        {new Date('2025-07-09T11:50:00.000Z').toLocaleString()}
      </div>

      <div>
        <span className="text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
          Enabled
        </span>
      </div>

      <div className="flex justify-start md:justify-center">
        <button className="flex items-center gap-1 hover:underline">
          <Pencil className="w-4 h-4" />
          Edit
        </button>
      </div>

      <div className="flex justify-start md:justify-center">
        <button className="flex items-center gap-1 hover:underline">
          <FileText className="w-4 h-4" />
          History
        </button>
      </div>
    </div>
  );
}
