/** @jest-environment node */
import { getServerSession } from "next-auth";
import backend from "@/libs/backend";
import { saveRegistration, deleteRegistration, saveWorkshop } from "@/libs/workshopActions";
import userRegister from "@/libs/userRegister";
import reducer, { addBooking } from "@/redux/features/bookSlice";

jest.mock("next-auth", () => ({ getServerSession: jest.fn() }));
jest.mock("@/libs/auth", () => ({ authOptions: {} }));
jest.mock("@/libs/backend", () => ({ __esModule: true, default: jest.fn() }));
jest.mock("next/cache", () => ({ revalidatePath: jest.fn() }));
const id = "000000000000000000000001";
const profile: UserProfile = { _id: id, name: "Member", email: "member@example.test", tel: "0812345678", role: "member" };
const workshop: WorkshopItem = { _id: id, name: "Workshop", description: "Learn", instructor: "Teacher", workshopDate: "2099-12-01", location: "Room A", capacity: 10, isActive: true };
beforeEach(() => jest.clearAllMocks());

test("registration requires a signed-in user", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);
    expect((await saveRegistration(id)).success).toBe(false);
    expect(backend).not.toHaveBeenCalled();
});
test("member registration sends a workshop ID and authenticated bearer token", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ user: { role: "member", token: "member-token" } });
    (backend as jest.Mock).mockResolvedValue({ data: { _id: id } });
    expect((await saveRegistration(id)).success).toBe(true);
    expect(backend).toHaveBeenCalledWith("registrations", expect.objectContaining({
        method: "POST", body: JSON.stringify({ workshop: id }),
        headers: { Authorization: "Bearer member-token" },
    }));
});
test("admin cannot create a member registration", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ user: { role: "admin", token: "admin-token" } });
    expect((await saveRegistration(id)).success).toBe(false);
    expect(backend).not.toHaveBeenCalled();
});
test("editing and deletion refer to registration ID, not workshop ID", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ user: { role: "member", token: "member-token" } });
    (backend as jest.Mock).mockResolvedValue({ data: {} });
    const registrationId = "000000000000000000000002";
    await saveRegistration(id, registrationId);
    expect(backend).toHaveBeenCalledWith(`registrations/${registrationId}`, expect.objectContaining({ method: "PUT", body: JSON.stringify({ workshop: id }) }));
    await deleteRegistration(registrationId);
    expect(backend).toHaveBeenLastCalledWith(`registrations/${registrationId}`, expect.objectContaining({ method: "DELETE" }));
});
test("members cannot manage workshops", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ user: { role: "member", token: "member-token" } });
    expect((await saveWorkshop(workshop)).success).toBe(false);
    expect(backend).not.toHaveBeenCalled();
});
test("backend registration conflicts remain readable", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ user: { role: "member", token: "member-token" } });
    (backend as jest.Mock).mockRejectedValue(new Error("Workshop capacity has been reached"));
    expect(await saveRegistration(id)).toEqual({ success: false, error: "Workshop capacity has been reached" });
});
test("create account passes the required fields and normalizes email", async () => {
    (backend as jest.Mock).mockResolvedValue({ data: {} });
    const form = new FormData();
    Object.entries({ name: "Member", email: "MEMBER@example.test", tel: "0812345678", password: "password123", role: "member" }).forEach(([key, value]) => form.set(key, value));
    expect((await userRegister(form)).success).toBe(true);
    expect(backend).toHaveBeenCalledWith("auth/register", expect.objectContaining({
        body: JSON.stringify({ name: "Member", email: "member@example.test", tel: "0812345678", password: "password123", role: "member" }),
    }));
});
test("Redux retains distinct registrations for workshops on the same date", () => {
    const first: BookingItem = { _id: id, user: profile, workshop };
    const second: BookingItem = { ...first, _id: "000000000000000000000002" };
    const state = reducer(reducer(undefined, addBooking(first)), addBooking(second));
    expect(state.bookItems).toHaveLength(2);
    expect(reducer(state, addBooking({ ...first, workshop: { ...workshop, name: "Updated" } })).bookItems[0].workshop?.name).toBe("Updated");
});
