import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import userLogIn from "@/libs/userLogIn";

export const authOptions:AuthOptions = {
    pages: {
        signIn: "/login",
    },
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: 'Credentials',
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                email: { label: "Email", type: "email", placeholder: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {

                if (!credentials) return null;

                const user = await userLogIn(credentials.email, credentials.password);

                // If no error and we have user data, return it
                if (user) {
                    return user
                }
                // Return null if user data could not be retrieved
                return null
            }
        })
    ],
    session: { strategy: "jwt" },
    callbacks: {
        async jwt({token, user}) {
            return {...token, ...user}
        },
        async session({session, token}) {
            session.user = {
                _id: String(token.id ?? ""),
                name: String(token.name ?? ""),
                email: String(token.email ?? ""),
                role: String(token.role ?? ""),
                token: String(token.token ?? ""),
            };
            return session;
        }
    }
};
