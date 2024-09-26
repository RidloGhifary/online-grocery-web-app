import { Store } from "@/interfaces/StockInterface";
import { atom } from "jotai";

export const currentStoreInStockAtom = atom<Store>();
