"use client";

import { Provinces } from "@/constants";
import { StoreProps } from "@/interfaces/store";
import Image from "next/image";
import { FormData } from "./EditStore";
import {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form";
import { useRouter } from "next/navigation";

interface FormEditStoreProps {
  handleSubmit: UseFormHandleSubmit<FormData>;
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  onSubmit: (data: FormData) => void;
  filteredCities: { city_id: string; city_name: string }[];
  isLoading: boolean;
  store: false | StoreProps | undefined;
  handleImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  image: string | undefined;
}

export default function FormEditStore({
  handleSubmit,
  register,
  errors,
  onSubmit,
  filteredCities,
  isLoading,
  store,
  handleImage,
  image,
}: FormEditStoreProps) {
  const router = useRouter();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="flex items-center justify-center">
        <label
          htmlFor="file"
          className={`cursor-pointer ${isLoading && "opacity-70"}`}
        >
          <Image
            src={image || (store && store?.image) || "/store.webp"}
            alt="store image"
            width={200}
            height={200}
            priority
            className="aspect-square h-[150px] w-[150px] rounded-full object-cover"
          />
        </label>
        <input
          id="file"
          type="file"
          accept="image/*"
          disabled={isLoading}
          onChange={(e) => handleImage(e)}
          className="file-input file-input-bordered file-input-xs hidden w-full max-w-xs"
        />
      </div>
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Store Name</span>
        </div>
        <input
          type="text"
          placeholder="Type here"
          className="input input-sm input-bordered w-full md:input-md"
          {...register("name")}
          disabled={isLoading}
        />
        <div className="label">
          <span className="label-text-alt text-rose-500">
            {errors.name?.message}
          </span>
        </div>
      </label>
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Store Type</span>
        </div>
        <select
          className="select select-bordered select-sm w-full md:select-md"
          {...register("store_type")}
          disabled={isLoading}
        >
          <option value="" disabled>
            Pick one
          </option>
          <option value="central">Central</option>
          <option value="branch">Branch</option>
        </select>
        <div className="label">
          <span className="label-text-alt text-rose-500">
            {errors.store_type?.message}
          </span>
        </div>
      </label>
      <div className="grid grid-cols-2 gap-1">
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Village</span>
          </div>
          <input
            type="text"
            placeholder="Village"
            className="input input-sm input-bordered w-full md:input-md"
            {...register("kelurahan")}
            disabled={isLoading}
          />
          <div className="label">
            <span className="label-text-alt text-rose-500">
              {errors.kelurahan?.message}
            </span>
          </div>
        </label>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Subdistrict</span>
          </div>
          <input
            type="text"
            placeholder="Subdistrict"
            className="input input-sm input-bordered w-full md:input-md"
            {...register("kecamatan")}
            disabled={isLoading}
          />
          <div className="label">
            <span className="label-text-alt text-rose-500">
              {errors.kecamatan?.message}
            </span>
          </div>
        </label>
      </div>
      <div className="grid grid-cols-2 gap-1">
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Province</span>
          </div>
          <select
            className="select select-bordered select-sm w-full md:select-md"
            {...register("province")}
            disabled={isLoading}
          >
            <option value="" disabled>
              Pick one
            </option>
            {Provinces.map((province) => (
              <option
                key={province.province_id}
                value={`${province.province_id},${province.province}`}
              >
                {province.province}
              </option>
            ))}
          </select>
          <div className="label">
            <span className="label-text-alt text-rose-500">
              {errors.store_type?.message}
            </span>
          </div>
        </label>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">City</span>
          </div>
          <select
            className="select select-bordered select-sm w-full md:select-md"
            {...register("city")}
            disabled={isLoading}
          >
            <option value="" disabled>
              Pick one
            </option>
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
          <div className="label">
            <span className="label-text-alt text-rose-500">
              {errors.store_type?.message}
            </span>
          </div>
        </label>
      </div>
      <label className="form-control">
        <div className="label">
          <span className="label-text">Detail Address</span>
        </div>
        <textarea
          className="textarea textarea-bordered textarea-sm h-24 resize-none md:textarea-md"
          placeholder="Detail address"
          {...register("address")}
          disabled={isLoading}
        ></textarea>
        <div className="label">
          <span className="label-text-alt text-rose-500">
            {errors.address?.message}
          </span>
        </div>
      </label>
      <button
        disabled={isLoading}
        type="submit"
        className="btn btn-primary btn-sm w-full text-white md:btn-md"
      >
        {isLoading ? "Loading..." : "Update"}
      </button>
    </form>
  );
}
