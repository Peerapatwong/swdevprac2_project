import backend from "./backend";

export default async function getUserProfile(token: string) {
  return backend<UserProfile>("auth/me", { headers: { Authorization: `Bearer ${token}` } });
}
