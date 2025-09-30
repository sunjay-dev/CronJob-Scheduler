
const handleGoogleAuth = () => {
    window.open(`${import.meta.env.VITE_BACKEND_URL}/auth/google`, '_self');
}

export default function GoogleAuth({ text, lastUsed }: { text: string, lastUsed: boolean }) {

    return (
        <div className="relative w-full">
            {lastUsed && (
                <span className="absolute top-0 z-20 select-none right-0 transform translate-x-1/4 -translate-y-1/4 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full shadow">
                    Last used
                </span>
            )}

            <button
                onClick={handleGoogleAuth}
                type="button"
                className="w-full border bg-white border-gray-300 py-1.5 rounded-md flex items-center justify-center gap-2 hover:bg-gray-50 transition text-sm relative"
            >
                <img src="/google.webp" alt="Google" className="w-4 h-4" />
                <span>{text}</span>
            </button>
        </div>
    )
}
