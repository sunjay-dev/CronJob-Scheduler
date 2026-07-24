import { RouterProvider } from "react-router-dom";
import { router } from "./routes/routes.tsx";
import OfflineOverlay from "./components/OfflineOverlay";

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <OfflineOverlay />
    </>
  );
}
