import {
  ProductCompleteInterface,
} from "@/interfaces/ProductInterface";
import { atom } from "jotai";
import { atomWithImmer } from "jotai-immer";

export const productsAtom = atomWithImmer<ProductCompleteInterface[]>([]);


export const currentDetailProductsAtom = atom<ProductCompleteInterface>();

export const currentProductOperation = atom<"edit" | "detail" | "delete" | "add" | "filter"|'idle'>('idle')



