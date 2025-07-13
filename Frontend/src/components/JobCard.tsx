import { Pencil, FileText, MoreVertical, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

interface Props {
  _id: string;
  jobName: string;
  method: string;
  url: string;
  nextRunAt: string;
  disabled?: boolean;
}

export default function JobCard({ _id, jobName, method, url, nextRunAt, disabled = false }: Props) {
  const backendUrl = import.meta.env.VITE_BACKEND_URL!;
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleDeleteJob = () => {
    fetch(`${backendUrl}/api/jobs/${_id}`, {
      method: "DELETE",
      credentials: "include"
    }).then(async (res) => {
      const data = await res.json();
      console.log(data);

      if (!res.ok)
        throw new Error(data.message || "Something went wrong");

      return data;
    })
      .then(data => {
        console.log(data);
        alert(data.message)
      }).catch(err => console.log(err))
  }

  const handleChangeStatus = (status: boolean) => {

    fetch(`${backendUrl}/api/jobs/status`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({ jobId: _id, status })
    }).then(async (res) => {
      const data = await res.json();
      console.log(data);

      if (!res.ok)
        throw new Error(data.message || "Something went wrong");

      return data;
    })
      .then(data => {
        console.log(data);
        alert(data.message)
      }).catch(err => console.log(err))
  }

  return (
    <div className="bg-white cursor-pointer hover:shadow-sm border border-gray-300 rounded-lg p-4 transition grid grid-cols-1 md:grid-cols-[3fr_1.5fr_1fr_1fr_1fr_50px] items-center text-sm gap-4 relative">
      <div>
        <h2 className="font-semibold text-gray-800">{jobName}</h2>
        <p className="text-xs text-gray-500 lowercase">
          <span className="uppercase">{method}</span> • {url}
        </p>
      </div>
      
      <div title={new Date(nextRunAt).toLocaleString()} className="text-gray-700 text-sm truncate">
        {new Date(nextRunAt).toLocaleString()}
      </div>

      <div>
        {disabled ? (
          <span className="text-xs text-red-700 bg-red-100 px-2 py-0.5 rounded-full">disabled</span>
        ) : (
          <span className="text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full">enabled</span>
        )}
      </div>

      <Link to={`/job/${_id}/edit`} className="flex justify-start md:justify-center">
        <button className="flex items-center gap-1 hover:underline">
          <Pencil className="w-4 h-4" />
          Edit
        </button>
      </Link>

      <Link to={`/jobs/${_id}`} className="flex justify-start md:justify-center items-center">
        <button className="flex items-center gap-1 hover:underline">
          <FileText className="w-4 h-4" />
          History
        </button>
      </Link>

      <div className="relative text-end" ref={menuRef}>
        <button onClick={() => setOpen(!open)} className="p-1 rounded hover:bg-gray-100">
          <MoreVertical className="w-5 h-5" />
        </button>

        {open && (
          <div className="absolute right-0 z-20 mt-2 w-36 bg-white border border-gray-200 rounded shadow-md text-sm">

            <button
              className="w-full flex items-center gap-2 text-left px-4 py-2 hover:bg-gray-100"
              onClick={handleDeleteJob}
            >
              <Trash2 className="w-4 h-4 text-red-500" />
              Delete
            </button>

            <button
              className={`w-full flex items-center gap-2 text-left px-4 py-2 ${!disabled ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'
                }`}
              disabled={!disabled}
              onClick={() => handleChangeStatus(true)}
            >
              <CheckCircle className={`w-4 h-4 ${!disabled ? 'text-gray-400' : 'text-green-600'}`} />
              Enable
            </button>

            <button className={`w-full flex items-center gap-2 text-left px-4 py-2 ${disabled ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'}`}
              disabled={disabled}
              onClick={() => handleChangeStatus(false)}
            >
              <XCircle className={`w-4 h-4 ${disabled ? 'text-gray-400' : 'text-yellow-500'}`} />
              Disable
            </button>
          </div>

        )}
      </div>
    </div>
  );
}
