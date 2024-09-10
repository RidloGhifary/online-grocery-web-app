"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { getCookies } from "@/actions/cookies";
import { toast } from "react-toastify";

const schema = z.object({
  email: z.string().min(1, "Name is required").max(50, "Name is too long"),
});

interface ChangeNameProps {
  email: string | undefined;
}

export default function ChangeEmail({ email }: ChangeNameProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email,
    },
  });

  const watchedEmail = watch("email");

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: async (data: { email: string }) => {
      const cookie = await getCookies("token");

      const response = await axios.post(
        "http://localhost:8000/api/credentials/change-email",
        data,
        {
          headers: {
            Authorization: `Bearer ${cookie}`,
          },
        },
      );

      return response.data;
    },
    onSuccess: (res) => {
      if (res.ok) {
        toast.success(res.message || "Email verification sent!");
      } else {
        toast.error(res.message || "Something went wrong!");
      }
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong!");
    },
  });

  const isEmailChanged = watchedEmail !== email;

  const onSubmit: (data: z.infer<typeof schema>) => void = async (data) => {
    mutate(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full space-y-6 md:max-w-md"
    >
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          email
        </label>
        <div className="mt-2">
          <input
            id="email"
            type="email"
            placeholder="Enter your new email"
            required
            disabled={isLoading}
            className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 sm:text-sm sm:leading-6"
            {...register("email")}
          />
        </div>
        <p className="mt-2 text-sm text-red-600">{errors.email?.message}</p>
      </div>

      <div className="space-x-2">
        <button
          disabled={isLoading || !isEmailChanged || isSubmitting}
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
          disabled={isLoading || !isEmailChanged || isSubmitting}
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

      <p className="mt-2 text-sm text-red-500">
        Note: please type your email correctly, if you type it incorrectly it
        will cause a problem, you will need to reverify your new email after
        confirming the email.
      </p>
    </form>
  );
}
