"use client";

import { UserProps } from "@/interfaces/user";
import UserProfileDetail from "./UserProfileDetail";
import { useSearchParams } from "next/navigation";
import ChangeName from "./form/ChangeName";
import ChangeGender from "./form/ChangeGender";
import ChangePhoneNumber from "./form/ChangePhoneNumber";
import { useState } from "react";
import { Modal } from "@/components/Modal";
import ChangeEmail from "./form/ChangeEmail";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface UserDetailProps {
  user: UserProps | null;
}

export default function UserDetail({ user }: UserDetailProps) {
  const [modalActive, setModalActive] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const action = searchParams.get("action");

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.post(
        "http://localhost:8000/api/credentials/reset-password",
        {
          email: user?.email,
        },
      );

      return data;
    },
    onSuccess: (res) => {
      setModalActive(false);
      if (res.ok) {
        toast.success("Email sent to " + user?.email, {
          position: "top-center",
        });
      } else {
        toast.error(res.message || "Something went wrong!");
      }
    },
    onError: (err) => {
      setModalActive(false);
      toast.error(err.message || "Something went wrong!");
    },
  });

  const confirmSendEmailResetPassword = () => {
    mutate();
  };

  if (action === "edit-name") {
    return <ChangeName username={user?.username} />;
  }

  if (action === "edit-gender") {
    return <ChangeGender gender={user?.gender} />;
  }

  if (action === "edit-phone number") {
    return <ChangePhoneNumber phone_number={user?.phone_number} />;
  }

  if (action === "edit-email") {
    return <ChangeEmail email={user?.email} />;
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <h2 className="font-bold">Biodata</h2>
        <div className="space-y-2">
          <UserProfileDetail label="Name" value={user?.username} />
          <UserProfileDetail label="Gender" value={user?.gender} />
          <UserProfileDetail label="Phone Number" value={user?.phone_number} />
        </div>
      </div>
      <div className="space-y-4">
        <h2 className="font-bold">Credentials</h2>
        <div className="space-y-2">
          <UserProfileDetail label="Referral" value={user?.referral} />
        </div>
        <div className="space-y-2">
          <UserProfileDetail
            label="Email"
            value={user?.email}
            is_goggle_linked={user?.is_google_linked}
          />
        </div>
      </div>
      {!user?.is_google_linked && (
        <button
          className="btn btn-secondary btn-sm md:btn-md"
          onClick={() => setModalActive(true)}
          disabled={isLoading}
        >
          Change Password
        </button>
      )}
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
            onClick={confirmSendEmailResetPassword}
          >
            Confirm
          </button>,
        ]}
      >
        <div className="space-y-2">
          <h3 className="text-3xl font-bold">Change Password</h3>
          <p className="text-sm text-gray-600">
            We will send an email with a link to reset your password to your
            registered email address.
          </p>
        </div>
      </Modal>
    </div>
  );
}
