"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getCookies } from "@/actions/cookies";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { StoreProps } from "@/interfaces/store";
import { ChangeEvent, useState } from "react";
import { useUploadThing } from "@/utils/uploadthing";
import { Cities } from "@/constants";
import { GetCaptchaToken } from "@/utils/captcha";
import VerifyCaptchaToken from "@/actions/verifyCaptcha";
import FormEditStore from "./FormEditStore";

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

interface EditStoreProps {
  id: number;
  api_url: string;
  store: false | StoreProps | undefined;
}

export default function EditStore({ id, api_url, store }: EditStoreProps) {
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
      name: (store && store?.name) || "",
      store_type: (store && (store?.store_type as any)) || "central",
      province:
        (store && `${store.province.id},${store.province.province}`) || "",
      province_id: (store && store?.province?.id) || 0,
      city: (store && `${store.city.id},${store.city.city_name}`) || "",
      city_id: (store && store?.city?.id) || 0,
      address: (store && store?.address) || "",
      kelurahan: (store && store?.kelurahan) || "",
      kecamatan: (store && store?.kecamatan) || "",
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
      const token = await getCookies("token");
      if (!token) return;

      const res = await axios.patch(`${api_url}/stores/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    },
    onSuccess: (res) => {
      if (!res.ok) {
        return toast.error(res.message || "Something went wrong!");
      } else {
        toast.success(res.message || "Store created successfully!");
        router.push("/user/stores");
        router.refresh();
        queryClient.invalidateQueries({ queryKey: ["stores"] });
        return;
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Something went wrong!");
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
    <FormEditStore
      onSubmit={onSubmit}
      store={store}
      handleSubmit={handleSubmit}
      register={register}
      errors={errors}
      filteredCities={filteredCities}
      isLoading={isUploadImageLoading || isLoading}
      handleImage={handleImage}
      image={image.length > 0 ? URL.createObjectURL(image[0]) : undefined}
    />
  );
}
