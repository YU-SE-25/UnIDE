import { getDefaultStore } from "jotai";
import { userProfileAtom } from "../atoms";

const store = getDefaultStore();

export const myRole = (): string | null => {
  const user = store.get(userProfileAtom);
  return user?.role ?? null;
};
