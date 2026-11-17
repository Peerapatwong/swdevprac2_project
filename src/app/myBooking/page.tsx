import BookingList from "@/components/BookingList";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/libs/auth";
import backend from "@/libs/backend";

export default async function MyBooking() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/api/auth/signin?callbackUrl=/myBooking");
    const data = await backend<BookingItem[]>("registrations", {
        headers: { Authorization: `Bearer ${session.user.token}` },
    }).catch(() => null);
    if (!data) return <p className="m-10">Cannot load registrations. Please check the server or <Link href="/api/auth/signin">sign in again</Link>.</p>;
    return <BookingList initialBookings={data.data} userId={session.user.id} admin={session.user.role === "admin"} />;
}
