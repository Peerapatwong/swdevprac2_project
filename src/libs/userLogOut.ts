export default async function userLogOut(token: string) {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";
    const response = await fetch(`${apiBaseUrl}/api/v1/auth/logout`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Backend logout failed.");
    }
}
