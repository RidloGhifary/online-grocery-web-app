"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTransition } from "react";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import AuthHeader from "../_components/AuthHeader";
import AuthWrapper from "../_components/AuthWrapper";
import { useMutation } from "@tanstack/react-query";

const schema = z
  .object({
    password: z.string().min(8, { message: "Password too short!" }),
    confirm_password: z.string().min(8, { message: "Password too short!" }),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Passwords do not match!",
  });

type FormData = {
  password: string;
  confirm_password: string;
};

export default function VerifyAccountPage() {
  const [isLoading, startTransition] = useTransition();
  const searchParams = useSearchParams();

  const key = searchParams.get("key");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
      confirm_password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: { key: string; password: string }) => {
      const response = await fetch(
        "http://localhost:8000/api/auth/verify-account",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );

      return await response.json();
    },
    onSuccess: (res) => {
      startTransition(() => {
        if (!res.ok) {
          toast.error(res.message || "Something went wrong!", {
            position: "top-center",
          });
          return;
        }
        toast.success("Verify account success!", { position: "top-center" });
        router.push("/login");
      });
    },
    onError: () => {
      toast.error("Something went wrong!", { position: "top-center" });
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    if (!key) return;

    startTransition(() => {
      const formattedData = { key, password: data.password };
      mutation.mutate(formattedData);
    });
  };

  return (
    <AuthWrapper>
      <AuthHeader title="Verify your account" />

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm md:max-w-md lg:max-w-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                type="password"
                placeholder="Create your password"
                required
                disabled={isLoading}
                className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 sm:text-sm sm:leading-6"
                {...register("password")}
              />
            </div>
            <p className="mt-2 text-sm text-red-600">
              {errors.password?.message}
            </p>
          </div>

          <div>
            <label
              htmlFor="confirm_password"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Confirm Password
            </label>
            <div className="mt-2">
              <input
                id="confirm_password"
                type="password"
                placeholder="Confirm your password"
                required
                disabled={isLoading}
                className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 sm:text-sm sm:leading-6"
                {...register("confirm_password")}
              />
            </div>
            <p className="mt-2 text-sm text-red-600">
              {errors.confirm_password?.message}
            </p>
          </div>

          <div>
            <button
              disabled={isLoading}
              type="submit"
              className="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Verify Account"
              )}
            </button>
          </div>
        </form>
      </div>
    </AuthWrapper>
  );
}
