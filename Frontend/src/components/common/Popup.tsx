import { CheckCircle, XCircle } from "lucide-react";

interface Props {
    type: "success" | "error";
    message: string;
}

export default function Popup({ type, message }: Props) {
    return (
        <div className={`mb-4 flex items-center gap-2 text-sm rounded px-4 py-3 border ${type === 'error' ? 'bg-red-100 border-red-400 text-red-700' : 'bg-green-100 border-green-400 text-green-700'}`}>
            {type === 'error' ? <XCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
            {message}
        </div>
    )
}
