import BookingForm from "@/components/BookingForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/libs/auth";
import getWorkshops from "@/libs/getWorkshops";
import getUserProfile from "@/libs/getUserProfile";

export default async function BookingPage({ searchParams }: { searchParams: Promise<{ workshop?: string }> }) {
    const params = await searchParams;
    const session = await getServerSession(authOptions);
    if (!session) redirect(`/api/auth/signin?callbackUrl=${encodeURIComponent(`/booking${params.workshop ? `?workshop=${params.workshop}` : ""}`)}`);
    if (session.user.role !== "member") return <p className="m-10">Only members can register. <Link href="/myBooking">Manage registrations</Link></p>;
    const data = await Promise.all([getWorkshops(), getUserProfile(session.user.token)]).catch(() => null);
    if (!data) return <p className="m-10">Cannot load registration form. Please check the server or <Link href="/api/auth/signin">sign in again</Link>.</p>;
    const workshops = data[0].data.filter(item => item.isActive && item.workshopDate.slice(0, 10) >= new Date().toISOString().slice(0, 10));
    return <BookingForm workshops={workshops} profile={data[1].data} selectedId={workshops.some(item => item._id === params.workshop) ? params.workshop : ""} />;
}
