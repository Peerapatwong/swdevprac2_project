'use client'

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import userLogOut from "@/libs/userLogOut";

export default function AuthMenu() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isSigningOut, setIsSigningOut] = useState(false);

    async function handleLogout() {
        if (!window.confirm("Are you sure you want to log out?")) return;

        setIsSigningOut(true);
        let backendLogoutFailed = false;
        try {
            await userLogOut(session?.user.token ?? "");
        } catch {
            backendLogoutFailed = true;
        }

        try {
            // This removes the NextAuth cookie that holds the backend bearer token.
            await signOut({ redirect: false });
            router.push("/");
            router.refresh();
            if (backendLogoutFailed) {
                window.alert("You were logged out locally, but the backend logout request failed.");
            }
        } catch {
            setIsSigningOut(false);
            window.alert("Could not log out. Please try again.");
        }
    }

    if (status === "loading") return <div className="flex items-center px-5" />;

    return (
        <div className="flex h-full shrink-0 items-center gap-4 px-5">
            {session ? (
                <button type="button" onClick={handleLogout} disabled={isSigningOut} className="cursor-pointer disabled:opacity-60">
                    {isSigningOut ? "Logging out..." : "Log out"}
                </button>
            ) : (
                <>
                    <Link href="/login">Log in</Link>
                    <Link href="/signup">Sign up</Link>
                </>
            )}
        </div>
    );
}
