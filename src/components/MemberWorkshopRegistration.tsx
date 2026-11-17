"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { saveRegistration } from "@/libs/workshopActions";

interface MemberWorkshopRegistrationProps {
    workshopId: string;
    initialRemainingSeats: number;
    initiallyRegistered: boolean;
    registrationOpen: boolean;
    signedIn: boolean;
}

export default function MemberWorkshopRegistration({
    workshopId,
    initialRemainingSeats,
    initiallyRegistered,
    registrationOpen,
    signedIn,
}: MemberWorkshopRegistrationProps) {
    const router = useRouter();
    const [registered, setRegistered] = useState(initiallyRegistered);
    const [remainingSeats, setRemainingSeats] = useState(initialRemainingSeats);
    const [error, setError] = useState("");
    const [busy, startTransition] = useTransition();

    function register() {
        if (busy || registered || remainingSeats < 1 || !registrationOpen) return;
        setError("");
        startTransition(async () => {
            const result = await saveRegistration(workshopId);
            if (!result.success) {
                setError(result.error);
                return;
            }
            setRegistered(true);
            setRemainingSeats(current => Math.max(0, current - 1));
            router.refresh();
        });
    }

    if (!signedIn) {
        return (
            <Link
                href={`/register/login?callbackUrl=${encodeURIComponent(`/workshop/${workshopId}`)}`}
                className="inline-flex min-h-11 items-center justify-center rounded-md bg-blue-600 px-6 py-3 font-medium !text-white shadow-md transition hover:bg-blue-700"
            >
                Sign In to Register
            </Link>
        );
    }

    const full = remainingSeats < 1;
    const disabled = busy || registered || full || !registrationOpen;
    const label = busy
        ? "Registering…"
        : registered
            ? "Already Registered"
            : full
                ? "Workshop Full"
                : registrationOpen
                    ? "Register Workshop"
                    : "Registration Closed";

    return (
        <div>
            <button
                type="button"
                onClick={register}
                disabled={disabled}
                className="min-h-11 min-w-64 rounded-md bg-blue-600 px-6 py-3 font-medium text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
                {label}
            </button>
            <p className="mt-3 text-sm text-slate-500">
                {remainingSeats} {remainingSeats === 1 ? "seat" : "seats"} remaining
            </p>
            {error && <p role="alert" className="mt-2 text-sm text-red-700">{error}</p>}
        </div>
    );
}
