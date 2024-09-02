"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Provinces, Cities } from "@/constants";
import Form from "./Form";
import Image from "next/image";

interface Props {
  api_url: string;
}

const schema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(50, { message: "Name must be less than 50 characters" }),
  image: z.string().url({ message: "Invalid image url" }).optional(),
  store_type: z.enum(["central", "branch"]),
  province: z.string({ required_error: "Province is required" }),
  province_id: z.number({ required_error: "Province is required" }),
  city: z.string({ required_error: "City is required" }),
  city_id: z.number({ required_error: "City is required" }),
  address: z
    .string({ required_error: "Address is required" })
    .max(100, { message: "Address must be less than 100 characters" }),
  kelurahan: z
    .string({ required_error: "Kelurahan is required" })
    .max(100, { message: "Address must be less than 100 characters" }),
  kecamatan: z
    .string({ required_error: "Kecamatan is required" })
    .max(100, { message: "Address must be less than 100 characters" }),
});

type FormData = {
  name: string;
  image: string;
  store_type: "central" | "branch";
  province: string;
  province_id: number;
  city: string;
  city_id: number;
  address: string;
  kelurahan: string;
  kecamatan: string;
};

export default function CreateStoreForm({ api_url }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      image: "",
      store_type: "central",
      province: "",
      province_id: 0,
      city: "",
      city_id: 0,
      address: "",
      kelurahan: "",
      kecamatan: "",
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

  const onSubmit: SubmitHandler<FormData> = (data) => {
    const [city_id, city] = data.city.split(",");
    const [province_id, province] = data.province.split(",");
    const formattedData = {
      ...data,
      city_id: parseInt(city_id),
      city,
      province_id: parseInt(province_id),
      province,
    };

    console.log("🚀 ~ CreateStoreForm ~ formattedData:", formattedData);
  };

  return (
    <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2">
      <div className="flex flex-col items-center justify-start gap-2">
        <label
          htmlFor="file"
          className="tooltip tooltip-bottom tooltip-info cursor-pointer"
          data-tip="Click me to upload image"
        >
          <Image
            alt="store-image"
            src={`/400.svg`}
            width={400}
            height={400}
            className="block aspect-square h-32 w-32 rounded-full object-cover md:h-40 md:w-40 lg:h-52 lg:w-52"
          />
        </label>
        <input
          id="file"
          type="file"
          className="file-input file-input-bordered file-input-xs hidden w-full max-w-xs"
          {...register("image")}
        />
      </div>
      <div>
        <Form
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          register={register}
          errors={errors}
          filteredCities={filteredCities}
        />
      </div>
    </div>
  );
}
