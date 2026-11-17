"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "./auth";
import backend from "./backend";

async function authenticatedRequest<T>(path: string, method: string, body?: unknown, role?: "admin" | "member"): Promise<ActionResult<T>> {
    const session = await getServerSession(authOptions);
    if (!session?.user.token) return { success: false, error: "Please sign in first." };
    if (role && session.user.role !== role) return { success: false, error: "You do not have permission." };
    try {
        const result = await backend<T>(path, {
            method,
            headers: { Authorization: `Bearer ${session.user.token}` },
            body: body === undefined ? undefined : JSON.stringify(body),
        });
        revalidatePath("/myBooking");
        revalidatePath("/workshop");
        return { success: true, data: result.data };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "The request failed." };
    }
}

export async function saveRegistration(workshop: string, id?: string): Promise<ActionResult<BookingItem>> {
    if (!/^[a-fA-F0-9]{24}$/.test(workshop) || (id !== undefined && !/^[a-fA-F0-9]{24}$/.test(id))) {
        return { success: false, error: "Invalid registration or workshop ID." };
    }
    return authenticatedRequest<BookingItem>(id ? `registrations/${id}` : "registrations", id ? "PUT" : "POST", { workshop }, id ? undefined : "member");
}

export async function deleteRegistration(id: string): Promise<ActionResult<unknown>> {
    if (!/^[a-fA-F0-9]{24}$/.test(id)) return { success: false, error: "Invalid registration ID." };
    return authenticatedRequest(`registrations/${id}`, "DELETE");
}

export async function saveWorkshop(input: Pick<WorkshopItem, "name" | "description" | "instructor" | "workshopDate" | "location" | "capacity">, id?: string): Promise<ActionResult<WorkshopItem>> {
    if (id !== undefined && !/^[a-fA-F0-9]{24}$/.test(id)) return { success: false, error: "Invalid workshop ID." };
    const { name, description, instructor, workshopDate, location, capacity } = input;
    return authenticatedRequest<WorkshopItem>(id ? `workshops/${id}` : "workshops", id ? "PUT" : "POST", {
        name, description, instructor, workshopDate, location, capacity,
    }, "admin");
}

export async function deleteWorkshop(id: string): Promise<ActionResult<unknown>> {
    if (!/^[a-fA-F0-9]{24}$/.test(id)) return { success: false, error: "Invalid workshop ID." };
    return authenticatedRequest(`workshops/${id}`, "DELETE", undefined, "admin");
}
