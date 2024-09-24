import { atom } from "jotai";

// Atom to store the current sorting criteria (e.g., name, store_type)
export const sortCriteriaAtom = atom<
  "name" | "store_type" | "city" | "province"
>("name");

// Atom to store the sorting direction (ascending or descending)
export const sortDirectionAtom = atom<"asc" | "desc">("asc");
