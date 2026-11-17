import getWorkshop from "@/libs/getWorkshop";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { notFound } from "next/navigation";
import backend from "@/libs/backend";
import WorkshopDetailCard from "@/components/WorkshopDetailCard";
import MemberWorkshopRegistration from "@/components/MemberWorkshopRegistration";
import WorkshopParticipants from "@/components/WorkshopParticipants";
import WorkshopForm from "@/components/WorkshopForm";

export default async function WorkshopDetailPage({ params }: { params: Promise<{ wid: string }> }) {
    const { wid } = await params;
    if (!/^[a-fA-F0-9]{24}$/.test(wid)) notFound();
    const result = await getWorkshop(wid).catch(() => null);
    if (!result) return <p className="m-10">Workshop unavailable. <Link href="/workshop">View workshops</Link></p>;
    const workshop = result.data;
    const session = await getServerSession(authOptions);
    const registrations = session?.user.token
        ? await backend<BookingItem[]>("registrations", {
            headers: { Authorization: `Bearer ${session.user.token}` },
        }).then(response => response.data).catch(() => [] as BookingItem[])
        : [];
    const workshopRegistrations = registrations.filter(item => item.workshop?._id === workshop._id);
    const registrationCount = workshop.registrationCount ?? workshopRegistrations.length;
    const remainingSeats = Math.max(0, workshop.capacity - registrationCount);
    const registrationOpen = workshop.workshopDate.slice(0, 10) >= new Date().toISOString().slice(0, 10);

    if (session?.user.role === "admin") {
        return (
            <main className="min-h-[calc(100vh-4rem)] bg-slate-900 px-6 py-10 text-white">
                <div className="mx-auto grid w-full max-w-7xl items-start gap-10 lg:grid-cols-[28rem_minmax(0,1fr)]">
                    <WorkshopForm
                        workshop={workshop}
                        participantCount={registrationCount}
                        embedded
                        redirectTo={`/workshop/${workshop._id}`}
                    />
                    <section>
                        <h2 className="mb-3 text-2xl font-bold">Previous</h2>
                        <WorkshopDetailCard workshop={workshop} registrationCount={registrationCount} />
                    </section>
                </div>
                <WorkshopParticipants initialParticipants={workshopRegistrations} capacity={workshop.capacity} />
            </main>
        );
    }

    const alreadyRegistered = workshopRegistrations.length > 0;
    return (
        <main className="min-h-[calc(100vh-4rem)] bg-slate-900 px-6 py-12">
            <div className="mx-auto max-w-4xl">
                <WorkshopDetailCard workshop={workshop} registrationCount={registrationCount}>
                    <MemberWorkshopRegistration
                        workshopId={workshop._id}
                        initialRemainingSeats={remainingSeats}
                        initiallyRegistered={alreadyRegistered}
                        registrationOpen={registrationOpen}
                        signedIn={session?.user.role === "member"}
                    />
                </WorkshopDetailCard>
            </div>
        </main>
    );
}
