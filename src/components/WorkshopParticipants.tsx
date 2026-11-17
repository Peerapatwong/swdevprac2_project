"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteRegistration } from "@/libs/workshopActions";

export default function WorkshopParticipants({
    initialParticipants,
    capacity,
}: {
    initialParticipants: BookingItem[];
    capacity: number;
}) {
    const router = useRouter();
    const [participants, setParticipants] = useState(initialParticipants);
    const [busyId, setBusyId] = useState<string | null>(null);
    const [busy, startTransition] = useTransition();

    function remove(registration: BookingItem) {
        if (!registration.user || !confirm(`Remove ${registration.user.name} from this workshop?`)) return;
        setBusyId(registration._id);
        startTransition(async () => {
            const result = await deleteRegistration(registration._id);
            if (!result.success) {
                alert(result.error);
                setBusyId(null);
                return;
            }
            setParticipants(current => current.filter(item => item._id !== registration._id));
            setBusyId(null);
            router.refresh();
        });
    }

    return (
        <section className="mx-auto mt-10 w-full max-w-4xl rounded-xl bg-white p-8 text-slate-950 shadow-xl">
            <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-bold">Participants</h2>
                <p className="text-sm text-slate-500">{participants.length} / {capacity}</p>
            </div>

            {participants.length === 0 ? (
                <p className="mt-6 text-slate-500">No participants have registered yet.</p>
            ) : (
                <ul className="mt-6 divide-y divide-slate-200">
                    {participants.map(registration => (
                        <li key={registration._id} className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="font-semibold">{registration.user?.name || "Member unavailable"}</p>
                                <p className="text-sm text-slate-500">
                                    {[registration.user?.email, registration.user?.tel].filter(Boolean).join(" · ")}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => remove(registration)}
                                disabled={busy && busyId === registration._id}
                                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
                            >
                                {busy && busyId === registration._id ? "Removing…" : "Remove"}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
