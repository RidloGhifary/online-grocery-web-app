"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Cities } from "@/constants";
import Form from "./Form";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { GetCaptchaToken } from "@/utils/captcha";
import VerifyCaptchaToken from "@/actions/verifyCaptcha";
import { useUploadThing } from "@/utils/uploadthing";
import { ChangeEvent, useState } from "react";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { createStore } from "@/actions/stores";

const schema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(50, { message: "Name must be less than 50 characters" }),
  store_type: z.enum(["central", "branch"]),
  province: z.string({ required_error: "Province is required" }),
  province_id: z.number({ required_error: "Province is required" }),
  city: z.string({ required_error: "City is required" }),
  city_id: z.number({ required_error: "City is required" }),
  address: z
    .string({ required_error: "Address is required" })
    .min(3, { message: "Address must be at least 3 characters" })
    .max(100, { message: "Address must be less than 100 characters" }),
  kelurahan: z
    .string({ required_error: "Kelurahan is required" })
    .min(3, { message: "Village must be at least 3 characters" })
    .max(100, { message: "Village must be less than 100 characters" }),
  kecamatan: z
    .string({ required_error: "Kecamatan is required" })
    .min(3, { message: "Subdistrict must be at least 3 characters" })
    .max(100, { message: "Subdistrict must be less than 100 characters" }),
});

export type FormData = {
  name: string;
  store_type: "central" | "branch";
  province: string;
  province_id: number;
  city: string;
  city_id: number;
  address: string;
  kelurahan: string;
  kecamatan: string;
};

export default function CreateStore() {
  const [image, setImage] = useState<File[]>([]);
  const [isUploadImageLoading, setIsUploadImageLoading] =
    useState<boolean>(false);
  const router = useRouter();
  const { startUpload } = useUploadThing("imageUploader");
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      store_type: "branch",
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

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: async (data: FormData) => createStore({ formData: data }),
    onSuccess: (res) => {
      if (!res.ok) {
        return toast.error(res.message || res.error);
      } else {
        toast.success(res.message || "Store created successfully!");
        queryClient.invalidateQueries({ queryKey: ["stores"] });
        router.back();
        return;
      }
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong!");
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsUploadImageLoading(true);
    const [city_id, city] = data.city.split(",");
    const [province_id, province] = data.province.split(",");
    let imageUrl;

    if (image.length > 0) {
      const imgRes = await startUpload(image);
      if (imgRes) {
        imageUrl = imgRes[0].url;
      }
    }

    const formattedData = {
      ...data,
      city_id: parseInt(city_id),
      city,
      province_id: parseInt(province_id),
      province,
      image: imageUrl,
    };

    const token = await GetCaptchaToken();
    const isVerified = await VerifyCaptchaToken({ token: token as string });

    if (!isVerified.success) {
      return toast.error("Captcha verification failed!");
    } else {
      setIsUploadImageLoading(false);
      mutate(formattedData);
    }
  };

  const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const fileReader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // Set max size is 1 mb
      if (file.size > 1000000) {
        return toast.error("File size cannot exceed 1mb");
      }

      setImage([file]);

      if (!file.type.includes("image")) return;

      // fileReader.onload = (event) => {
      //   const imageUrlData = event?.target?.result?.toString() || '';
      //   // If you need to handle the image data further, you can do it here
      // };

      fileReader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full space-y-3">
      <button
        onClick={() => router.back()}
        disabled={isLoading || isUploadImageLoading}
        type="button"
        className="btn btn-secondary btn-sm w-fit normal-case"
      >
        <MdOutlineKeyboardArrowLeft />
        Back
      </button>
      <div className="bg-white rounded-md p-5">
        <div className="flex flex-col items-center justify-start gap-2">
          <label
            htmlFor="file"
            className="tooltip tooltip-bottom tooltip-info cursor-pointer"
            data-tip={
              isLoading ? "Uploading image..." : "Click me to upload image"
            }
          >
            {image.length > 0 ? (
              <Image
                alt="store-image"
                src={URL.createObjectURL(image[0])}
                width={400}
                height={400}
                priority
                className="block aspect-square h-32 w-32 rounded-full object-cover md:h-40 md:w-40 lg:h-52 lg:w-52"
              />
            ) : (
              <Image
                alt="store-image"
                src={`/400.svg`}
                width={400}
                height={400}
                priority
                className="block aspect-square h-32 w-32 rounded-full object-cover md:h-40 md:w-40 lg:h-52 lg:w-52"
              />
            )}
          </label>
          <input
            id="file"
            type="file"
            accept="image/*"
            disabled={isLoading || isUploadImageLoading}
            onChange={(e) => handleImage(e)}
            className="file-input file-input-bordered file-input-xs hidden w-full max-w-xs"
          />
        </div>
        <div>
          <Form
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            register={register}
            errors={errors}
            filteredCities={filteredCities}
            isLoading={isLoading || isUploadImageLoading}
          />
        </div>
      </div>
    </div>
  );
}
