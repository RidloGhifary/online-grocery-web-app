"use client";

import Link from "next/link";
import { useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";
import GoogleLoginButton from "../_components/GoogleLoginButton";
import AuthHeader from "../_components/AuthHeader";
import AuthWrapper from "../_components/AuthWrapper";

const schema = z.object({
  email: z.string().email({ message: "Enter valid email!" }),
  password: z.string(),
});

type FormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const [isLoading, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    startTransition(() => {
      console.log(data);
      toast.success("Login success!", {
        position: "top-center",
      });
    });
  };

  return (
    <AuthWrapper>
      <AuthHeader title="Sign in to your account" />

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                placeholder="Enter your email"
                required
                disabled={isLoading}
                className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 sm:text-sm sm:leading-6"
                {...register("email")}
              />
            </div>
            <p className="mt-2 text-sm text-red-600">{errors.email?.message}</p>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="text-sm">
                <span className="font-semibold text-primary hover:text-primary/70">
                  Forgot password?
                </span>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
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
            <button
              disabled={isLoading}
              type="submit"
              className="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Sign in"
              )}
            </button>
          </div>
          <hr />
          <GoogleLoginButton />
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Not a member?{" "}
          <Link
            href="/register"
            className="font-semibold leading-6 text-primary hover:text-primary/70"
          >
            Register here
          </Link>
        </p>
      </div>
    </AuthWrapper>
  );
}
