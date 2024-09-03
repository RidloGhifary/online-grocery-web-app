import { createProduct, getProductListWithFilter } from "@/actions/products";
import {
  ProductCategoryInterface,
  ProductCompleteInterface,
  ProductRecordInterface,
} from "@/interfaces/ProductInterface";
import { atom, useAtom } from "jotai";
import { atomWithImmer } from "jotai-immer";
import { atomWithMutation, atomWithQuery } from "jotai-tanstack-query";

export const productsAtom = atomWithImmer<ProductCompleteInterface[]>([]);

export const addProductQueryAtom = atomWithMutation(() => ({
  mutationKey: ["product", "create"],
  mutationFn: async ({ product }: { product: ProductRecordInterface }) =>
    await createProduct(product),
}));

export function addProductAtom({
  newProduct,
}: {
  newProduct: ProductCompleteInterface;
}) {
  const [, setProduct] = useAtom(productsAtom);
  setProduct((prev) => [newProduct, ...prev]);
}


// Define atoms for the filter parameters
export const productCategoryAtom = atom<string | undefined>(undefined);
export const productSearchAtom = atom<string | undefined>(undefined);
export const orderProductAtom = atom<"asc" | "desc">("asc");
export const orderProductFieldAtom = atom<string>("product_name");

// Define the product list atom with Jotai and React Query
export const productListAtom = atomWithQuery((get) => ({
  queryKey: [
    "publicProductList",
    {
      category: get(productCategoryAtom),
      search: get(productSearchAtom),
      order: get(orderProductAtom),
      orderField: get(orderProductFieldAtom),
    },
  ],
  queryFn: async () => {
    const data = await getProductListWithFilter({
      category: get(productCategoryAtom),
      search: get(productSearchAtom),
      order: get(orderProductAtom),
      orderField: get(orderProductFieldAtom),
    });
    return data;
  },
}));

export const categoriesAtom = atomWithImmer<ProductCategoryInterface[]>([]);


