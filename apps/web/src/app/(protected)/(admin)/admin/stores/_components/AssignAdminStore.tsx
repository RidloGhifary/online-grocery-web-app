"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { assignAdmin, getAvailableAdmin } from "@/actions/admin";
import { useState } from "react";
import { Modal } from "@/components/Modal";
import { toast } from "react-toastify";

interface Props {
  isStoreHasNoAdmin?: boolean;
  store_id?: number;
}

export default function AssignAdminStore({
  isStoreHasNoAdmin,
  store_id,
}: Props) {
  const [modalActive, setModalActive] = useState<boolean>(false);
  const [selectedAdmin, setSelectedAdmin] = useState<number>();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ admin_id }: { admin_id: number }) =>
      assignAdmin({
        admin_id,
        store_id: store_id as number,
      }),
    onSuccess: (res) => {
      if (res.ok) {
        queryClient.invalidateQueries({
          queryKey: ["available-admin", "detail-store", store_id],
        });
        toast.success(res.message || "Admin assigned successfully");
      } else {
        toast.error(res.message || res.error || "Something went wrong!");
      }
    },
    onError: (res) => {
      toast.error(res.message || "Something went wrong!");
    },
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["available-admin", store_id],
    queryFn: () => getAvailableAdmin(),
    enabled: isStoreHasNoAdmin,
  });

  if (isLoading) {
    return (
      <div className="flex h-full min-h-96 items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full min-h-screen items-center justify-center">
        <p>
          Error:{" "}
          {error instanceof Error ? error.message : "Something went wrong"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <hr />
      <div>
        <h3 className="text-2xl font-bold">Your store has no admin</h3>
        <p className="text-sm text-gray-500">
          Assign available admin to this store
        </p>
      </div>
      <select
        disabled={isLoading || isPending}
        onChange={(e) => setSelectedAdmin(Number(e.target.value))}
        className="select select-bordered w-full max-w-sm"
      >
        <option value="">Select an admin</option>
        {data?.data?.map((admin) => (
          <option key={admin?.id} value={admin?.id}>
            {admin?.first_name} {admin?.last_name}
          </option>
        ))}
      </select>
      <button
        disabled={!selectedAdmin}
        onClick={() => setModalActive(true)}
        className="btn btn-primary ml-2 text-white"
      >
        Assign
      </button>
      <Modal
        show={modalActive}
        onClose={(e) => {
          setModalActive(false);
        }}
        actions={[
          <button
            key="submit-assign-admin"
            disabled={isLoading || isPending || !selectedAdmin}
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              mutate({ admin_id: selectedAdmin as number });
              setModalActive(false);
            }}
          >
            {isPending ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              "Assign"
            )}
          </button>,
        ]}
      >
        <div className="space-y-2">
          <h3 className="text-3xl font-bold">Assign an admin to this store</h3>
          <p className="text-sm text-gray-600">
            This admin will be able to manage this store, you can remove
            whenever you want
          </p>
        </div>
      </Modal>
    </div>
  );
}
