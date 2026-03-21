import { useState, useEffect, useCallback } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { logout, setAuth } from "../../slices/authSlice";
import { useAppDispatch } from "../../hooks";
import { Loader } from "../common";
import { clearJobs } from "../../slices/jobSlice";
import { apiFetch } from "../../utils/apiFetch";

export default function Layout() {
  const [isLoading, setIsLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const dispatch = useAppDispatch();

  const callLogout = useCallback(() => {
    dispatch(logout());
    dispatch(clearJobs());
    setAuthorized(false);
  }, [dispatch]);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await apiFetch("/api/v1/user/me");

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Something went wrong, Please try again later.");

        if (data.authorized === false) {
          callLogout();
          return;
        }

        setAuthorized(true);

        dispatch(
          setAuth({
            user: {
              name: data.name,
              email: data.email,
              timezone: data.timezone,
              mode: data.mode,
              timeFormat24: data.timeFormat24,
              emailNotifications: data.emailNotifications,
              pushAlerts: data.pushAlerts,
            },
          }),
        );
      } catch {
        callLogout();
      } finally {
        setIsLoading(false);
      }
    }
    checkAuth();
  }, [callLogout, dispatch]);

  if (isLoading) return <Loader />;

  return authorized ? <Outlet /> : <Navigate to="/login" replace />;
}
