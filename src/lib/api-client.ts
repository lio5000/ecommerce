import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<{ data?: T; error?: string; status: number }> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        error: data?.message || "Ocurrió un error en la petición",
        status: res.status,
      };
    }

    return { data, status: res.status };
  } catch (err) {
    return {
      error: "Error de conexión con el servidor",
      status: 500,
    };
  }
}
