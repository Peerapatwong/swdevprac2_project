"use client";

import { MenuItem, TextField } from "@mui/material";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import userRegister from "@/libs/userRegister";

export default function RegisterForm() {
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState("");
    const [created, setCreated] = useState(false);

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (busy) return;
        const form = new FormData(event.currentTarget);
        setBusy(true);
        try {
            const result = await userRegister(form);
            setCreated(result.success);
            setMessage(result.success ? "Account created. You can sign in now." : result.error);
        } catch {
            setMessage("Cannot create account. Please try again.");
        } finally { setBusy(false); }
    }

    return (
        <form className="w-full min-h-[calc(100vh-50px)] flex flex-col justify-center items-center py-10 px-4 bg-slate-500" onSubmit={submit}>
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
                <div className="text-2xl font-bold text-gray-800 text-center">Create Account</div>
                {message && <p role={created ? "status" : "alert"} className={created ? "text-green-700" : "text-red-700"}>{message}</p>}
                <fieldset className="flex flex-col gap-5" disabled={busy || created}>
                    <TextField variant="standard" name="name" label="Name" autoComplete="name" required />
                    <TextField variant="standard" name="email" label="Email" type="email" autoComplete="email" required />
                    <TextField variant="standard" name="tel" label="Telephone" type="tel" autoComplete="tel" required />
                    <TextField variant="standard" name="password" label="Password" type="password" autoComplete="new-password" slotProps={{ htmlInput: { minLength: 6 } }} helperText="At least 6 characters" required />
                    <TextField variant="standard" name="role" label="Role" select defaultValue="member">
                        <MenuItem value="member">Member</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                    </TextField>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg disabled:opacity-50" type="submit">{busy ? "Creating…" : "Create Account"}</button>
                </fieldset>
                <Link href="/api/auth/signin" className="block text-center text-blue-600">Sign In</Link>
            </div>
        </form>
    );
}
