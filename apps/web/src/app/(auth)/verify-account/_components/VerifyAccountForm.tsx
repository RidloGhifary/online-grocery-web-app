"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { GetCaptchaToken } from "@/utils/captcha";
import VerifyCaptchaToken from "@/actions/verifyCaptcha";
import { verifyAccount } from "@/actions/auth";

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

export default function VerifyAccountForm({ api_url }: { api_url: string }) {
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

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: async (data: { key: string; password: string }) =>
      verifyAccount({ key: data.key, password: data.password }),
    onSuccess: (res) => {
      if (!res.ok) {
        return toast.error(res.message || "Something went wrong!");
      }
      toast.success("Verify account success!");
      router.push("/login");
    },
    onError: (res: any) => {
      toast.error(res?.response.data.message || "Something went wrong!");
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!key) return;

    const formattedData = { key, password: data.password };

    const token = await GetCaptchaToken();
    const isVerified = await VerifyCaptchaToken({ token: token as string });
    if (!isVerified.success) {
      toast.error("Captcha verification failed!");
      return;
    } else {
      mutate(formattedData);
    }
  };

  return (
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
  );
}
