"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { updateProfile } from "@/actions/user";

const schema = z.object({
  phone_number: z
    .string()
    .min(1, "Phone number is required")
    .max(50, "Phone number is too long"),
});

interface ChangeNameProps {
  phone_number: string | undefined;
}

export default function ChangePhoneNumber({ phone_number }: ChangeNameProps) {
  const router = useRouter();

  const defaultValuePhoneNumber = (phone_number || "").includes("+62")
    ? phone_number
    : "+62 " + (phone_number ? phone_number : "");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      phone_number: defaultValuePhoneNumber,
    },
  });

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: async (data: { phone_number: string }) =>
      updateProfile({
        phone_number: data.phone_number,
      }),
    onSuccess: (res) => {
      if (res.ok) {
        toast.success(res.message || "Phone Number updated!");
        router.push("/user/settings");
        router.refresh();
      } else {
        toast.error(res.message || "Something went wrong!");
      }
    },
    onError: (res) => {
      toast.error(res.message || "Something went wrong!");
    },
  });

  const onSubmit: (data: z.infer<typeof schema>) => void = (data) => {
    mutate(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full space-y-6 md:max-w-md"
    >
      <div>
        <label
          htmlFor="phone_number"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Phone number
        </label>
        <div className="mt-2">
          <input
            id="phone_number"
            type="phone_number"
            placeholder="+62 "
            required
            disabled={isLoading}
            className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 sm:text-sm sm:leading-6"
            {...register("phone_number")}
          />
        </div>
        <p className="mt-2 text-sm text-red-600">
          {errors.phone_number?.message}
        </p>
      </div>

      <div className="space-x-2">
        <button
          disabled={isLoading}
          type="button"
          className="btn btn-error btn-sm text-white"
          onClick={() => router.back()}
        >
          {isLoading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            "Cancel"
          )}
        </button>
        <button
          disabled={isLoading}
          type="submit"
          className="btn btn-primary btn-sm text-white"
        >
          {isLoading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            "Submit"
          )}
        </button>
      </div>
    </form>
  );
}
