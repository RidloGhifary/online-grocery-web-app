import { useAtom } from "jotai";
import Button from "../ui/ButtonWithAction";
import { currentDetailProductsAtom } from "@/stores/productStores";
import { MouseEvent } from "react";

export default function AdminProductDelete() {
  const [currentProduct] = useAtom(currentDetailProductsAtom);
  function handleDelete(e:MouseEvent) {
    
  }

  function handleCancel(e:MouseEvent) {
    
  }
  
  return (
    <>
      <h2 className="mb-5 text-lg font-bold">
        {" "}
        Delete : {currentProduct?.name}{" "}
      </h2>
      <p className="mb-5 text-lg font-medium">Are you sure?</p>
      <div className="flex w-full flex-row justify-end gap-3">
        <Button
          btnSizeTWClass="btn-md"
          colorTWClass="btn-error"
          extraTWClass="self-end"
          action={handleDelete}
          type="button"
          eventType="onClick"
        >
          Yes
        </Button>
        <Button
          btnSizeTWClass="btn-md"
          colorTWClass="btn-neutral"
          extraTWClass="self-end"
          action={handleCancel}
          type="button"
          eventType="onClick"
        >
          No
        </Button>
      </div>
      <input type="hidden" name="id" />
    </>
  );
}
