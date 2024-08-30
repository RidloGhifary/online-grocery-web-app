"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import AuthHeader from "../_components/AuthHeader";
import AuthWrapper from "../_components/AuthWrapper";
import { useMutation } from "@tanstack/react-query";

const passwordResetSchema = z
  .object({
    password: z.string().min(8, { message: "Password too short!" }),
    confirm_password: z.string().min(8, { message: "Password too short!" }),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Passwords do not match!",
  });

const emailSchema = z.object({
  email: z.string().email({ message: "Enter valid email!" }),
});

type PasswordResetFormData = {
  password: string;
  confirm_password: string;
};

type EmailFormData = {
  email: string;
};

export default function ForgotPassword() {
  const searchParams = useSearchParams();

  const key = searchParams.get("key");
  const router = useRouter();

  const formOptions = key
    ? {
        resolver: zodResolver(passwordResetSchema),
        defaultValues: { password: "", confirm_password: "" },
      }
    : { resolver: zodResolver(emailSchema), defaultValues: { email: "" } };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordResetFormData | EmailFormData | any>(formOptions);

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: async (data: {
      key?: string | null;
      password?: string;
      email?: string;
    }) => {
      const endpoint = key
        ? `/api/credentials/reset-password?key=${key}`
        : "/api/credentials/reset-password";
      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      return await response.json();
    },
    onSuccess: (res) => {
      if (!res.ok) {
        toast.error(res.message || "Something went wrong!", {
          position: "top-center",
        });
        return;
      }
      toast.success("Password reset successfully!", {
        position: "top-center",
      });
      if (key) {
        router.push("/login");
      }
    },
    onError: () => {
      toast.error("Something went wrong!", { position: "top-center" });
    },
  });

  const onSubmit: SubmitHandler<PasswordResetFormData | EmailFormData> = (
    data,
  ) => {
    mutate({ ...data, key });
  };

  return (
    <AuthWrapper>
      <AuthHeader
        title={!key ? "Confirm your email" : "Confirm new password"}
      />

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm md:max-w-md lg:max-w-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {key ? (
            <>
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
                  {errors.password?.message as any}
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
                  {errors.confirm_password?.message as any}
                </p>
              </div>
            </>
          ) : (
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  type="email"
                  placeholder="Put your email"
                  required
                  disabled={isLoading}
                  className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 sm:text-sm sm:leading-6"
                  {...register("email")}
                />
              </div>
              <p className="mt-2 text-sm text-red-600">
                {(errors?.email?.message as any) || ""}
              </p>
            </div>
          )}

          <div>
            <button
              disabled={isLoading}
              type="submit"
              className="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : !key ? (
                "Send email"
              ) : (
                "Confirm new password"
              )}
            </button>
          </div>
        </form>
      </div>
    </AuthWrapper>
  );
}
