import backend from "./backend";

export default async function getWorkshops(search = "") {
  return backend<WorkshopItem[]>(`workshops${search ? `?search=${encodeURIComponent(search)}` : ""}`);
}
