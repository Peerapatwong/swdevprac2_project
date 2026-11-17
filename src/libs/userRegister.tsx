"use server";

import backend from "./backend";

export default async function userRegister(form: FormData): Promise<ActionResult<undefined>> {
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim().toLowerCase();
    const tel = String(form.get("tel") || "").trim();
    const password = String(form.get("password") || "");
    const role = form.get("role");
    if (!name || !email || !tel || password.length < 6 || (role !== "member" && role !== "admin")) {
        return { success: false, error: "Please complete every field. Password must have at least 6 characters." };
    }
    try {
        await backend<AuthUser>("auth/register", { method: "POST", body: JSON.stringify({ name, email, tel, password, role }) });
        return { success: true, data: undefined };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Cannot create account." };
    }
}
