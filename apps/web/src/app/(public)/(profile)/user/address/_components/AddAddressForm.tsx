"use client";

import Link from "next/link";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import InputField from "./Input";
import { Cities, Provinces } from "@/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCookies } from "@/actions/cookies";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const schema = z.object({
  label: z.string().min(1, { message: "Label is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  village: z.string().min(1, { message: "village is required" }),
  subdistrict: z.string().min(1, { message: "Subdistrict is required" }),
  city: z.string().min(1, { message: "City is required" }),
  province: z.string().min(1, { message: "Province is required" }),
  is_primary: z.boolean(),
});

type FormData = {
  label: string;
  address: string;
  village: string;
  subdistrict: string;
  city: string;
  province: string;
  is_primary: boolean;
};

export default function AddAddressForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      label: "",
      address: "",
      village: "",
      subdistrict: "",
      city: "",
      province: "",
      is_primary: false,
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
    mutationFn: async (data: FormData) => {
      const cookie = await getCookies("token");
      const response = await axios.post(
        "http://localhost:8000/api/users/addresses",
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
        toast.success(res.message || "Success create address!");
        router.push("/user/address");
        queryClient.invalidateQueries({ queryKey: ["user"] });
      } else {
        toast.error(res.message || "Something went wrong!");
      }
    },
    onError: (res) => {
      toast.error(res.message || "Something went wrong!");
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    const [city_id, city] = data.city.split(",");
    const [province_id, province] = data.province.split(",");

    const formattedData = {
      ...data,
      city_id: parseInt(city_id),
      city,
      province_id: parseInt(province_id),
      province,
      kecamatan: data.subdistrict as string | undefined,
      kelurahan: data.village as string | undefined,
    } as { [key: string]: any };

    delete formattedData.subdistrict;
    delete formattedData.village;

    mutate(formattedData as any);
  };

  return (
    <div className="md:max-w-[85%] lg:max-w-[70%]">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <InputField
          id="label"
          label="Label (home, office, etc.)"
          type="text"
          required
          register={register}
          disabled={isLoading}
          errors={errors.label?.message}
          placeholder="Label"
        />
        <div className="grid w-full grid-cols-2 items-center gap-2">
          <InputField
            id="village"
            label="Village"
            type="text"
            required
            register={register}
            disabled={isLoading}
            errors={errors.village?.message}
            placeholder="Enter your village"
          />

          <InputField
            id="subdistrict"
            label="Subdistrict"
            type="text"
            required
            register={register}
            disabled={isLoading}
            errors={errors.subdistrict?.message}
            placeholder="Enter your subdistrict"
          />
        </div>
        <div className="grid w-full grid-cols-2 items-center gap-2">
          <div className="w-full">
            <label
              htmlFor="province"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Province Address
            </label>
            <div className="mt-2">
              <select
                id="province"
                disabled={isLoading}
                {...register("province")}
                className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 sm:text-sm sm:leading-6"
              >
                <option value="">Select Province</option>
                {Provinces.map((province) => (
                  <option
                    key={province.province_id}
                    value={`${province.province_id},${province.province}`}
                  >
                    {province.province}
                  </option>
                ))}
              </select>
            </div>
            <p className="mt-2 text-sm text-red-600">
              {errors.province?.message}
            </p>
          </div>
          <div className="w-full">
            <label
              htmlFor="city"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              City Address
            </label>
            <div className="mt-2">
              <select
                id="city"
                disabled={isLoading}
                {...register("city")}
                className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 sm:text-sm sm:leading-6"
              >
                <option value="">Select city</option>
                {filteredCities.map(
                  (city: { city_id: string; city_name: string }) => (
                    <option
                      key={city.city_id}
                      value={`${city.city_id},${city.city_name}`}
                    >
                      {city.city_name}
                    </option>
                  ),
                )}
              </select>
            </div>
            <p className="mt-2 text-sm text-red-600">{errors.city?.message}</p>
          </div>
        </div>
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Detail Address
          </label>
          <div className="mt-2">
            <textarea
              id="address"
              required
              placeholder="Jl. Raya No. 1, Jakarta Timur"
              disabled={isLoading}
              rows={5}
              className="block w-full resize-none rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 sm:text-sm sm:leading-6"
              {...register("address")}
            />
          </div>
          <p className="mt-2 text-sm text-red-600">{errors.address?.message}</p>
        </div>
        <div className="flex items-center justify-start gap-2">
          <input
            type="checkbox"
            id="is_primary"
            disabled={isLoading}
            className=""
            {...register("is_primary")}
          />
          <label htmlFor="is_primary" className="label cursor-pointer">
            Use as a default address
          </label>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Link href="/user/address" className="btn btn-link btn-sm">
            {isLoading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Cancel"
            )}
          </Link>
          <button
            disabled={isLoading}
            type="submit"
            className="flex w-fit justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Add Address"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
