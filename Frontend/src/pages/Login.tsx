import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAppDispatch } from '../hooks';
import { setAuth } from '../slices/authSlice';
import { Loader, Popup, GoogleAuth, PasswordInput } from "../components";
import { loginSchema } from '../schemas/authSchemas';
import { Helmet } from "react-helmet-async";

export default function Login() {
  const navigate = useNavigate();
  const [details, setDetails] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const dispatch = useAppDispatch();

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = loginSchema.safeParse(details);
    if (!result.success) {
      setMessage({ type: 'error', text: result.error.issues[0].message });
      return;
    }

    setIsLoading(true);

    fetch(`${import.meta.env.VITE_BACKEND_URL}/login`, {
      method: "POST",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(details),
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          if (res.status == 403) {
            navigate(`/verify-email/${data.id}`);
            return Promise.reject();
          }
          return Promise.reject(new Error(data.message || "Something went wrong. Please try again later."));
        }

        return data;
      }).then(data => {

        dispatch(setAuth({
          user: {
            name: data.user.name,
            email: data.user.email,
            timezone: data.user.timezone,
            mode: data.user.mode,
            timeFormat24: data.user.timeFormat24,
            emailNotifications: data.user.emailNotifications,
            pushAlerts: data.user.pushAlerts
          }
        }));
        setMessage({ type: 'success', text: 'Login successful!' });
        setTimeout(() => navigate("/dashboard"), 300);
      }).catch(err => {
        if (err) setMessage({ type: 'error', text: err.message || 'Login failed' });
      })
      .finally(() => {
        setDetails(pre => ({ ...pre, password: '' }));
        setIsLoading(false);
      });
  }

  return (
    <>
    <Helmet>
        <title>CronJob Scheduler</title>
        <meta
          name="description"
          content="Login to CronJob Scheduler to create, manage, and monitor your cron jobs efficiently."
        />
      </Helmet>
      {isLoading && <Loader />}
      <div className="font-[Inter] selection:bg-purple-500 selection:text-white h-dvh w-dvw grid grid-cols-1 md:grid-cols-2 overflow-x-hidden">
        <div className="flex flex-col px-8 md:px-6 py-6">
          <img src="/logo.webp" alt="logo" className="md:ml-2 h-10 w-10 mb-8" />

          <div className="flex-grow flex flex-col justify-center items-center">
            <form onSubmit={handleFormSubmit} className="w-full max-w-sm">
              <fieldset disabled={isLoading} className="space-y-4" >
                <div className="space-y-1">
                  <h1 className="text-3xl font-bold">Welcome Back</h1>
                  <p className="text-sm text-gray-500">Please enter your details</p>
                </div>
                {message && <Popup type={message.type} message={message.text} />}

                <div className="flex flex-col space-y-1">
                  <label htmlFor="email" className="text-sm font-medium">Email address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    onChange={e => setDetails(pre => ({ ...pre, email: e.target.value }))}
                    value={details.email}
                    className="border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  />
                </div>

                {<PasswordInput details={details} setDetails={setDetails} />}

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2">
                    <input className="cursor-pointer accent-purple-500" type="checkbox" name="remember" />
                    <span className="text-gray-600">Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="text-purple-700 hover:underline">Forgot password</Link>
                </div>

                <button disabled={isLoading} type="submit" className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2 rounded-md text-sm transition">
                  Sign in
                </button>
                {<GoogleAuth text="Sign in with Google" />}

                <p className="text-center text-sm text-gray-600">
                  Don’t have an account?{' '}
                  <Link to="/Signup" className="text-purple-700 hover:underline">Sign up</Link>
                </p>
              </fieldset>
            </form>
          </div>
        </div>

        <div className="bg-purple-100 hidden md:flex items-center justify-center">
          <img
            src="/Signin-illustration.webp"
            alt="Illustration"
            className="max-w-sm"
          />
        </div>
      </div>
    </>
  );
}
