"use client";

import Link from "next/link";
import { useTransition } from "react";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";

import { Cities } from "@/constants";
import RegisterForm from "../_components/RegisterForm";

const schema = z.object({
  first_name: z.string().max(25, { message: "First name too long!" }),
  last_name: z.string().max(25, { message: "Last name too long!" }),
  email: z.string().email({ message: "Enter valid email!" }),
  province: z.string().min(1, {
    message: "Please select a province!",
  }),
  city: z.string().min(1, {
    message: "Please select a city!",
  }),
  address: z.string().max(255, { message: "Address too long!" }),
});

export type RegisterFormData = {
  first_name: string;
  last_name: string;
  province: string;
  city: string;
  email: string;
  address: string;
};

export default function RegisterPage() {
  const [isLoading, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      province: "",
      city: "",
      address: "",
    },
  });

  const selectedProvince = useWatch({
    control,
    name: "province",
  });

  const filteredCities = Cities.filter(
    (city) => city.province_id === selectedProvince,
  );

  const onSubmit: SubmitHandler<RegisterFormData> = (data) => {
    startTransition(() => {
      console.log(data);
      toast.success("Register success!", {
        position: "top-center",
      });
    });
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign up your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <RegisterForm
            isLoading={isLoading}
            register={register}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            errors={errors}
            filteredCities={filteredCities}
          />

          <p className="mt-10 text-center text-sm text-gray-500">
            Already a member?{" "}
            <Link
              href="/login"
              className="font-semibold leading-6 text-primary hover:text-primary/70"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
