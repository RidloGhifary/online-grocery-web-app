import { UserInterface } from "@/interfaces/user";
import { atom } from "jotai";

export const currentDetailAdminAtom = atom<UserInterface>();

export const currentAdminOperationAtom = atom<"edit" | "detail" | "delete" | "add" | "filter"|'idle'>('idle')