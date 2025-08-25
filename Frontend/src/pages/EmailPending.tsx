import { useState } from "react";
import { Mail } from "lucide-react";
import { Footer } from "../components";

export default function EmailPending() {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        setMessage("Verification email has been resent.");
      } else {
        setMessage("Failed to resend verification email. Please try again.");
      }
    } catch {
      setMessage("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-[Inter] min-h-screen flex flex-col bg-white">
      {/* Header with logo */}
      <header className="p-4">
        <img src="/logo.webp" alt="Cronjon Logo" className="h-10" />
      </header>

      {/* Main section */}
      <main className="flex flex-col flex-grow items-center justify-center text-center px-4">
        <div className="w-16 h-16 rounded-full bg-purple-500 flex items-center justify-center mb-4">
          <Mail className="text-white" size={28} />
        </div>

        <h1 className="text-2xl font-bold text-purple-500">Verify Your Email</h1>
        <p className="mt-2 text-gray-600 max-w-md">
          We’ve sent a verification link to your email. Please check your inbox
          and click the link to activate your account.
        </p>

        {message && (
          <p className="mt-4 text-sm text-gray-500 transition-opacity duration-300">
            {message}
          </p>
        )}

        <button
          className={`mt-6 px-5 py-3 rounded text-white font-medium transition-colors ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-purple-500 hover:bg-purple-600"
          }`}
          onClick={handleResend}
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? "Resending..." : "Resend Email"}
        </button>

        <p className="mt-3 text-xs text-gray-500">
          Didn’t get the email? Check your spam folder or resend it.
        </p>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
