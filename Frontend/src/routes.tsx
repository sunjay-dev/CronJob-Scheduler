import { createBrowserRouter } from "react-router-dom";
import { Home, Login, Signup, Dashboard, CreateJob, Jobs, ResetPassword, EditJob, Logs, JobLogs, Settings, NotFoundPage, ForgotPassword, VerifyEmail, PrivacyPolicy, Terms } from "./pages";
import { Layout, ProtectedRoute, PublicRoute } from "./components";

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/privacy-policy", element: <PrivacyPolicy /> },
  { path: "/terms", element: <Terms /> },

  { path: "/login", element: <PublicRoute><Login /></PublicRoute> },
  { path: "/signup", element: <PublicRoute><Signup /></PublicRoute> },
  { path: "/forgot-password", element: <PublicRoute><ForgotPassword /></PublicRoute> },

  { path: "/verify-email/:userId", element: <VerifyEmail /> },
  { path: "/reset-password/:token", element: <ResetPassword /> },

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
        ]
      }
    ]
  },

  { path: "*", element: <NotFoundPage /> }
]);
