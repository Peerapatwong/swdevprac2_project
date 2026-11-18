import type { ReactNode } from "react";

interface WorkshopDetailCardProps {
    workshop: WorkshopItem;
    registrationCount: number;
    children?: ReactNode;
}

function displayDate(value: string) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
    }).format(date);
}

export default function WorkshopDetailCard({
    workshop,
    registrationCount,
    children,
}: WorkshopDetailCardProps) {
    return (
        <article className="w-full rounded-xl bg-white p-8 text-slate-950 shadow-xl sm:p-12">
            <h1 className="text-3xl font-bold tracking-tight">{workshop.name}</h1>
            <p className="mt-5 leading-7 text-slate-600">{workshop.description}</p>

            <dl className="mt-6 border-t border-slate-300 pt-2">
                <DetailRow label="Instructor" value={workshop.instructor} />
                <DetailRow label="Date" value={displayDate(workshop.workshopDate)} />
                <DetailRow label="Location" value={workshop.location} />
                <DetailRow
                    label="Capacity"
                    value={`${workshop.capacity} participant${workshop.capacity === 1 ? "" : "s"}`}
                />
                <DetailRow label="Registered" value={`${registrationCount} participant${registrationCount === 1 ? "" : "s"}`} />
                <DetailRow label="Workshop ID" value={workshop._id} compact />
            </dl>

            {children && <div className="mt-6">{children}</div>}
        </article>
    );
}

function DetailRow({ label, value, compact = false }: { label: string; value: string; compact?: boolean }) {
    return (
        <div className="grid gap-1 border-b border-slate-100 py-4 sm:grid-cols-[10rem_1fr] sm:gap-6">
            <dt className="text-sm font-semibold text-slate-500">{label}</dt>
            <dd className={`text-slate-800 sm:text-right ${compact ? "break-all text-xs" : "text-sm"}`}>
                {value}
            </dd>
        </div>
    );
}
