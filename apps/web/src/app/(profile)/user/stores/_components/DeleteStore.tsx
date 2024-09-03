"use client";

import { getCookies } from "@/actions/cookies";
import { Modal } from "@/components/Modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

interface DeleteStoreProps {
  id: number;
  api_url: string;
  store_name: string;
}

export default function DeleteStore({
  id,
  api_url,
  store_name,
}: DeleteStoreProps) {
  const [modalActive, setModalActive] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: async () => {
      const token = await getCookies("token");
      if (!token) return;
      const { data } = await axios.delete(`${api_url}/stores/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    },
    onSuccess: (res) => {
      if (res.ok) {
        toast.success("Store deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["stores"] });
        router.refresh();
      } else {
        toast.error(res.message || "Something went wrong!");
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
        className="btn btn-error btn-xs text-white sm:btn-sm"
      >
        {isLoading ? (
          <span className="loading loading-spinner loading-sm"></span>
        ) : (
          <>
            <FaTrash size={12} />
            Delete
          </>
        )}
      </button>
      <Modal
        show={modalActive}
        onClose={(e) => {
          setModalActive(false);
        }}
        actions={[
          <button
            disabled={isLoading}
            type="button"
            className="btn btn-primary text-white"
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
            undone.
          </p>
        </div>
      </Modal>
    </>
  );
}
