import backend from "./backend";

export default async function userLogIn(userEmail: string, userPassword: string) {
  const response = await backend<AuthUser>("auth/login", {
    method: "POST",
    body: JSON.stringify({ email: userEmail.trim().toLowerCase(), password: userPassword }),
  });
  return response.data;
}
