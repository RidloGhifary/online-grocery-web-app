import { UserInterface } from "@/interfaces/user";
import { atom } from "jotai";

export const currentAdminAtom = atom<UserInterface>();
