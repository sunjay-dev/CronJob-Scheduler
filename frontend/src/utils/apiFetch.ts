import { router } from "../routes/routes";

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const fetchOptions: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  };

  const url = endpoint;

  let response = await fetch(url, fetchOptions);

  if (response.status === 401) {
    try {
      const refreshResponse = await fetch("/api/v1/user/auth/refresh", {
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
