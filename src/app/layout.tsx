import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TopMenu from "@/components/TopMenu";
import NextAuthProvider from "@/providers/NextAuthProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import ReduxProvider from "@/redux/ReduxProvider";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Workshop Registration",
  description: "Workshop Registration System",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {

  const session = await getServerSession(authOptions);

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <NextAuthProvider session={session}>
        <ReduxProvider>
          <TopMenu/>
          {children}
        </ReduxProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
