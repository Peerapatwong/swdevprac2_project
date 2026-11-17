import backend from "./backend";

export default async function getWorkshop(wid: string) {
  if (!/^[a-fA-F0-9]{24}$/.test(wid)) throw new Error("Invalid workshop ID");
  return backend<WorkshopItem>(`workshops/${wid}`);
}
