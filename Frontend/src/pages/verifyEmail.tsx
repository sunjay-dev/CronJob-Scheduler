import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function VerifyEmail() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email...");
  const [countdown, setCountdown] = useState<number | null>(null);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/verify-email/`, {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });
        const data = await res.json();

        if (res.ok) {
          setStatus("success");
          setMessage(data.message || "Email verified successfully!");
          setRedirectTo("/jobs");
          setCountdown(3);
        } else {
          setStatus("error");
          setMessage(data.message || "Verification failed.");
          setRedirectTo("/login");
          setCountdown(5);
        }
      } catch {
        setStatus("error");
        setMessage("Something went wrong. Please try again later.");
        setRedirectTo("/login");
        setCountdown(5);
      }
    };

    verifyEmail();
  }, [token]);

  useEffect(() => {
    if (countdown === null || redirectTo === null) return;

    if (countdown === 0) {
      navigate(redirectTo);
      return;
    }

    const timer = setTimeout(() => setCountdown((prev) => (prev !== null ? prev - 1 : null)), 1000);
    return () => clearTimeout(timer);
  }, [countdown, redirectTo, navigate]);

  return (
    <div className="font-[Inter] min-h-screen flex items-center justify-center bg-purple-50">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-md border border-white text-center">
        {/* LOADING */}
        {status === "loading" && (
          <>
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-700">{message}</p>
          </>
        )}

        {/* SUCCESS */}
        {status === "success" && (
          <>
            <div className="w-16 h-16 rounded-full bg-purple-500 flex items-center justify-center mx-auto">
              <Check className="text-white w-8 h-8 stroke-[3]" />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-purple-600">Email Verified</h2>
            <p className="mt-2 text-gray-600">{message}</p>
            {countdown !== null && (
              <p className="mt-3 text-sm text-gray-500">
                Redirecting to <span className="font-medium">Jobs</span> in {countdown}s...
              </p>
            )}
          </>
        )}


        {/* ERROR */}
        {status === "error" && (
          <>
            <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center mx-auto">
              <X className="text-white w-8 h-8 stroke-[3]" />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-red-500">Verification Failed</h2>
            <p className="mt-2 text-gray-600">{message}</p>
            {countdown !== null && (
              <p className="mt-3 text-sm text-gray-500">
                Redirecting to <span className="font-medium">Login</span> in {countdown}s...
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
