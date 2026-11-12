'use client'

import { useState } from "react";
import VideoPlayer from "./VideoPlayer";
import { useWindowListener } from "@/hooks/useWindowListener";

export default function PromoteCard() {
    const [isPlaying, setPlaying] = useState(true)
    
    useWindowListener('contextmenu', (e) => e.preventDefault())

    return (
        <div className="flex flex-row p-5 m-5 bg-white rounded-md shadow-xl">
            <VideoPlayer vdoSrc="/vdo/workshop.mp4" isPlaying={isPlaying}/>

            <div className="ml-5">
                <div className="h-[10%] text-3xl font-bold">Register for a workshop today</div>

                <div className="h-[90%] flex items-end">
                    <button className="bg-slate-400 text-white px-6 py-3 rounded-lg text-lg hover:cursor-pointer" 
                    onClick={() => setPlaying(!isPlaying)}>
                        { isPlaying? 'Pause' : 'Play' }
                    </button>
                </div>
            </div>
        </div>
    )
}