import { RoleInterface } from "./RoleInterface";

export interface UserProps {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
  middle_name: string | null;
  gender: "male" | "female";
  phone_number: string;
  image: string | null;
  referral: string;
  is_google_linked: boolean;
  role?: string;
  addresses: UserAddressProps[];
  carts: any[];
  validated_at: string | null;
  validation_sent_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface UserAddressProps {
  id: number;
  user_id: number;
  city_id: number;
  label: string;
  is_primary: boolean;
  address: string;
  kecamatan: string;
  kelurahan: string;
  postal_code: string;
  city: CityProps;
  latitude: string;
  longtitude: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CityProps {
  id: number;
  province_id: number;
  type: string;
  city_name: string;
  postal_code: string;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
  province: ProvinceProps;
}

export interface ProvinceProps {
  id: number;
  province: string;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
}

export interface UserInterface {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string | null;
  gender: "male" | "female";
  password: string | null;
  middle_name: string | null;
  image: string | null;
  referral: string | null;
  is_google_linked: boolean | null;
  validated_at: Date | null;
  validation_sent_at: Date | null;
  created_at: Date | null;
  updated_at: Date | null;
  deleted_at: Date | null;
  role?: UserHasRole[];
}

export interface UserHasRole {
  id: number;
  user_id: number;
  role_id: number;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
  role?: RoleInterface;
}
