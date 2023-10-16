import * as React from "react";
import type { Trext } from "./trext";
import { SupabaseUser } from "./Users";

export type StateType = {
  state: StateValue;
  setState: React.Dispatch<React.SetStateAction<StateValue>>;
  updateTrextContent: (trextId: string, newContent: string) => void;
};

export type StateValue = {
  user: SupabaseUser;
  trexts: Trext[];
};
