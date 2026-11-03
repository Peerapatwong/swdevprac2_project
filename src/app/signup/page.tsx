'use client'

import { FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import userSignUp, { UserRole } from "@/libs/userSignUp";
import Link from "next/link";

type FieldName = "name" | "email" | "tel" | "role" | "password";
type FormErrors = Partial<Record<FieldName, string>>;

export default function SignUpPage() {
    const [role, setRole] = useState<UserRole>("member");
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    function clearError(field: FieldName) {
        setErrors((currentErrors) => {
            if (!currentErrors[field]) return currentErrors;

            const updatedErrors = { ...currentErrors };
            delete updatedErrors[field];
            return updatedErrors;
        });
    }

    function validate(formData: FormData): FormErrors {
        const name = String(formData.get("name") ?? "").trim();
        const email = String(formData.get("email") ?? "").trim();
        const tel = String(formData.get("tel") ?? "").trim();
        const selectedRole = String(formData.get("role") ?? "");
        const password = String(formData.get("password") ?? "");
        const validationErrors: FormErrors = {};

        if (name.length < 2) validationErrors.name = "Enter at least 2 characters.";
        if (!/^\S+@\S+\.\S+$/.test(email)) validationErrors.email = "Enter a valid email address.";
        if (!/^[0-9]{9,15}$/.test(tel.replace(/[\s()-]/g, ""))) {
            validationErrors.tel = "Enter a valid telephone number.";
        }
        if (selectedRole !== "admin" && selectedRole !== "member") {
            validationErrors.role = "Choose either admin or member.";
        }
        if (password.length < 6) validationErrors.password = "Password must be at least 6 characters.";

        return validationErrors;
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const validationErrors = validate(formData);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) return;

        setIsSubmitting(true);

        try {
            await userSignUp({
                name: String(formData.get("name")).trim(),
                email: String(formData.get("email")).trim(),
                tel: String(formData.get("tel")).trim(),
                role,
                password: String(formData.get("password")),
            });

            const result = await signIn("credentials", {
                redirect: false,
                email: formData.get("email"),
                password: formData.get("password"),
                callbackUrl: "/",
            });

            if (result?.error) {
                setErrors({ password: "Account created, but automatic sign-in failed. Please try again." });
                return;
            }

            window.location.assign(result?.url ?? "/");
        } catch (error) {
            setErrors({
                password: error instanceof Error ? error.message : "Unable to create your account. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="min-h-[calc(100vh-50px)] bg-slate-500 px-4 py-10 flex items-center justify-center">
            <form
                className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg space-y-6"
                onSubmit={handleSubmit}
                noValidate
            >
                <div className="space-y-2 text-center">
                    <h1 className="text-2xl font-bold text-gray-800">Create your account</h1>
                    <p className="text-sm text-slate-500">Sign up to manage your workshop registrations.</p>
                </div>

                <div className="flex flex-col gap-4">
                    <TextField
                        variant="standard"
                        name="name"
                        label="Name"
                        autoComplete="name"
                        error={Boolean(errors.name)}
                        helperText={errors.name}
                        onChange={() => clearError("name")}
                    />
                    <TextField
                        variant="standard"
                        name="email"
                        label="Email"
                        type="email"
                        autoComplete="email"
                        error={Boolean(errors.email)}
                        helperText={errors.email}
                        onChange={() => clearError("email")}
                    />
                    <TextField
                        variant="standard"
                        name="tel"
                        label="Telephone"
                        type="tel"
                        autoComplete="tel"
                        error={Boolean(errors.tel)}
                        helperText={errors.tel}
                        onChange={() => clearError("tel")}
                    />
                    <FormControl variant="standard" error={Boolean(errors.role)}>
                        <InputLabel id="role-label">Role</InputLabel>
                        <Select
                            labelId="role-label"
                            name="role"
                            value={role}
                            onChange={(event) => {
                                setRole(event.target.value as UserRole);
                                clearError("role");
                            }}
                        >
                            <MenuItem value="member">Member</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                        </Select>
                        {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
                    </FormControl>
                    <TextField
                        variant="standard"
                        name="password"
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        error={Boolean(errors.password)}
                        helperText={errors.password}
                        onChange={() => clearError("password")}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white shadow-md transition duration-200 ease-in-out hover:bg-blue-700 hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isSubmitting ? "Creating account..." : "Sign up"}
                </button>
                <p className="text-center text-sm text-slate-500">Already have an account? <Link href="/login" className="font-medium text-blue-600 hover:underline">Log in</Link></p>
            </form>
        </main>
    );
}
