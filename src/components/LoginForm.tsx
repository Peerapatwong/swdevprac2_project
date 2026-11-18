"use client";

import { TextField } from "@mui/material";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState, type FormEvent } from "react";

type LoginFormProps = {
    callbackUrl?: string;
};

export default function LoginForm({ callbackUrl = "/" }: LoginFormProps) {
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState("");

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (busy) return;

        const form = new FormData(event.currentTarget);
        setBusy(true);
        setMessage("");

        try {
            const result = await signIn("credentials", {
                email: form.get("email"),
                password: form.get("password"),
                callbackUrl,
                redirect: false,
            });

            if (!result?.ok) {
                setMessage("Incorrect email or password.");
                return;
            }

            window.location.assign(result.url ?? "/");
        } catch {
            setMessage("Cannot sign in. Please try again.");
        } finally {
            setBusy(false);
        }
    }

    return (
        <form className="w-full min-h-[calc(100vh-50px)] flex flex-col justify-center items-center py-10 px-4 bg-slate-500" onSubmit={submit}>
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
                <div className="text-2xl font-bold text-gray-800 text-center">Sign In</div>
                {message && <p role="alert" className="text-red-700">{message}</p>}
                <fieldset className="flex flex-col gap-5" disabled={busy}>
                    <TextField variant="standard" name="email" label="Email" type="email" autoComplete="email" required />
                    <TextField variant="standard" name="password" label="Password" type="password" autoComplete="current-password" required />
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg disabled:opacity-50" type="submit">
                        {busy ? "Signing in…" : "Sign In"}
                    </button>
                </fieldset>
                <Link href="/register" className="block text-center text-blue-600">Create Account</Link>
            </div>
        </form>
    );
}
