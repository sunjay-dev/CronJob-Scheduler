import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { Home, Login, Signup, Dashboard, CreateJob, Jobs, EditJob, Logs, JobLogs, Settings, NotFoundPage, ForgotPassword } from "./pages";
import { Layout, ProtectedRoute, PublicRoute, Loader } from "./components";

const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Terms = lazy(() => import("./pages/Terms"));
const VerifyEmail = lazy(() => import("./pages/VerifyUserEmail"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },

  {
    path: "/privacy-policy",
    element: (
      <Suspense fallback={<Loader />}>
        <PrivacyPolicy />
      </Suspense>
    ),
  },
  {
    path: "/terms",
    element: (
      <Suspense fallback={<Loader />}>
        <Terms />
      </Suspense>
    ),
  },
  { path: "/login", element: <PublicRoute><Login /></PublicRoute> },
  { path: "/signup", element: <PublicRoute><Signup /></PublicRoute> },
  { path: "/forgot-password", element: <PublicRoute><ForgotPassword /></PublicRoute> },

  {
    path: "/verify-email/:userId",
    element: (
      <Suspense fallback={<Loader />}>
        <VerifyEmail />
      </Suspense>
    ),
  },
  {
    path: "/reset-password/:token",
    element: (
      <Suspense fallback={<Loader />}>
        <ResetPassword />
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

  { path: "*", element: <NotFoundPage /> },
]);
