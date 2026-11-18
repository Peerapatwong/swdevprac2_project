import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import MemberWorkshopRegistration from "@/components/MemberWorkshopRegistration";
import WorkshopParticipants from "@/components/WorkshopParticipants";
import { deleteRegistration, saveRegistration } from "@/libs/workshopActions";

const refresh = jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => ({ refresh }),
}));
jest.mock("@/libs/workshopActions", () => ({
    saveRegistration: jest.fn(),
    deleteRegistration: jest.fn(),
}));

const workshopId = "000000000000000000000001";
const registration: BookingItem = {
    _id: "000000000000000000000002",
    user: {
        _id: "000000000000000000000003",
        name: "Ada Member",
        email: "ada@example.test",
        tel: "0812345678",
        role: "member",
    },
    workshop: null,
};

beforeEach(() => {
    jest.clearAllMocks();
});

test("registers a member directly and updates the remaining seats", async () => {
    (saveRegistration as jest.Mock).mockResolvedValue({ success: true, data: registration });
    render(
        <MemberWorkshopRegistration
            workshopId={workshopId}
            initialRemainingSeats={3}
            initiallyRegistered={false}
            registrationOpen
            signedIn
        />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Register Workshop" }));

    await waitFor(() => expect(saveRegistration).toHaveBeenCalledWith(workshopId));
    expect(await screen.findByRole("button", { name: "Already Registered" })).toBeDisabled();
    expect(screen.getByText("2 seats remaining")).toBeInTheDocument();
    expect(refresh).toHaveBeenCalled();
});

test("shows a sign-in link to anonymous visitors", () => {
    render(
        <MemberWorkshopRegistration
            workshopId={workshopId}
            initialRemainingSeats={3}
            initiallyRegistered={false}
            registrationOpen
            signedIn={false}
        />,
    );

    expect(screen.getByRole("link", { name: "Sign In to Register" })).toHaveAttribute(
        "href",
        `/register/login?callbackUrl=%2Fworkshop%2F${workshopId}`,
    );
});

test("lets an admin remove a participant from the list", async () => {
    (deleteRegistration as jest.Mock).mockResolvedValue({ success: true, data: {} });
    jest.spyOn(window, "confirm").mockReturnValue(true);
    render(<WorkshopParticipants initialParticipants={[registration]} capacity={18} />);

    fireEvent.click(screen.getByRole("button", { name: "Remove" }));

    await waitFor(() => expect(deleteRegistration).toHaveBeenCalledWith(registration._id));
    expect(screen.getByText("No participants have registered yet.")).toBeInTheDocument();
    expect(screen.getByText("0 / 18")).toBeInTheDocument();
});
