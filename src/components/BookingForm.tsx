'use client'

import { MenuItem, TextField } from "@mui/material";
import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveRegistration } from "@/libs/workshopActions";

export default function BookingForm({ workshops, profile, selectedId = "" }: {
    workshops: WorkshopItem[];
    profile: UserProfile;
    selectedId?: string;
}) {
    const [workshopId, setWorkshopId] = useState(selectedId);
    const [busy, startTransition] = useTransition();
    const router = useRouter();
    const selected = workshops.find(item => item._id === workshopId);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!workshopId || busy) return;
        startTransition(async () => {
            try {
                const result = await saveRegistration(workshopId);
                if (!result.success) { alert(result.error); return; }
                alert("Registered!");
                router.push("/myBooking");
                router.refresh();
            } catch { alert("Cannot register. Please try again."); }
        });
    };

    return (
        <form className="w-full min-h-[calc(100vh-50px)] flex flex-col gap-y-5 justify-center items-center py-10 px-4 bg-slate-500" onSubmit={handleSubmit}>
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg flex flex-col items-center justify-center p-8 space-y-6">
                <div className="text-2xl font-bold text-gray-800 text-center">Workshop Registration</div>
                <div className="w-full flex flex-col space-y-4">
                    <TextField variant="standard" label="Name" value={profile.name} disabled />
                    <TextField variant="standard" label="Contact Number" value={profile.tel} disabled />
                    <TextField variant="standard" label="Workshop" select value={workshopId} onChange={event => setWorkshopId(event.target.value)} required disabled={busy}>
                        <MenuItem value="" disabled>Select Workshop</MenuItem>
                        {workshops.map(item => <MenuItem key={item._id} value={item._id}>{item.name} — {item.workshopDate.slice(0, 10)}</MenuItem>)}
                    </TextField>
                    {selected && <TextField variant="standard" label="Workshop Date" value={selected.workshopDate.slice(0, 10)} disabled />}
                    {!workshops.length && <p>No upcoming workshops available.</p>}
                </div>
                <button type="submit" name="Register Workshop" disabled={busy || !workshopId} className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-medium py-2.5 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-200 ease-in-out cursor-pointer disabled:opacity-50">
                    {busy ? "Registering…" : "Register Workshop"}
                </button>
            </div>
        </form>
    );
}
