import TopMenuItem from "./TopMenuItem";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";


export default async function TopMenu() {
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user.role === "admin";

    return (
        <nav className="fixed inset-x-0 top-0 z-30 h-16 bg-slate-300 text-slate-950 shadow-md">
            <div className="flex h-full min-w-max items-center justify-between gap-8 px-9">
                <Link href="/" className="text-lg font-bold tracking-tight">
                    Workshop Explorer
                </Link>

                <div className="flex h-full items-center gap-1 text-sm font-medium">
                    <TopMenuItem
                        title="Workshops"
                        pageRef="/workshop"
                        includeSubpaths
                        excludedSubpaths={["/workshop/manage"]}
                    />
                    <TopMenuItem title="Registrations" pageRef="/myBooking" />

                    {session ? (
                        <>
                            <TopMenuItem
                                title={isAdmin ? "Create Workshop" : "Register Workshop"}
                                pageRef={isAdmin ? "/workshop/manage" : "/booking"}
                            />
                            <Link
                                href="/api/auth/signout"
                                className="flex h-full min-w-fit items-center px-5 transition-colors hover:bg-slate-200"
                            >
                                Sign Out{session.user.name ? ` · ${session.user.name}` : ""}
                            </Link>
                        </>
                    ) : (
                        <>
                            <TopMenuItem title="Sign In" pageRef="/register/login" />
                            <TopMenuItem title="Create Account" pageRef="/register" />
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
