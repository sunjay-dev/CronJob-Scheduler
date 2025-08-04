import { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { logout, setAuth } from '../../slices/authSlice';
import { useAppDispatch } from '../../hooks';
import type { User } from '../../types';
import { Loader } from '../common';
import { clearJobs } from '../../slices/jobSlice';

export default function Layout() {

  const [isLoading, setIsLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/details`, {
      credentials: 'include',
    })
      .then(async (res) => {

        if (res.status === 401) {
          dispatch(logout());
          dispatch(clearJobs());
          setAuthorized(false);
          return null;
        }

        const data = await res.json();
        if (!res.ok)
          throw new Error(data.message || "Something went wrong, Please try again later.");
        return data
      })
      .then((data: User | null) => {
        if (!data) return;

        setAuthorized(true);

        dispatch(setAuth({
          user: {
            name: data.name,
            email: data.email,
            timezone: data.timezone,
            mode: data.mode,
            timeFormat24: data.timeFormat24,
            emailNotifications: data.emailNotifications,
            pushAlerts: data.pushAlerts
          }
        }));
      })
      .catch(() => {
        dispatch(logout());
        dispatch(clearJobs());
        setAuthorized(false);
      }).finally(() => setIsLoading(false));

  }, [dispatch]);

  if (isLoading) return <Loader />;

  return authorized ? <Outlet /> : <Navigate to='/login' replace />;
}
