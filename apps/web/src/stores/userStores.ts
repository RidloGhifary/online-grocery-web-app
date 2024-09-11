import { UserInterface } from "@/interfaces/user";
import { atom } from "jotai";

export const adminAtom  = atom<UserInterface|{}>({})