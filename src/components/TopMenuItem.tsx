"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface TopMenuItemProps {
  title: string;
  pageRef: string;
  includeSubpaths?: boolean;
  excludedSubpaths?: string[];
}

export default function TopMenuItem({
  title,
  pageRef,
  includeSubpaths = false,
  excludedSubpaths = [],
}: TopMenuItemProps) {
  const pathname = usePathname();
  const excluded = excludedSubpaths.some(path => pathname.startsWith(path));
  const active = pathname === pageRef
    || (includeSubpaths && !excluded && pathname.startsWith(`${pageRef}/`));

  return (
    <Link
      className={`flex h-full min-w-fit items-center justify-center px-5 transition-colors ${
        active
          ? "bg-blue-600 !text-white"
          : "text-slate-950 hover:bg-slate-200"
      }`}
      href={pageRef}
      aria-current={active ? "page" : undefined}
    >
      {title}
    </Link>
  );
}
