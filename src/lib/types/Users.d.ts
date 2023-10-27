import { SBNotification } from "./Notification";

export type SupabaseUser = {
  avatar_url: string;
  email: string;
  id: string;
  collaborating: string[];
  name: string;
  trext_count: number;
  created_at: string;
  notifications: SBNotification[];
};
