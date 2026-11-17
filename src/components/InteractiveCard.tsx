'use client'
import React from 'react'

export default function InteractiveCard({
    children,
    className = "w-[250px] h-[300px]",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    function setHovered(e: React.SyntheticEvent, hovered: boolean) {
        if (hovered) {
            e.currentTarget.classList.remove('shadow-lg')
            e.currentTarget.classList.remove('bg-white')
            e.currentTarget.classList.add('shadow-2xl')
            e.currentTarget.classList.add('bg-neutral-200')
        } else {
            e.currentTarget.classList.remove('shadow-2xl')
            e.currentTarget.classList.remove('bg-neutral-200')
            e.currentTarget.classList.add('shadow-lg')
            e.currentTarget.classList.add('bg-white')
        }
    }
    
    return (
        <div
            className={`${className} overflow-hidden rounded-lg bg-white shadow-lg transition-[background-color,box-shadow,transform] duration-200`}
            onMouseEnter={(event) => setHovered(event, true)}
            onMouseLeave={(event) => setHovered(event, false)}
        >
            {children}
        </div>
    )
}
