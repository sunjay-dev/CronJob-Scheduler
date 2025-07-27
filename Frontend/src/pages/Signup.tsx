import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../hooks';
import { setAuth } from '../slices/authSlice';
import type { User } from "../types";
import { GoogleAuth, Loader, Popup, PasswordInput } from "../components";

export default function Signup() {
    const navigate = useNavigate();
    const [details, setDetails] = useState({ name: '', email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const dispatch = useAppDispatch();

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!details.name.trim() || !details.email.trim() || !details.password.trim()) {
            return;
        }

        setIsLoading(true);

        const signupDetails = {
            name: details.name,
            email: details.email,
            password: details.password,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        };

        fetch(`${import.meta.env.VITE_BACKEND_URL}/register`, {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(signupDetails),
        })
            .then(async (res) => {
                const data = await res.json();
                console.log(data);

                if (!res.ok)
                    throw new Error(data.message || "Something went wrong");

                return data;
            })
            .then((data) => {
                console.log(data);

                const userData: User = data.user;
                dispatch(setAuth({
                    user: {
                        name: userData.name,
                        email: userData.email,
                        timezone: userData.timezone,
                        mode: userData.mode,
                        timeFormat24: userData.timeFormat24,
                        emailNotifications: userData.emailNotifications,
                        pushAlerts: userData.pushAlerts
                    }
                }));

                setMessage({ type: 'success', text: 'Signup successful!' });

                setTimeout(() => navigate('/jobs'), 300);
            }).catch(err => {
                console.log(err);
                setMessage({ type: 'error', text: err.message || 'Signup failed' });
            })
            .finally(() => {
                setDetails(pre => ({ ...pre, password: '' }));
                setIsLoading(false);
            });
    }

    return (
        <>
            {isLoading && <Loader />}
            <div className="font-[Inter] selection:bg-purple-500 selection:text-white h-dvh w-dvw grid grid-cols-1 md:grid-cols-2 overflow-x-hidden">
                <div className="bg-purple-100 hidden md:flex items-center justify-center">
                    <img
                        src="/Signup-illustration.webp"
                        alt="Illustration"
                        className="max-w-sm"
                    />
                </div>

                <div className="flex flex-col px-8 md:px-6 py-6 md:py-4">

                    <img src="/logo.webp" alt="logo" className="md:ml-2 h-10 w-10 mb-8" />

                    <div className="flex-grow flex flex-col justify-center items-center">
                        <form onSubmit={handleFormSubmit} className="w-full max-w-sm">
                            <fieldset className="space-y-4">
                                <div className="space-y-1">
                                    <h1 className="text-3xl font-bold">SIGN UP</h1>
                                    <p className="text-sm text-gray-500">Please enter your details</p>
                                </div>

                                {message && <Popup type={message.type} message={message.text} />}


                                <div className="flex flex-col space-y-1">
                                    <label htmlFor="name" className="text-sm font-medium">Name</label>
                                    <input required
                                        type="text"
                                        name="name"
                                        aria-label="name"
                                        autoComplete="name"
                                        onChange={e => setDetails(pre => ({ ...pre, name: e.target.value }))}
                                        value={details.name}
                                        className="border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                                    />
                                </div>
                                <div className="flex flex-col space-y-1">
                                    <label htmlFor="email" className="text-sm font-medium">Email address</label>
                                    <input
                                        required
                                        type="email"
                                        name="email"
                                        onChange={e => setDetails(pre => ({ ...pre, email: e.target.value }))}
                                        value={details.email}
                                        className="border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                                    />
                                </div>

                                {<PasswordInput details={details} setDetails={setDetails} />}

                                <button disabled={isLoading} type="submit" className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2 rounded-md text-sm transition">
                                    Sign up
                                </button>

                                {<GoogleAuth text="Sign up with Google" />}

                                <p className="text-center text-sm text-gray-600">
                                    Already have an account? {' '}
                                    <Link to="/login" className="text-purple-700 hover:underline">Sign in</Link>
                                </p>
                            </fieldset>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
