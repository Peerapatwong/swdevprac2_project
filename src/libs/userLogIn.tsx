export default async function userLogIn (userEmail: string, userPassword: string) {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";
    const response = await fetch(
        `${apiBaseUrl}/api/v1/auth/login`,
        {
            method: "POST",
            headers: 
            {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: userEmail, password: userPassword })
        }
    );

    if (!response.ok) {
        throw new Error("Failed to log in. status:" + response.status);
    }

    // /api/v1/auth/login respond with token
    const responseBody = await response.json();
    return responseBody.data;
}
