export type UserRole = "admin" | "member";

export type SignUpDetails = {
    name: string;
    email: string;
    tel: string;
    role: UserRole;
    password: string;
};

type ApiError = {
    error?: string;
};

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";

export default async function userSignUp(details: SignUpDetails) {
    const response = await fetch(`${apiBaseUrl}/api/v1/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(details),
    });

    if (!response.ok) {
        const body = await response.json().catch(() => ({} as ApiError)) as ApiError;
        throw new Error(body.error ?? "Unable to create your account.");
    }

    return response.json();
}
