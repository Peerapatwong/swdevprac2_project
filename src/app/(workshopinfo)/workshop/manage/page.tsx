import WorkshopForm from "@/components/WorkshopForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { redirect, notFound } from "next/navigation";
import getWorkshop from "@/libs/getWorkshop";

export default async function ManageWorkshopPage({ searchParams }: { searchParams: Promise<{ wid?: string }> }) {
    const { wid } = await searchParams;
    const session = await getServerSession(authOptions);
    if (!session) redirect(`/api/auth/signin?callbackUrl=${encodeURIComponent(`/workshop/manage${wid ? `?wid=${wid}` : ""}`)}`);
    if (session.user.role !== "admin") return <p className="m-10">Only admins can manage workshops.</p>;
    if (!wid) return <WorkshopForm />;
    if (!/^[a-fA-F0-9]{24}$/.test(wid)) notFound();
    const result = await getWorkshop(wid).catch(() => null);
    return result ? <WorkshopForm workshop={result.data} /> : <p className="m-10">Cannot load workshop.</p>;
}
