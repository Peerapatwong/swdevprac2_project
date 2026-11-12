interface WorkshopItem {
  _id: string;
  name: string;
  description: string;
  instructor: string;
  workshopDate: string;
  location: string;
  capacity: number;
  isActive: boolean;
}

interface WorkshopJson {
  success: boolean;
  count: number;
  data: WorkshopItem[];
}

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  tel: string;
  role: "admin" | "member";
}

interface BookingItem {
    nameLastname: string;
    tel: string;
    venue: string;
    bookDate: string;
  }

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "member";
  token: string;
}

type ActionResult<T> = { success: true; data: T } | { success: false; error: string };
