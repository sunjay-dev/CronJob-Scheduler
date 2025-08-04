import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader, Popup } from "../components";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [details, setDetails] = useState({
    password: "",
    confirm: "",
    showPassword: false,
    showConfirm: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const isTokenValid = (token?: string): boolean => {
    if (!token) return false;
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    try {
      const decoded = JSON.parse(atob(parts[1]));
      return typeof decoded === "object";
    } catch {
      return false;
    }
  };

  useEffect(() => {
    if (!isTokenValid(token)) {
      setMessage({ type: "error", text: "Invalid or tampered token." });
      setTimeout(() => navigate("/"), 3000);
    }
  }, [navigate, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { password, confirm } = details;

    if (!password || !confirm) {
      setMessage({ type: "error", text: "Both fields are required." });
      return;
    }

    if (password !== confirm) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      setMessage({ type: "success", text: "Password reset successful. Redirecting to login..." });
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to reset password." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="font-[Inter] selection:bg-purple-500 selection:text-white h-dvh w-dvw grid grid-cols-1 md:grid-cols-2 overflow-x-hidden">
        <div className="flex flex-col px-8 md:px-6 py-6">
          <img src="/logo.webp" alt="logo" className="md:ml-2 h-10 w-10 mb-8" />

          <div className="flex-grow flex flex-col justify-center items-center">
            <form onSubmit={handleSubmit} className="w-full max-w-sm">
              <fieldset disabled={isLoading} className="space-y-4">
                <div className="space-y-1">
                  <h1 className="text-3xl font-bold">Reset Password</h1>
                  <p className="text-sm text-gray-500">Enter your new password below</p>
                </div>

                {message && <Popup type={message.type} message={message.text} />}

                {/* New Password */}
                <div className="flex flex-col space-y-1">
                  <label htmlFor="password" className="text-sm font-medium">New Password</label>
                  <div className="relative flex items-center">
                    <input
                      type={details.showPassword ? "text" : "password"}
                      id="password"
                      value={details.password}
                      onChange={(e) =>
                        setDetails((prev) => ({ ...prev, password: e.target.value }))
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-1.5 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setDetails((prev) => ({ ...prev, showPassword: !prev.showPassword }))
                      }
                      className="absolute right-3 text-gray-500 hover:text-gray-700"
                    >
                      {details.showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col space-y-1">
                  <label htmlFor="confirm" className="text-sm font-medium">Confirm Password</label>
                  <div className="relative flex items-center">
                    <input
                      type={details.showConfirm ? "text" : "password"}
                      id="confirm"
                      value={details.confirm}
                      onChange={(e) =>
                        setDetails((prev) => ({ ...prev, confirm: e.target.value }))
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-1.5 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setDetails((prev) => ({ ...prev, showConfirm: !prev.showConfirm }))
                      }
                      className="absolute right-3 text-gray-500 hover:text-gray-700"
                    >
                      {details.showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2 rounded-md text-sm transition"
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </button>
              </fieldset>
            </form>
          </div>
        </div>

        <div className="bg-purple-100 hidden md:flex items-center justify-center">
          <img src="/ResetPassword.webp" alt="Illustration" className="max-w-sm" />
        </div>
      </div>
    </>
  );
}
