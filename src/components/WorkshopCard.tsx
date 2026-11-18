"use client";

import Link from "next/link";
import InteractiveCard from "./InteractiveCard";

export type WorkshopCardAction = "register" | "remove" | "registered" | "none";

interface WorkshopCardProps {
    workshop: Pick<
        WorkshopItem,
        "_id" | "name" | "description" | "instructor" | "workshopDate" | "location"
    >;
    action?: WorkshopCardAction;
    actionHref?: string;
    detailsHref?: string;
    disabled?: boolean;
    onAction?: () => void;
    className?: string;
}

const actionStyles: Record<Exclude<WorkshopCardAction, "none">, string> = {
    register: "bg-blue-600 text-white hover:bg-blue-700",
    remove: "bg-red-600 text-white hover:bg-red-700",
    registered: "cursor-not-allowed bg-slate-400 text-white",
};

const actionLabels: Record<Exclude<WorkshopCardAction, "none">, string> = {
    register: "Register",
    remove: "Remove",
    registered: "Already Registered",
};

function displayDate(value: string) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
    }).format(date);
}

export default function WorkshopCard({
    workshop,
    action = "none",
    actionHref,
    detailsHref,
    disabled = false,
    onAction,
    className = "",
}: WorkshopCardProps) {
    const actionDisabled = disabled || action === "registered";
    const actionClassName = action === "none"
        ? ""
        : `flex min-h-10 w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow-sm transition-colors disabled:opacity-70 ${actionStyles[action]}`;

    const title = (
        <h3 className="text-lg font-bold leading-6 text-slate-950">
            {workshop.name}
        </h3>
    );

    const card = (
        <InteractiveCard className={`h-full w-full ${className}`}>
            <article className="flex min-h-full w-full flex-col p-4 text-slate-950">
                {detailsHref && action !== "none" ? <Link href={detailsHref}>{title}</Link> : title}

                <p className="mt-2 text-xs text-slate-500">
                    with {workshop.instructor}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                    <time dateTime={workshop.workshopDate}>{displayDate(workshop.workshopDate)}</time>
                    <span aria-hidden="true"> · </span>
                    {workshop.location}
                </p>
                <p className="mt-3 flex-1 text-sm leading-5 text-slate-700">
                    {workshop.description}
                </p>

                {action !== "none" && (
                    <div className="mt-4">
                        {actionHref && !actionDisabled ? (
                            <Link href={actionHref} className={actionClassName}>
                                {actionLabels[action]}
                            </Link>
                        ) : (
                            <button
                                type="button"
                                className={actionClassName}
                                onClick={onAction}
                                disabled={actionDisabled}
                            >
                                {actionLabels[action]}
                            </button>
                        )}
                    </div>
                )}
            </article>
        </InteractiveCard>
    );

    if (detailsHref && action === "none") {
        return (
            <Link
                href={detailsHref}
                className="block h-full rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
                {card}
            </Link>
        );
    }

    return card;
}
