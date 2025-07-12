import { Pencil, FileText } from 'lucide-react';

interface Props {
  jobName: string;
  method: string;
  url:string;
  nextRunAt:string;
  disabled?: boolean
}

export default function JobCard({jobName,method, url, nextRunAt, disabled=false}: Props) {
  return (
    <div className="bg-white cursor-pointer hover:shadow-sm border border-gray-300 rounded-lg p-4 transition grid grid-cols-1 md:grid-cols-[3fr_1.5fr_1fr_1fr_1fr] items-center text-sm gap-4">
     <div>
        <h2 className="font-semibold text-gray-800 capitalize">{jobName}</h2>
        <p className="text-xs text-gray-500 lowercase"><span className='uppercase'>{method}</span> • {url}</p>
      </div>

      <div className="text-gray-700 text-sm truncate">
        {new Date(nextRunAt).toLocaleString()}
      </div>

      <div>
        {disabled? 
        <span className="text-xs text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
          disabled
        </span>
        : 
        <span className="text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
          enabled
        </span> }
        
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
