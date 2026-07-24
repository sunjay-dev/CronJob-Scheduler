import { useEffect, useState } from "react";
import logo from "@/assets/images/logo.webp";

export default function OfflineOverlay() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div
      className="fixed inset-0 z-9999 flex flex-col items-center justify-center text-center text-white p-4"
      style={{ background: "linear-gradient(135deg, #7c3aed, #4c1d95)" }}
    >
      <img src={logo} alt="CronJob Scheduler Logo" className="w-20 h-20 mb-4" />
      <h1 className="text-3xl font-bold mb-2">You&apos;re Offline</h1>
      <p className="text-base opacity-90 max-w-xs mb-6">
        It seems you&apos;ve lost your internet connection. CronJob Scheduler will be available once you&apos;re back
        online.
      </p>
      <button
        onClick={() => location.reload()}
        className="bg-white text-[#4c1d95] border-none rounded-lg px-5 py-2.5 font-semibold text-sm cursor-pointer transition-colors hover:bg-[#f3e8ff]"
      >
        Try Again
      </button>
    </div>
  );
}
