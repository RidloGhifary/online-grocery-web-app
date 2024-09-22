import { UserInterface } from "@/interfaces/user";
import { atom } from "jotai";

export const currentDetailCustomerAtom = atom<UserInterface>();

export const currentCustomerOperation = atom<"edit" | "detail" | "delete" | "add" | "filter"|'idle'>('idle')