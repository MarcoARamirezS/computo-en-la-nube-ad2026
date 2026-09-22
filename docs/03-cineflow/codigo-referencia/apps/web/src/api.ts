export async function request<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL || "http://localhost:4000/api"}${path}`,
    {
      ...init,
      headers: { "Content-Type": "application/json", ...init.headers },
    },
  );
  if (response.status === 204) return undefined as T;
  const body = await response
    .json()
    .catch(() => ({ error: "Respuesta inesperada del servidor" }));
  if (!response.ok)
    throw new Error(body.error || `Error HTTP ${response.status}`);
  return body.data as T;
}
