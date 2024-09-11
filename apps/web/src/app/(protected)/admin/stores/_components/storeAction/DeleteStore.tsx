"use client";

import { deleteStore } from "@/actions/stores";
import { Modal } from "@/components/Modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

interface DeleteStoreProps {
  id: number;
  store_name: string;
}

export default function DeleteStore({ id, store_name }: DeleteStoreProps) {
  const [modalActive, setModalActive] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: async () => deleteStore({ storeId: id }),
    onSuccess: (res) => {
      if (res.ok) {
        toast.success("Store deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["stores"] });
        // router.refresh();
      } else {
        toast.error(res.error || "Something went wrong!");
      }
    },
    onError: (res) => {
      toast.error(res.message || "Something went wrong!");
    },
  });

  return (
    <>
      <button
        onClick={() => setModalActive(true)}
        disabled={isLoading}
        className="btn btn-error btn-sm tooltip tooltip-primary text-white"
        data-tip="Delete"
      >
        {isLoading ? (
          <span className="loading loading-spinner loading-sm"></span>
        ) : (
          <FaTrash />
        )}
      </button>
      <Modal
        show={modalActive}
        onClose={(e) => {
          setModalActive(false);
        }}
        actions={[
          <button
            key="confirm-delete-store"
            disabled={isLoading}
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              mutate();
              setModalActive(false);
            }}
          >
            Confirm
          </button>,
        ]}
      >
        <div className="space-y-2">
          <h3 className="text-3xl font-bold">Delete {store_name} Store</h3>
          <p className="text-sm text-gray-600">
            Are you sure you want to delete this store? This action cannot be
            undone. All data associated with this store will be deleted.
          </p>
        </div>
      </Modal>
    </>
  );
}
