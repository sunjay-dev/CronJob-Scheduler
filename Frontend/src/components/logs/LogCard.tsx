import { useState } from 'react';
import { CheckCircle, XCircle, Clock, EllipsisVertical } from 'lucide-react';
import LogDetails from './LogDetails';
import type { UserLogInterface } from '../../types';


export default function LogCard({ log }: {log: UserLogInterface}) {

  const [openDetailsMenu, setOpenDetailsMenu] = useState<boolean>(false);
  const isSuccess = log.status === 'success';

  return (
    <>
      <div className="grid grid-cols-[1fr_2fr_2fr_2fr_1fr] items-center gap-4 bg-white p-4 mb-2 rounded-md border border-gray-200 text-sm whitespace-nowrap">
        <div className="overflow-hidden">
          <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded font-medium uppercase">
            {log.method}
          </span>
        </div>
        <span className="truncate text-gray-700">{log.url}</span>

        <div className="flex items-center gap-2 text-gray-500">
          <Clock className="w-4 h-4" />
          <span>{new Date(log.createdAt).toLocaleTimeString()}</span>
        </div>

        <div className={`flex items-center gap-1 font-medium ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
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

        <button onClick={() => setOpenDetailsMenu(true)} className="flex gap-1 items-center justify-center border border-gray-300 hover:bg-gray-100 rounded p-1">
          <EllipsisVertical className="h-4 w-4" /> DETAILS
        </button>
      </div>

      {openDetailsMenu && <LogDetails details={log} setOpenDetailsMenu={setOpenDetailsMenu} />}
    </>
  );
}
