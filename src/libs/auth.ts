import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import userLogIn from "@/libs/userLogIn";
import backend from "@/libs/backend";

const authSecret = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET;

if (!authSecret) {
    throw new Error("NEXTAUTH_SECRET (or AUTH_SECRET) must be configured.");
}

export const authOptions: AuthOptions = {
    secret: authSecret,
    pages: {
        signIn: "/register/login",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials) return null;
                return userLogIn(credentials.email, credentials.password);
            }
        })
    ],
    session: { strategy: "jwt" },
    callbacks: {
        async jwt({ token, user }) {
            return { ...token, ...user };
        },
        async session({ session, token }) {
            session.user = {
                id: token.id,
                name: token.name || "",
                email: token.email || "",
                role: token.role,
                token: token.token,
            };
            return session;
        }
    },
    events: {
        async signOut({ token }) {
            if (token?.token) {
                await backend("auth/logout", {
                    headers: { Authorization: `Bearer ${token.token}` }
                }).catch(() => undefined);
            }
        }
    }
};
