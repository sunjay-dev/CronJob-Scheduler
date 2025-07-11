import { Link } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from 'react-redux';
import { setAuth } from '../slices/authSlice';
import type { AppDispatch } from '../store';

export default function Login() {
  const [details, setDetails] = useState({ email: '', password: '' });
   const dispatch = useDispatch<AppDispatch>();

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!details.email.trim() || !details.password.trim()) {
      return
    }
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
        console.log(data);
        
        if (!res.ok)
          throw new Error(data.message || "Something went wrong");

        return data;
      })
      .then(data => {
        dispatch(setAuth({ token: data.token, user: { name: data.user.name, email:data.user.email  } }));
        console.log(data);
      }).catch(err => console.log(err))

  }

  return (
    <div className="font-[Inter] selection:bg-purple-500 selection:text-white h-dvh w-dvw grid grid-cols-1 md:grid-cols-2">

      <div className="flex flex-col px-8 md:px-6 py-6">

        <img src="/logo.webp" alt="logo" className="md:ml-2 h-10 w-10 mb-8" />

        <div className="flex-grow flex flex-col justify-center items-center">
          <form onSubmit={handleFormSubmit} className="w-full max-w-sm space-y-5">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold">Welcome back</h1>
              <p className="text-sm text-gray-500">Please enter your details</p>
            </div>

            <div className="flex flex-col space-y-1">
              <label htmlFor="email" className="text-sm font-medium">Email address</label>
              <input
                type="email"
                name="email"
                onChange={e => setDetails(pre => ({ ...pre, email: e.target.value }))}
                value={details.email}
                className="border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
            </div>

            <div className="flex flex-col space-y-1">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <input
                type="password"
                name="password"
                onChange={e => setDetails(pre => ({ ...pre, password: e.target.value }))}
                value={details.password}
                className="border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input className="cursor-pointer" type="checkbox" name="remember" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <a href="/" className="text-purple-700 hover:underline">Forgot password</a>
            </div>

            <button type="submit" className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2 rounded-md text-sm transition">
              Sign in
            </button>
            <button className="w-full border border-gray-300 py-1.5 rounded-md flex items-center justify-center gap-2 hover:bg-gray-50 transition text-sm">
              <img src="/google.webp" alt="Google" className="w-4 h-4" />
              <span>Sign in with Google</span>
            </button>

            <p className="text-center text-sm text-gray-600">
              Don’t have an account?{' '}
              <Link to="/Signup" className="text-purple-700 hover:underline">Sign up</Link>
            </p>
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
  );
}
