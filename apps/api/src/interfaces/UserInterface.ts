import { $Enums } from '@prisma/client';

export interface UserInputInterface {
  id?: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string | null;
  gender: $Enums.GENDER;
  password?: string | null;
  middle_name?: string | null;
  image?: string | null;
  referral?: string | null;
  is_google_linked?: boolean | null;
  validated_at?: Date | null;
  validation_sent_at?: Date | null;
  created_at?: Date | null;
  updated_at?: Date | null;
  deleted_at?: Date | null;
  role_id?:number
}
