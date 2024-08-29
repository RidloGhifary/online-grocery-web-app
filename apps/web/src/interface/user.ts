export interface UserProps {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  middle_name: string | null;
  image: string | null;
  referral: string;
  is_google_linked: boolean;
  validated_at: string | null;
  validation_sent_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
