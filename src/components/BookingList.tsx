'use client'

import { addBooking, removeBooking, setBookings } from "@/redux/features/bookSlice";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { useDispatch } from "react-redux";
import { useEffect, useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { deleteRegistration, saveRegistration } from "@/libs/workshopActions";

export default function BookingList({ initialBookings, workshops, userId, admin }: {
    initialBookings: BookingItem[]; workshops: WorkshopItem[]; userId: string; admin: boolean;
}) {
    const cache = useAppSelector(state => state.bookSlice);
    const dispatch = useDispatch<AppDispatch>();
    const { data: session } = useSession();
    const [editing, setEditing] = useState<string | null>(null);
    const [target, setTarget] = useState("");
    const [busy, startTransition] = useTransition();
    const source = JSON.stringify(initialBookings);
    const bookingItems = cache.ownerId === userId && cache.source === source ? cache.bookItems : initialBookings;
    useEffect(() => {
        dispatch(setBookings({ ownerId: userId, source, bookItems: initialBookings }));
    }, [dispatch, userId, source, initialBookings]);

    const today = new Date().toISOString().slice(0, 10);
    const isActive = (item: BookingItem) => !!item.workshop?.isActive && item.workshop.workshopDate.slice(0, 10) >= today;
    function choices(item: BookingItem) {
        const others = bookingItems.filter(row => row._id !== item._id && row.user?._id === item.user?._id);
        if (others.filter(isActive).length >= 3) return [];
        return workshops.filter(workshop => workshop.isActive && workshop.workshopDate.slice(0, 10) >= today && !others.some(row => row.workshop?._id === workshop._id));
    }
    function remove(item: BookingItem) {
        startTransition(async () => {
            try {
                const result = await deleteRegistration(item._id);
                if (result.success) dispatch(removeBooking(item));
                else alert(result.error);
            } catch { alert("Cannot cancel registration. Please try again."); }
        });
    }
    function edit(item: BookingItem) {
        if (!target) return;
        startTransition(async () => {
            try {
                const result = await saveRegistration(target, item._id);
                if (result.success) { dispatch(addBooking(result.data)); setEditing(null); }
                else alert(result.error);
            } catch { alert("Cannot update registration. Please try again."); }
        });
    }
    if (session?.user.id !== userId) return <p className="m-10">Please sign in to view registrations.</p>;
    return (
        <div className="min-h-screen bg-slate-500 p-6">
            <div className="mx-auto flex max-w-md flex-col gap-3">
                <h1 className="text-xl font-bold text-white">{admin ? "All Workshop Registrations" : "My Workshop Registrations"}</h1>
                {!admin && <p className="text-white">Active registrations: {bookingItems.filter(isActive).length}/3</p>}
                {bookingItems.length === 0 ? <div className="text-center text-white">No Workshop Registration</div> :
                    bookingItems.map(item => (
                        <div key={item._id} className="rounded-lg bg-slate-800 p-4 text-slate-200">
                            <div className="font-semibold text-white">{item.user?.name || "Member unavailable"}</div>
                            <div className="text-sm text-slate-400">{item.user?.tel}{admin && ` · ${item.user?.email || ""}`}</div>
                            <div className="mt-2">{item.workshop?.name || "Workshop unavailable"}</div>
                            <div className="text-sm text-slate-400">{item.workshop?.workshopDate.slice(0, 10)} · {isActive(item) ? "Active" : "History"}</div>
                            <div className="text-xs text-slate-400 break-all">Registration ID: {item._id}</div>
                            {editing === item._id ? <div className="mt-3 space-y-2">
                                <label className="block" htmlFor={`edit-${item._id}`}>Workshop</label>
                                <select id={`edit-${item._id}`} className="w-full bg-slate-700 p-2 rounded" value={target} onChange={event => setTarget(event.target.value)} disabled={busy}>
                                    <option value="" disabled>Select Workshop</option>
                                    {choices(item).map(workshop => <option key={workshop._id} value={workshop._id}>{workshop.name} — {workshop.workshopDate.slice(0, 10)}</option>)}
                                </select>
                                <button className="mr-3 text-blue-300" disabled={busy || !target} onClick={() => edit(item)}>Save</button>
                                <button disabled={busy} onClick={() => setEditing(null)}>Cancel</button>
                            </div> : <button className="mt-3 mr-3 rounded-md bg-slate-700 px-3 py-1.5 text-sm disabled:opacity-50" disabled={busy || !item.user || !choices(item).length} onClick={() => { setEditing(item._id); setTarget(""); }}>Edit registration</button>}
                            <button className="mt-3 rounded-md bg-slate-700 px-3 py-1.5 text-sm text-slate-200 transition hover:bg-red-600 hover:text-white disabled:opacity-50" disabled={busy} onClick={() => remove(item)}>Remove registration</button>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}
