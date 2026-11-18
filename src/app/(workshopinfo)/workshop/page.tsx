import WorkshopCatalog from "@/components/WorkshopCatalog";
import getWorkshops from "@/libs/getWorkshops";

export default async function Workshop({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
    const params = await searchParams;
    const search = typeof params.search === "string" ? params.search : "";
    const workshops = await getWorkshops(search).catch(() => null);
    const workshopCount = workshops?.data.length ?? 0;

    return (
        <main className="min-h-[calc(100vh-4rem)] bg-slate-900 px-6 py-8 text-white">
            <div className="mx-auto grid w-full max-w-7xl items-start gap-8 lg:grid-cols-[18rem_minmax(0,1fr)]">
                <aside className="rounded-lg bg-slate-800 p-6 shadow-xl lg:sticky lg:top-24">
                    <form action="/workshop" className="flex flex-col gap-4">
                        <div>
                            <h1 className="text-xl font-bold">Find your workshop</h1>
                            <p className="mt-2 text-sm text-slate-300">
                                {workshopCount} {workshopCount === 1 ? "workshop" : "workshops"} found
                            </p>
                        </div>

                        <label className="sr-only" htmlFor="workshop-search">
                            Search workshops by name
                        </label>
                        <input
                            id="workshop-search"
                            name="search"
                            defaultValue={search}
                            placeholder="Search by name"
                            className="h-11 rounded-md bg-white px-3 text-sm text-slate-950 outline-none ring-blue-500 placeholder:text-slate-500 focus:ring-2"
                        />
                        <button
                            className="h-11 rounded-md bg-blue-600 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
                            type="submit"
                        >
                            Apply Filters
                        </button>
                    </form>
                </aside>

                <section aria-label="Workshop results">
                    {workshops ? (
                        <WorkshopCatalog workshopsJson={workshops} />
                    ) : (
                        <div className="rounded-lg bg-slate-800 p-6 text-slate-200">
                            Cannot load workshops. Please try again.
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
