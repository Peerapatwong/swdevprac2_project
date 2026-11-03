'use client'

import { TextField } from "@mui/material";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { FormEvent, useState } from "react";

type FieldName = "email" | "password";
type FormErrors = Partial<Record<FieldName, string>>;

export default function LoginPage() {
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    function clearError(field: FieldName) {
        setErrors((current) => ({ ...current, [field]: undefined }));
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const email = String(formData.get("email") ?? "").trim();
        const password = String(formData.get("password") ?? "");
        const validationErrors: FormErrors = {};

        if (!/^\S+@\S+\.\S+$/.test(email)) validationErrors.email = "Enter a valid email address.";
        if (!password) validationErrors.password = "Enter your password.";
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length) return;

        setIsSubmitting(true);
        try {
            const result = await signIn("credentials", {
                redirect: false,
                email,
                password,
                callbackUrl: "/",
            });
            if (!result || result.error) {
                setErrors({ password: "Incorrect email or password." });
                return;
            }
            window.location.assign(result.url ?? "/");
        } catch {
            setErrors({ password: "Unable to log in. Please try again." });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="min-h-[calc(100vh-50px)] bg-slate-500 px-4 py-10 flex items-center justify-center">
            <form className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg space-y-6" onSubmit={handleSubmit} noValidate>
                <div className="space-y-2 text-center">
                    <h1 className="text-2xl font-bold text-gray-800">Welcome back</h1>
                    <p className="text-sm text-slate-500">Log in to manage your workshop registrations.</p>
                </div>
                <div className="flex flex-col gap-4">
                    <TextField variant="standard" name="email" label="Email" type="email" autoComplete="email"
                        error={Boolean(errors.email)} helperText={errors.email} onChange={() => clearError("email")} />
                    <TextField variant="standard" name="password" label="Password" type="password" autoComplete="current-password"
                        error={Boolean(errors.password)} helperText={errors.password} onChange={() => clearError("password")} />
                </div>
                <button type="submit" disabled={isSubmitting}
                    className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white shadow-md transition duration-200 ease-in-out hover:bg-blue-700 hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60">
                    {isSubmitting ? "Logging in..." : "Log in"}
                </button>
                <p className="text-center text-sm text-slate-500">New here? <Link href="/signup" className="font-medium text-blue-600 hover:underline">Sign up</Link></p>
            </form>
        </main>
    );
}
