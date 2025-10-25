import { Pencil, FileText, MoreVertical, Trash2, CheckCircle, XCircle, PauseCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { ConfirmMenu } from '../common';
import type { JobCardProps } from '../../types';

export default function JobCard({ _id, jobName, method, url, nextRunAt, lastRunAt, disabled = false, handleDeleteJob, handleChangeStatus, timeFormat24 }: JobCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  console.log(timeFormat24)

  const formattedTime_NextRunAt = new Date(nextRunAt).toLocaleTimeString('en-US', {
    hour12: !timeFormat24,
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const formattedTime_LastRunAt = new Date(lastRunAt).toLocaleTimeString('en-US', {
    hour12: !timeFormat24,
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);


  return (
    <div className="bg-white cursor-pointer border border-gray-300 rounded-lg p-4 transition grid grid-cols-1 md:grid-cols-[2.5fr_1.5fr_1.5fr_1fr_1fr_1fr_40px] items-center text-sm gap-4 relative">

      <div className="overflow-hidden">
        <h2 title={jobName} className="font-semibold text-gray-800 truncate">{jobName}</h2>
        <p title={url} className="text-gray-500 lowercase truncate max-w-[250px] whitespace-nowrap overflow-hidden text-ellipsis">
          <span className="uppercase">{method}</span> • {url}
        </p>
      </div>

      {lastRunAt ? (<div title={formattedTime_LastRunAt} className="text-gray-700 truncate">
        {formattedTime_LastRunAt}
      </div>) : <span className='text-center'>-</span>}


      {disabled ? (
        <span title='Job Paused' className="flex items-center justify-center gap-1 text-gray-400 italic">
          <PauseCircle className="w-4 h-4" />
          Paused
        </span>
      ) : (
        <div title={formattedTime_NextRunAt} className="text-gray-700 truncate">
          {formattedTime_NextRunAt}
        </div>
      )}

      <div className='text-center'>
        {disabled ? (
          <span className="text-xs text-red-700 bg-red-100 px-2 py-0.5 rounded-full select-none">disabled</span>
        ) : (
          <span className="text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full select-none">enabled</span>
        )}
      </div>

      <Link title='Edit Job' to={`/job/${_id}/edit`} className="flex hover:text-purple-500 justify-start md:justify-center">
        <button className="flex items-center gap-1 hover:underline">
          <Pencil className="w-4 h-4" />
          Edit
        </button>
      </Link>

      <Link title='View Job Logs' to={`/job/${_id}/logs`} className="flex justify-start hover:text-purple-500 md:justify-center items-center">
        <button className="flex items-center gap-1 hover:underline">
          <FileText className="w-4 h-4" />
          History
        </button>
      </Link>

      <div className="relative text-center" ref={menuRef}>
        <button onClick={() => setOpen(!open)} className="px-1 py-1.5 rounded hover:bg-gray-100">
          <MoreVertical className="w-5 h-5" />
        </button>

        {open && (
          <div className="absolute right-0 z-20 mt-2 w-36 bg-white border border-gray-200 rounded shadow-md text-sm">

            <button title='Delete Job'
              className="w-full flex items-center gap-2 text-left px-4 py-2 hover:bg-gray-100"
              onClick={() => {
                setOpen(false);
                setConfirmDelete(true);
              }}
            >
              <Trash2 className="w-4 h-4 text-red-500" />
              Delete
            </button>

            <button title='Enable Job'
              className={`w-full flex items-center gap-2 text-left px-4 py-2 ${!disabled ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'
                }`}
              disabled={!disabled}
              onClick={() => handleChangeStatus(_id, true)}
            >
              <CheckCircle className={`w-4 h-4 ${!disabled ? 'text-gray-400' : 'text-green-600'}`} />
              Enable
            </button>

            <button title='Disable Job' className={`w-full flex items-center gap-2 text-left px-4 py-2 ${disabled ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'}`}
              disabled={disabled}
              onClick={() => handleChangeStatus(_id, false)}
            >
              <XCircle className={`w-4 h-4 ${disabled ? 'text-gray-400' : 'text-yellow-500'}`} />
              Disable
            </button>
          </div>

        )}
      </div>
      {confirmDelete &&
        <ConfirmMenu
          title='Confirm Deletion'
          message="Are you sure you want to delete this job?"
          confirmText="Yes, Delete"
          confirmColor="bg-red-500 hover:bg-red-700 text-white"
          onConfirm={() => {
            handleDeleteJob(_id);
            setConfirmDelete(false);
          }}
          onCancel={() => setConfirmDelete(false)}
        />
      }

    </div>
  );
}
