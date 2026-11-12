import Image from "next/image";
import TopMenuItem from "./TopMenuItem";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";


export default async function TopMenu() {

    const session = await getServerSession(authOptions);

    return(
        <div className="text-white flex flex-row-reverse fixed z-30 h-[50px] top-0 left-0 right-0 bg-slate-400 shadow-md text-justify">
           <Image src="/img/logo.png" alt="placeholder" width={50} height={10} sizes="100vh" className="h-full w-auto"/>
           
           <TopMenuItem title="Register Workshop" pageRef="/booking"/>

            <div className="w-full h-full justify-items-start flex flex-row text-md font-normal">           
                <div className="min-w-fit h-full flex items-center p-5">
                    {
                        session?
                            <Link href="/api/auth/signout">
                                Sign-Out of {session.user.name}
                            </Link> :
                            <Link href="/api/auth/signin">
                                Sign-In
                            </Link>
                    }
                </div>

                {!session && <div className="min-w-fit h-full flex items-center p-5"><Link href="/register">Create Account</Link></div>}
                <div className="min-w-fit h-full flex items-center p-5">
                    <Link href="/myBooking">Registrations</Link>
                </div>
            </div>

        </div>
    );
}