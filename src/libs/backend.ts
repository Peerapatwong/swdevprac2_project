import "server-only";

export default async function backend<T>(path: string, options: RequestInit = {}): Promise<{ success: true; data: T; count: number }> {
  const response = await fetch(`${(process.env.BACKEND_URL || "http://localhost:5000").replace(/\/$/, "")}/api/v1/${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });
  const result = await response.json().catch(() => null);
  if (!response.ok || !result?.success) {
    throw new Error(response.status === 401 ? "Please sign in again." : result?.error || "The request failed. Please try again.");
  }
  return result;
}
