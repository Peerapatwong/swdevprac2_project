import { getToken } from 'next-auth/jwt'
import { withAuth } from 'next-auth/middleware'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
    const token = await getToken( { req, secret: process.env.NEXTAUTH_SECRET});
    const { pathname } = req.nextUrl;

    // user is logged in or not
    if (!token) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("callbackUrl", req.url);
        return NextResponse.redirect(loginUrl);
    }

    // TODO: role specific path (management and registration)
}

export const config = {
    matcher: 
}