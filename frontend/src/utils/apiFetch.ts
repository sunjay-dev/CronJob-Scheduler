import { router } from "../routes/routes";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const fetchOptions: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  };

  const url = `${API_BASE_URL}${endpoint}`;

  let response = await fetch(url, fetchOptions);

  if (response.status === 401) {
    try {
      const refreshResponse = await fetch(`${API_BASE_URL}/api/v1/user/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (!refreshResponse.ok) {
        throw new Error("Refresh token expired or invalid");
      }

      response = await fetch(url, fetchOptions);
    } catch {
      router.navigate("/login", { replace: true });
    }
  }

  return response;
}
