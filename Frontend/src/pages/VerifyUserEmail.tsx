import { useEffect, useState } from "react";
import { Popup, Loader, Footer } from "../components";
import { Link, useNavigate, useParams } from "react-router-dom";
import { verifyUserSchema, verifyUserIdSchema } from "../schemas/authSchemas";

export default function VerifyEmail() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    const result = verifyUserIdSchema.safeParse({ userId });
    if (!result.success) {
      setMessage({ type: "error", text: result.error.issues[0].message });
      navigate("/login");
    }
  }, [navigate, userId]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = verifyUserSchema.safeParse({ otp });

    if (!result.success) {
      setMessage({ type: "error", text: result.error.issues[0].message });
      return;
    }

    setIsLoading(true);

    fetch(`${import.meta.env.VITE_BACKEND_URL}/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ otp, userId }),
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          if (res.status === 409) {
            setTimeout(() => navigate("/login"), 2500);
            return Promise.reject(new Error("User is already verified. Please login to continue"));
          }
          return Promise.reject(new Error(data.message || "Something went wrong, Please try again later."));
        }

        return data;
      })
      .then((data) => {
        setMessage({ type: "success", text: data.message });
        setTimeout(() => navigate("/jobs"), 1000);
      })
      .catch((err) => {
        setMessage({ type: "error", text: err.message || "Something went wrong. Please try again." });
      })
      .finally(() => {
        setOtp("");
        setIsLoading(false);
      });
  };

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleResend = async () => {
    if (resendTimer > 0) return;

    setIsLoading(true);

    fetch(`${import.meta.env.VITE_BACKEND_URL}/resend-otp`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          if (res.status == 429) {
            setResendTimer(data.wait || 60);
            setTimeout(() => setMessage(null), 3000);
            throw new Error(data.message || "Please wait before requesting again.");
          } else if (res.status == 404) {
            setTimeout(() => navigate("/login"), 2000);
            throw new Error(data.message || "User not found.");
          }

          throw new Error(data.message || "Something went wrong, Please try again later.");
        }
        return data;
      })
      .then((data) => {
        setMessage({ type: "success", text: data.message });
        setResendTimer(data.wait || 60);
      })
      .catch((err) => {
        setMessage({ type: "error", text: err.message || "Something went wrong. Please try again." });
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="font-[Inter] selection:bg-purple-500 selection:text-white h-dvh w-dvw grid grid-cols-1 md:grid-cols-2 overflow-x-hidden">
        <div className="flex flex-col px-8 md:px-6 py-6">
          <Link to="/login">
            <img src="/logo.webp" alt="logo" className="md:ml-2 h-10 w-10 mb-8" />
          </Link>

          <div className="flex-grow flex flex-col justify-center items-center">
            <form onSubmit={handleVerify} className="w-full max-w-sm">
              <fieldset disabled={isLoading} className="space-y-4">
                <div className="space-y-1">
                  <h1 className="text-3xl font-bold">Verify Your Email</h1>
                  <p className="text-sm text-gray-500">Please enter the 6-digit code we sent to your email.</p>
                </div>

                {message && <Popup type={message.type} message={message.text} />}

                <input
                  type="number"
                  required
                  value={otp}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val.length <= 6) setOtp(val);
                  }}
                  className="w-full border-b border-gray-300 px-3 py-2 text-center tracking-[0.5em] text-xl font-mono 
             focus:outline-none focus:ring-0 focus:ring-offset-0 appearance-none 
             
             [&::-webkit-outer-spin-button]:appearance-none 
             [&::-webkit-inner-spin-button]:appearance-none 
             [-moz-appearance:textfield]"
                  placeholder="______"
                />

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2 rounded-md text-sm transition"
                >
                  Verify
                </button>

                <p className="text-center text-sm text-gray-600">
                  Didn’t get the code?{" "}
                  <button
                    type="button"
                    onClick={handleResend}
                    className={`text-purple-700 hover:underline ${resendTimer > 0 ? "cursor-not-allowed opacity-50" : ""}`}
                    disabled={resendTimer > 0}
                  >
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend"}
                  </button>
                </p>
              </fieldset>
            </form>
          </div>
          <Footer />
        </div>

        <div className="bg-purple-100 hidden md:flex items-center justify-center">
          <img src="/verify-email.webp" alt="Verify Email Illustration" className="max-w-sm" />
        </div>
      </div>
    </>
  );
}
