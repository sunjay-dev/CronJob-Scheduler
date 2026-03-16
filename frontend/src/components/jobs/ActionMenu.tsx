import { CheckCircle, Trash2, XCircle, Pencil, FileText } from "lucide-react";
import { Link } from "react-router-dom";

type Props = {
  setConfirmDelete: (value: boolean) => void;
  setOpen: (value: boolean) => void;
  handleChangeStatus: (_id: string, enable: boolean) => void;
  disabled: boolean;
  _id: string;
};

export default function ActionMenu({ setConfirmDelete, setOpen, handleChangeStatus, disabled, _id }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded shadow-md text-sm flex flex-col">
      <Link to={`/job/${_id}/edit`} onClick={() => setOpen(false)} className="w-full sm:hidden flex items-center gap-2 px-4 py-2 hover:bg-gray-100">
        <Pencil className="w-4 h-4 text-blue-500" /> Edit
      </Link>

      <Link to={`/job/${_id}/logs`} onClick={() => setOpen(false)} className="sm:hidden w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100">
        <FileText className="w-4 h-4 text-purple-500" /> History
      </Link>

      <button
        disabled={!disabled}
        className={`w-full flex items-center gap-2 px-4 py-2 ${!disabled ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-100"}`}
        onClick={() => handleChangeStatus(_id, true)}
      >
        <CheckCircle className={`w-4 h-4 ${!disabled ? "text-gray-400" : "text-green-600"}`} /> Enable
      </button>

      <button
        disabled={disabled}
        className={`w-full flex items-center gap-2 px-4 py-2 ${disabled ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-100"}`}
        onClick={() => handleChangeStatus(_id, false)}
      >
        <XCircle className={`w-4 h-4 ${disabled ? "text-gray-400" : "text-yellow-500"}`} /> Disable
      </button>

      <button
        className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
        onClick={() => {
          setOpen(false);
          setConfirmDelete(true);
        }}
      >
        <Trash2 className="w-4 h-4 text-red-500" /> Delete
      </button>
    </div>
  );
}
