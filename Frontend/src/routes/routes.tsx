import { lazy, Suspense } from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";
import { Dashboard, CreateJob, Jobs, EditJob, Logs, JobLogs, Settings } from "../pages";
import { Layout, ProtectedRoute, PublicRoute, Loader } from "../components";

const Home = lazy(() => import("../pages/Home"));
const PrivacyPolicy = lazy(() => import("../pages/PrivacyPolicy"));
const Terms = lazy(() => import("../pages/Terms"));
const VerifyEmail = lazy(() => import("../pages/VerifyUserEmail"));
const ResetPassword = lazy(() => import("../pages/ResetPassword"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));
const Login = lazy(() => import("../pages/Login"));
const Signup = lazy(() => import("../pages/Signup"));
const ForgotPassword = lazy(() => import("../pages/ForgotPassword"));

export const router = createBrowserRouter([
  {
    element: (
      <Suspense fallback={<Loader />}>
        <Outlet />
      </Suspense>
    ),
    children: [
      { path: "/", element: <Home /> },
      { path: "/privacy-policy", element: <PrivacyPolicy /> },
      { path: "/terms", element: <Terms /> },
      { path: "/verify-email/:userId", element: <VerifyEmail /> },
      { path: "/reset-password/:token", element: <ResetPassword /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<Loader />}>
        <PublicRoute><Login /></PublicRoute>
      </Suspense>
    ),
  },
  {
    path: "/signup",
    element: (
      <Suspense fallback={<Loader />}>
        <PublicRoute><Signup /></PublicRoute>
      </Suspense>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <Suspense fallback={<Loader />}>
        <PublicRoute><ForgotPassword /></PublicRoute>
      </Suspense>
    ),
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          { path: "/dashboard", element: <Dashboard /> },
          { path: "/create", element: <CreateJob /> },
          { path: "/jobs", element: <Jobs /> },
          { path: "/job/:jobId/logs", element: <JobLogs /> },
          { path: "/job/:jobId/edit", element: <EditJob /> },
          { path: "/logs", element: <Logs /> },
          { path: "/settings", element: <Settings /> },
        ],
      },
    ],
  },
]);
