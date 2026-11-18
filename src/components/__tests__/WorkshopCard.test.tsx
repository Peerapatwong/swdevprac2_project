import { fireEvent, render, screen } from "@testing-library/react";
import WorkshopCard, { type WorkshopCardAction } from "@/components/WorkshopCard";

const workshop: WorkshopItem = {
    _id: "6729f3a8c1d4e5f607182930",
    name: "Creative Photography",
    description: "Master composition and light through guided shooting exercises.",
    instructor: "Maya Chen",
    workshopDate: "2026-11-28T00:00:00.000Z",
    location: "Studio A",
    capacity: 18,
    isActive: true,
};

test.each<[WorkshopCardAction, string]>([
    ["register", "Register"],
    ["remove", "Remove"],
    ["registered", "Already Registered"],
])("renders the %s action variation", (action, label) => {
    render(<WorkshopCard workshop={workshop} action={action} />);
    expect(screen.getByRole("button", { name: label })).toBeInTheDocument();
});

test("renders no action control for the none variation", () => {
    render(<WorkshopCard workshop={workshop} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
});

test("disables the already registered variation", () => {
    render(<WorkshopCard workshop={workshop} action="registered" />);
    expect(screen.getByRole("button", { name: "Already Registered" })).toBeDisabled();
});

test("calls the supplied action handler", () => {
    const onAction = jest.fn();
    render(<WorkshopCard workshop={workshop} action="remove" onAction={onAction} />);
    fireEvent.click(screen.getByRole("button", { name: "Remove" }));
    expect(onAction).toHaveBeenCalledTimes(1);
});

test("makes the entire card a link when it has no action", () => {
    const { container } = render(
        <WorkshopCard workshop={workshop} detailsHref={`/workshop/${workshop._id}`} />,
    );

    const link = screen.getByRole("link", { name: /Creative Photography/ });
    expect(link).toHaveAttribute("href", `/workshop/${workshop._id}`);
    expect(link).toContainElement(container.querySelector("article"));
});
