interface VenueItem {
    _id: string,
    name: string,
    address: string,
    district: string,
    province: string,
    postalcode: string,
    tel: string,
    picture: string,
    dailyrate: number,
    __v: number,
    id: string
  }
  
  interface VenueJson {
    success: boolean,
    count: number,
    pagination: Object,
    data: VenueItem[]
  }

  interface BookingItem {
    nameLastname: string;
    tel: string;
    venue: string;
    bookDate: string;
  }

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  tel: string;
  role: "admin" | "member";
}

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "member";
  token: string;
}

type ActionResult<T> = { success: true; data: T } | { success: false; error: string };
