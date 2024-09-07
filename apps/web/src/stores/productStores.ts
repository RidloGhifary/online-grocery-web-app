import { createProduct, getProductListWithFilter } from "@/actions/products";
import {
  ProductCompleteInterface,
  ProductRecordInterface,
} from "@/interfaces/ProductInterface";
import { useAtom } from "jotai";
import { atomWithImmer } from "jotai-immer";
import { atomWithMutation } from "jotai-tanstack-query";

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



