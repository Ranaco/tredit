import * as React from "react";
import type { User } from "@supabase/supabase-js";
import type { Trext } from "./trext";

export type StateType = {
  state: StateValue;
  setState: React.Dispatch<React.SetStateAction<StateValue>>;
  updateTrextContent: (trextId: string, newContent: string) => void;
};

export type StateValue = {
  user: User;
  trexts: Trext[];
};
