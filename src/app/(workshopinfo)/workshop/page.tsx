import WorkshopCatalog from "@/components/WorkshopCatalog";
import getWorkshops from "@/libs/getWorkshops";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";

export default async function Workshop({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
    const params = await searchParams;
    const search = typeof params.search === "string" ? params.search : "";
    const session = await getServerSession(authOptions);
    const workshops = await getWorkshops(search).catch(() => null);
    return (
        <>
            <form action="/workshop" className="m-5 flex flex-wrap gap-3">
                <input aria-label="Search Workshops" name="search" defaultValue={search} placeholder="Search Workshops" className="bg-white rounded p-2" />
                <button className="bg-blue-600 text-white rounded px-4" type="submit">Search</button>
                {session?.user.role === "admin" && <Link href="/workshop/manage" className="bg-blue-600 text-white rounded p-2">Create Workshop</Link>}
            </form>
            {workshops ? <WorkshopCatalog workshopsJson={workshops} /> : <p className="m-5">Cannot load workshops. Please try again.</p>}
        </>
    );
}
