import LoginForm from "@/components/LoginForm";

export default async function LoginPage({ searchParams }: PageProps<"/register/login">) {
    const { callbackUrl } = await searchParams;

    return <LoginForm callbackUrl={typeof callbackUrl === "string" ? callbackUrl : undefined} />;
}
