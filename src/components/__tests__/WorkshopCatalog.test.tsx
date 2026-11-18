import { render, screen } from "@testing-library/react";
import WorkshopCatalog from "@/components/WorkshopCatalog";

const workshops: WorkshopItem[] = [
    {
        _id: "6729f3a8c1d4e5f607182930",
        name: "Creative Photography",
        description: "Master composition and light.",
        instructor: "Maya Chen",
        workshopDate: "2026-11-28T00:00:00.000Z",
        location: "Studio A",
        capacity: 18,
        isActive: true,
    },
    {
        _id: "6729f3a8c1d4e5f607182931",
        name: "Modern Web Design",
        description: "Build accessible interfaces.",
        instructor: "Arun Patel",
        workshopDate: "2026-12-03T00:00:00.000Z",
        location: "Lab 2",
        capacity: 20,
        isActive: true,
    },
];

test("renders workshop cards without action buttons", () => {
    render(<WorkshopCatalog workshopsJson={{ success: true, count: 2, data: workshops }} />);

    expect(screen.getByRole("heading", { name: "Creative Photography" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Modern Web Design" })).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
});

test("renders an empty-search message", () => {
    render(<WorkshopCatalog workshopsJson={{ success: true, count: 0, data: [] }} />);
    expect(screen.getByText("No workshops found. Try a different search.")).toBeInTheDocument();
});
