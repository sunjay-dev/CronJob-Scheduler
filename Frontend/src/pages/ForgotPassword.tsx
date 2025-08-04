import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader, Popup } from "../components";

export default function ForgetPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) return;

    setIsLoading(true);
    setMessage(null);

      fetch(`${import.meta.env.VITE_BACKEND_URL}/forgot-password`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }).then(async (res) => {

        const data = await res.json();
  
        if (!res.ok) throw new Error(data.message || "Something went wrong, Please try again later.");
  
        setMessage({ type: "success", text: "Reset link sent to your email" });
      }).catch(err => {
      setMessage({ type: "error", text: err.message || "Failed to send reset link, Please try again later." });
    }).finally (() => {
      setEmail("")
      setIsLoading(false);
    })
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="font-[Inter] selection:bg-purple-500 selection:text-white h-dvh w-dvw grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        <div className="flex flex-col px-8 md:px-6 py-6">
          <Link to="/login"> 
          <img src="/logo.webp" alt="logo" className="md:ml-2 h-10 w-10 mb-8" />
          </Link>

          <div className="flex-grow flex flex-col justify-center items-center">
            <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold text-purple-500">Forgot Your Password?</h1>
                <p className="text-sm text-gray-500">Enter your email and we’ll send you a reset link.</p>
              </div>

              {message && <Popup type={message.type} message={message.text} />}

              <div className="flex flex-col space-y-1">
                <label htmlFor="email" className="text-sm font-medium">Email address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  placeholder="you@example.com"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-md text-sm transition"
              >
                Send Reset Link
              </button>

              <p className="text-center text-sm text-gray-600">
                Remember your password?{' '}
                <Link to="/login" className="text-purple-500 hover:underline">Back to login</Link>
              </p>
            </form>
          </div>
        </div>

        <div className="bg-purple-100 hidden md:flex items-center justify-center">
          <img
            src="/Forgot-password.png"
            alt="Forgot password illustration"
            className="max-w-sm"
          />
        </div>
      </div>
    </>
  );
}
