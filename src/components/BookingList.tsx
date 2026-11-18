'use client'

import { removeBooking, setBookings } from "@/redux/features/bookSlice";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { useDispatch } from "react-redux";
import { useEffect, useTransition } from "react";
import { useSession } from "next-auth/react";
import { deleteRegistration } from "@/libs/workshopActions";
import WorkshopCard from "./WorkshopCard";

export default function BookingList({ initialBookings, userId, admin }: {
    initialBookings: BookingItem[]; userId: string; admin: boolean;
}) {
    const cache = useAppSelector(state => state.bookSlice);
    const dispatch = useDispatch<AppDispatch>();
    const { data: session } = useSession();
    const [busy, startTransition] = useTransition();
    const source = JSON.stringify(initialBookings);
    const bookingItems = cache.ownerId === userId && cache.source === source ? cache.bookItems : initialBookings;
    useEffect(() => {
        dispatch(setBookings({ ownerId: userId, source, bookItems: initialBookings }));
    }, [dispatch, userId, source, initialBookings]);

    const today = new Date().toISOString().slice(0, 10);
    const isActive = (item: BookingItem) => !!item.workshop?.isActive && item.workshop.workshopDate.slice(0, 10) >= today;
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

                {bookingItems.length === 0 ? (
                    <div className="mt-16 rounded-lg bg-slate-800 p-8 text-center text-slate-200">
                        No workshop registrations yet.
                    </div>
                ) : (
                    <div className="mt-16 flex flex-wrap justify-center gap-6">
                        {bookingItems.map(item => (
                            <div key={item._id} className="w-full max-w-md">
                                {admin && (
                                    <div className="mb-2 text-sm text-slate-300">
                                        <span className="font-semibold text-white">{item.user?.name || "Member unavailable"}</span>
                                        {item.user?.email && <span> · {item.user.email}</span>}
                                    </div>
                                )}
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
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
