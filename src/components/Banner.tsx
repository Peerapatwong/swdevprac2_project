'use client'

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const reqText: string = "where every interest finds its workshop";
const announceText: string = "Find the one that suits you";

const covers = ['cover.jpg', 'cover2.jpg', 'cover3.jpg', 'cover4.jpg'];

export default function Banner() {
    const [index, setIndex] = useState(0);
    const { data : session } = useSession();

    return (
        <div
            className="relative block m-0 w-full h-[80vh] cursor-pointer overflow-hidden"
            onClick={() => setIndex((index + 1) % covers.length)}
        >
            <Image
                src={`/img/${covers[index]}`}
                alt='placeholder'
                fill={true}
                className="object-cover"
                priority
            />

            <div className="absolute top-0 right-0 z-20 text-center text-white text-2xl m-5 text-shadow-lg">
                { session? `Welcome ${session.user.name}` : null }
            </div>

            {/* Headline: pinned at 20% from the top of the banner */}
            <div className="absolute inset-x-0 top-[20%] z-20 text-center text-white text-3xl [text-shadow:_0_0_10px_rgba(0,0,0,0.8),_0_0_20px_rgba(0,0,0,0.6),_0_0_30px_rgba(0,0,0,0.4)] pointer-events-none">
                <h1>{reqText}</h1>
                <h3 className="text-2xl">{announceText}</h3>
            </div>

            {/* Link: pinned to the bottom-right corner of the banner */}
            <div className="absolute bottom-0 right-0 z-20 p-10 text-white text-3xl text-shadow-lg">
                <Link href='/workshop' onClick={(e) => e.stopPropagation()}>
                    Select Workshop
                </Link>
            </div>
        </div>
    );
}