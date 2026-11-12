import BookingList from "@/components/BookingList";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/libs/auth";
import backend from "@/libs/backend";
import getWorkshops from "@/libs/getWorkshops";

export default async function MyBooking() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/api/auth/signin?callbackUrl=/myBooking");
    const data = await Promise.all([
        backend<BookingItem[]>("registrations", { headers: { Authorization: `Bearer ${session.user.token}` } }),
        getWorkshops().catch(() => ({ data: [] as WorkshopItem[] })),
    ]).catch(() => null);
    if (!data) return <p className="m-10">Cannot load registrations. Please check the server or <Link href="/api/auth/signin">sign in again</Link>.</p>;
    return <BookingList initialBookings={data[0].data} workshops={data[1].data} userId={session.user.id} admin={session.user.role === "admin"} />;
}
