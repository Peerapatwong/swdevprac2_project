import getWorkshop from "@/libs/getWorkshop";
import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { notFound } from "next/navigation";

export default async function WorkshopDetailPage({ params }: { params: Promise<{ wid: string }> }) {
    const { wid } = await params;
    if (!/^[a-fA-F0-9]{24}$/.test(wid)) notFound();
    const result = await getWorkshop(wid).catch(() => null);
    if (!result) return <p className="m-10">Workshop unavailable. <Link href="/workshop">View workshops</Link></p>;
    const workshop = result.data;
    const session = await getServerSession(authOptions);
    return (
        <main className="m-10">
            <div className="text-2xl font-bold mx-5 text-center">{workshop.name}</div>
            <div className="flex flex-row flex-wrap my-5 justify-center gap-10">
                <Image src="/img/banner.jpg" alt="Workshop" width={500} height={350} className="rounded-lg w-full max-w-md object-cover" />
                <div className="flex flex-col gap-y-5">
                    <div className="text-xl font-medium mx-5">Description: {workshop.description}</div>
                    <div className="text-xl font-medium mx-5">Instructor: {workshop.instructor}</div>
                    <div className="text-xl font-medium mx-5">Workshop Date: {workshop.workshopDate.slice(0, 10)}</div>
                    <div className="text-xl font-medium mx-5">Location: {workshop.location}</div>
                    <div className="text-xl font-medium mx-5">Capacity: {workshop.capacity}</div>
                    <div className="mx-5 text-sm break-all">Workshop ID: {workshop._id}</div>
                    {session?.user.role === "admin" ? <Link className="mx-5 text-blue-700" href={`/workshop/manage?wid=${wid}`}>Edit / Delete Workshop</Link> :
                        workshop.workshopDate.slice(0, 10) >= new Date().toISOString().slice(0, 10) ?
                            <Link className="mx-5 text-blue-700" href={`/booking?workshop=${wid}`}>Register Workshop</Link> : <p className="mx-5">Registration closed</p>}
                </div>
            </div>
        </main>
    );
}
