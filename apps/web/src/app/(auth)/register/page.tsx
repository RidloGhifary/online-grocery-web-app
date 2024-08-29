"use client";

import Link from "next/link";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";

// import { Provinces } from "@/constants";
import { Cities } from "@/constants";
import RegisterForm from "./_components/RegisterForm";
import AuthHeader from "../_components/AuthHeader";
import AuthWrapper from "../_components/AuthWrapper";
import { useMutation } from "@tanstack/react-query";
// import GoogleLoginButton from "../_components/GoogleLoginButton";

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
  kelurahan: z.string().max(255, { message: "Kelurahan too long!" }),
  kecamatan: z.string().max(255, { message: "Kecamatan too long!" }),
});

export type RegisterFormData = {
  first_name: string;
  last_name: string;
  province: string;
  city: string;
  email: string;
  address: string;
  kelurahan: string;
  kecamatan: string;
};

export default function RegisterPage() {
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
      kecamatan: "",
      kelurahan: "",
    },
  });

  const selectedProvince = useWatch({
    control,
    name: "province",
  });

  const filteredCities = Cities.filter((city) => {
    const provinceId = selectedProvince.split(",")[0];
    return city.province_id === provinceId;
  });

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: async (data: RegisterFormData) => {
      const response = await fetch("http://localhost:8000/api/auth/register", {
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
      toast.success("Check your email!", { position: "top-center" });
    },
    onError: () => {
      toast.error("Something went wrong!", { position: "top-center" });
    },
  });

  const onSubmit: SubmitHandler<RegisterFormData> = (data) => {
    const [city_id, city] = data.city.split(",");
    const [province_id, province] = data.province.split(",");
    const formattedData = {
      ...data,
      city_id: parseInt(city_id),
      city,
      province_id: parseInt(province_id),
      province,
    };
    mutate(formattedData);
  };

  return (
    <AuthWrapper>
      <AuthHeader title="Sign up your account" />

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm md:max-w-md lg:max-w-lg">
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
    </AuthWrapper>
  );
}
