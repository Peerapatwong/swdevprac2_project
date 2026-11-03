import Image from "next/image";
import TopMenuItem from "./TopMenuItem";
import Link from "next/link";
import AuthMenu from "./AuthMenu";


export default function TopMenu() {
    return(
        <div className="text-white flex flex-row-reverse fixed z-30 h-[50px] top-0 left-0 right-0 bg-slate-400 shadow-md text-justify">
           <Image src="/img/logo.png" alt="placeholder" width={50} height={10} sizes="100vh" className="h-full w-auto"/>
           
           <TopMenuItem title="booking" pageRef="/booking"/>

            <div className="w-full h-full justify-items-start flex flex-row text-md font-normal">           
                <AuthMenu />

                <div className="w-[15%] h-full flex items-center p-5">
                    <Link href="/myBooking">My Booking</Link>
                </div>
            </div>

        </div>
    );
}
