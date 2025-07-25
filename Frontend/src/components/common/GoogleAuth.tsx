const handleGoogleAuth = () => {
    window.open(`${import.meta.env.VITE_BACKEND_URL}/auth/google`, '_self');
  } 

export default function GoogleAuth({text}: {text: string}) {
    return (
        <button onClick={handleGoogleAuth} type="button" className="w-full border border-gray-300 py-1.5 rounded-md flex items-center justify-center gap-2 hover:bg-gray-50 transition text-sm">
            <img src="/google.webp" alt="Google" className="w-4 h-4" />
            <span>{text}</span>
        </button>
    )
}
