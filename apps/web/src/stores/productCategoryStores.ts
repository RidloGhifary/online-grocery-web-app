import { CategoryCompleteInterface, CategoryInterface } from "@/interfaces/CategoryInterface";
import { atom } from "jotai";



export const currentDetailCategorysAtom = atom<CategoryInterface>();

export const currentProductCategoryOperation = atom<"edit" | "detail" | "delete" | "add" | "filter"|'idle'>('idle')