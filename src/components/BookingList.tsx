'use client'

import { addBooking, removeBooking, setBookings } from "@/redux/features/bookSlice";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { useDispatch } from "react-redux";
import { useEffect, useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { deleteRegistration, saveRegistration } from "@/libs/workshopActions";
import WorkshopCard from "./WorkshopCard";

export default function BookingList({ initialBookings, userId, admin, workshops }: {
    initialBookings: BookingItem[]; userId: string; admin: boolean; workshops: WorkshopItem[] | null;
}) {
    const cache = useAppSelector(state => state.bookSlice);
    const dispatch = useDispatch<AppDispatch>();
    const { data: session } = useSession();
    const [busy, startTransition] = useTransition();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [selectedWorkshopId, setSelectedWorkshopId] = useState("");
    const [editError, setEditError] = useState("");
    const source = JSON.stringify(initialBookings);
    const bookingItems = cache.ownerId === userId && cache.source === source ? cache.bookItems : initialBookings;
    useEffect(() => {
        dispatch(setBookings({ ownerId: userId, source, bookItems: initialBookings }));
    }, [dispatch, userId, source, initialBookings]);

    const today = new Date().toISOString().slice(0, 10);
    const isActive = (item: BookingItem) => !!item.workshop?.isActive && item.workshop.workshopDate.slice(0, 10) >= today;
    function save(item: BookingItem) {
        if (busy || !selectedWorkshopId || selectedWorkshopId === item.workshop?._id) return;
        setEditError("");
        startTransition(async () => {
            try {
                const result = await saveRegistration(selectedWorkshopId, item._id);
                if (!result.success) { setEditError(result.error); return; }
                dispatch(addBooking(result.data));
                setEditingId(null);
            } catch { setEditError("Cannot update registration. Please try again."); }
        });
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
    if (session?.user.id !== userId) return <p className="m-10">Please sign in to view registrations.</p>;
    const activeCount = bookingItems.filter(isActive).length;
    const registrationGroups = new Map<string, { user: UserProfile | null; items: BookingItem[] }>();
    if (admin) {
        for (const item of bookingItems) {
            const memberId = item.user?._id ?? `unavailable-${item._id}`;
            const group = registrationGroups.get(memberId);
            if (group) group.items.push(item);
            else registrationGroups.set(memberId, { user: item.user, items: [item] });
        }
    } else {
        registrationGroups.set(userId, { user: null, items: bookingItems });
    }

    return (
        <main className="min-h-[calc(100vh-4rem)] bg-slate-900 px-6 py-12 text-white">
            <div className="mx-auto w-full max-w-5xl">
                <header className="text-center">
                    <h1 className="text-2xl font-bold">
                        {admin ? "All Workshop Registrations" : "My Workshop Registrations"}
                    </h1>
                    {!admin && (
                        <p className="mt-4 text-lg text-slate-200">
                            You can register up to 3 workshops at a time.<br />
                            {activeCount} / 3
                        </p>
                    )}
                </header>

                {!workshops && <p role="alert" className="mt-6 text-center text-red-300">Cannot load workshops for editing. Please reload this page.</p>}
                {workshops?.length === 0 && <p className="mt-6 text-center text-slate-300">No upcoming workshops available for editing.</p>}

                {bookingItems.length === 0 ? (
                    <div className="mt-16 rounded-lg bg-slate-800 p-8 text-center text-slate-200">
                        No workshop registrations yet.
                    </div>
                ) : (
                    <div className="mt-16 space-y-10">
                        {Array.from(registrationGroups, ([memberId, group]) => (
                            <section key={memberId}>
                                {admin && (
                                    <header className="mb-5 border-b border-slate-700 pb-3">
                                        <h2 className="text-xl font-semibold text-white">{group.user?.name || "Member unavailable"}</h2>
                                        {group.user?.email && <p className="mt-1 text-sm text-slate-300">{group.user.email}</p>}
                                    </header>
                                )}
                                <div className="flex flex-wrap justify-center gap-6">
                                    {group.items.map(item => (
                                        <div key={item._id} className="w-full max-w-md">
                                            {item.workshop ? (
                                                <WorkshopCard
                                                    workshop={item.workshop}
                                                    action="remove"
                                                    detailsHref={`/workshop/${item.workshop._id}`}
                                                    disabled={busy}
                                                    onAction={() => remove(item)}
                                                    className="min-h-48"
                                                />
                                            ) : (
                                                <div className="rounded-lg bg-slate-800 p-6 text-slate-300 shadow-lg">
                                                    Workshop unavailable
                                                </div>
                                            )}
                                            {editingId === item._id ? (
                                                <form className="mt-3 rounded-lg bg-slate-800 p-4" onSubmit={event => { event.preventDefault(); save(item); }}>
                                                    <label htmlFor={`registration-workshop-${item._id}`} className="block text-sm font-medium">Change Workshop</label>
                                                    <select
                                                        id={`registration-workshop-${item._id}`}
                                                        value={selectedWorkshopId}
                                                        onChange={event => { setSelectedWorkshopId(event.target.value); setEditError(""); }}
                                                        disabled={busy}
                                                        required
                                                        className="mt-2 w-full rounded-md bg-white p-2 text-slate-950"
                                                    >
                                                        <option value="" disabled>Select Workshop</option>
                                                        {workshops?.map(workshop => (
                                                            <option key={workshop._id} value={workshop._id}>{workshop.name} — {workshop.workshopDate.slice(0, 10)}</option>
                                            ))}
                                        </select>
                                        {editError && <p role="alert" className="mt-2 text-sm text-red-300">{editError}</p>}
                                        <div className="mt-3 flex gap-3">
                                            <button type="submit" disabled={busy || !selectedWorkshopId || selectedWorkshopId === item.workshop?._id} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">{busy ? "Saving…" : "Save Changes"}</button>
                                            <button type="button" disabled={busy} onClick={() => setEditingId(null)} className="rounded-md bg-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-600 disabled:opacity-50">Cancel</button>
                                        </div>
                                    </form>
                                ) : (
                                    <button
                                        type="button"
                                        disabled={busy || !workshops?.length}
                                        onClick={() => {
                                            setEditingId(item._id);
                                            setSelectedWorkshopId(workshops?.some(workshop => workshop._id === item.workshop?._id) ? item.workshop!._id : "");
                                            setEditError("");
                                        }}
                                        className="mt-3 w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        Edit Registration
                                    </button>
                                )}
                            </div>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
