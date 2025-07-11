import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface LogCardProps {
  timestamp: string;
  url: string;
  method: string;
  status: 'success' | 'failed';
}

export default function LogCard({ timestamp, url, method, status }: LogCardProps) {
  const isSuccess = status === 'success';

  return (
    <div className="grid grid-cols-[1fr_2fr_2fr_1fr] items-center gap-4 bg-white p-4 mb-2 rounded-md border border-gray-200 text-sm">
     
      <div className=" overflow-hidden">
        <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded font-medium uppercase shrink-0">
          {method}
        </span>
      </div>
        <span className="truncate text-gray-700">{url}</span>

     <div className="flex items-center gap-2 text-gray-500">
        <Clock className="w-4 h-4" />
        <span>{new Date(timestamp).toLocaleTimeString()}</span>
      </div>

     <div className={`flex items-center gap-1 justify-center font-medium ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
        {isSuccess ? (
          <>
            <CheckCircle className="w-4 h-4" />
            <span>Success</span>
          </>
        ) : (
          <>
            <XCircle className="w-4 h-4" />
            <span>Failed</span>
          </>
        )}
      </div>
    </div>
  );
}
