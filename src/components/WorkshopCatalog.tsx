import WorkshopCard from "./WorkshopCard";

export default function WorkshopCatalog({ workshopsJson }: { workshopsJson: WorkshopJson }) {
    if (workshopsJson.data.length === 0) {
        return (
            <div className="rounded-lg bg-slate-800 p-8 text-center text-slate-200">
                No workshops found. Try a different search.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {workshopsJson.data.map((workshop: WorkshopItem) => (
                <WorkshopCard
                    key={workshop._id}
                    workshop={workshop}
                    action="none"
                    detailsHref={`/workshop/${workshop._id}`}
                    className="min-h-44"
                />
            ))}
        </div>
    );
}
