"use client";
import { useAtom } from "jotai";
import Button from "../ui/ButtonWithAction";
import { MouseEvent, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bounce, toast } from "react-toastify";
import { queryKeys } from "@/constants/queryKeys";
import CommonResultInterface from "@/interfaces/CommonResultInterface";
import {
  currentDetailCategorysAtom,
  currentProductCategoryOperation,
} from "@/stores/productCategoryStores";
import { deleteCategory } from "@/actions/categories";

export default function AdminCategoryDelete() {
  const [currentCategory, setCurrentProduct] = useAtom(
    currentDetailCategorysAtom,
  );
  const [, setCurrentOperation] = useAtom(currentProductCategoryOperation);

  // const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: () => {
      toast.success("Category deleted successfully", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
      setTimeout(() => {
        mutation.reset();
      }, 200);
      return queryClient.invalidateQueries({
        queryKey: [queryKeys.productCategories],
      });
    },
    onError: (e) => {
      let error: any = "";
      if (typeof JSON.parse(e.message) === "string") {
        error = JSON.parse(
          JSON.parse(e.message),
        ) as unknown as CommonResultInterface<boolean | string>;
        error = (error as unknown as CommonResultInterface<boolean | string>)
          .error;
      } else {
        error = JSON.parse(e.message) as unknown as CommonResultInterface<
          boolean | string
        >;
        error = (error as unknown as CommonResultInterface<boolean | string>)
          .error;
      }

      if (typeof error === "object") {
        if (Array.isArray(error)) {
          //  console.log(error);
          (error as Array<{ message: string }>).forEach((e, i) => {
            toast.error(e.message, {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
              theme: "colored",
              transition: Bounce,
              containerId: 10912,
              toastId: i,
            });
          });
        }
      } else {
        toast.error(error.error, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
          // containerId:10912
        });
      }
    },
  });

  function handleDelete(e: MouseEvent) {
    e.preventDefault();
    const currentId = Number(e.currentTarget.id);
    mutation.mutate(currentId);
  }

  function handleCancel(e: MouseEvent) {
    e.preventDefault();
    mutation.reset();
    setCurrentProduct(undefined);
    setCurrentOperation("idle");
  }

  useEffect(() => {
    if (mutation.isSuccess) {
      // console.log("success");
      queryClient.invalidateQueries({
        queryKey: [queryKeys.productCategories],
      });
      setCurrentOperation("idle");
    }
  }, [mutation.isSuccess]);

  if (!currentCategory) {
    return null;
  }

  return (
    <div>
      <h2 className="mb-5 text-lg font-bold">
        {" "}
        Delete : {currentCategory?.display_name} ({currentCategory?.name})
      </h2>
      <p className="mb-5 text-lg font-medium">Are you sure?</p>
      <div className="flex w-full flex-row justify-end gap-3">
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
        <Button
          btnSizeTWClass="btn-md"
          colorTWClass="btn-error"
          extraTWClass="self-end"
          action={handleDelete}
          type="button"
          eventType="onClick"
          id={currentCategory.id}
        >
          Yes
        </Button>
      </div>
      <input type="hidden" name="id" />
    </div>
  );
}
