"use client";

import { Provinces } from "@/constants";
import { UseFormRegister } from "react-hook-form";
import { RegisterFormData } from "../page";
import GoogleLoginButton from "../../_components/GoogleLoginButton";
import InputField from "./Input";

interface RegisterFormProps {
  isLoading: boolean;
  register: UseFormRegister<RegisterFormData>;
  handleSubmit: any;
  onSubmit: (data: RegisterFormData) => void | any;
  errors: any;
  filteredCities: City[];
}

type City = {
  city_id: string;
  province_id: string;
  province: string;
  type: string;
  city_name: string;
  postal_code: string;
};

export default function RegisterForm({
  isLoading,
  register,
  handleSubmit,
  onSubmit,
  errors,
  filteredCities,
}: RegisterFormProps) {
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-2">
        <InputField
          id="first_name"
          label="First name"
          type="text"
          placeholder="John"
          disabled={isLoading}
          register={register}
          errors={errors.first_name?.message}
        />
        <InputField
          id="last_name"
          label="Last name"
          type="text"
          placeholder="Doe"
          disabled={isLoading}
          register={register}
          errors={errors.last_name?.message}
        />
      </div>

      <InputField
        id="email"
        label="Email"
        type="email"
        placeholder="johndoe@john.com"
        disabled={isLoading}
        register={register}
        errors={errors.email?.message}
      />

      <div className="grid grid-cols-2 gap-2">
        <div>
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

        <div>
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

      <InputField
        id="kelurahan"
        label="Village"
        type="text"
        placeholder="Village"
        disabled={isLoading}
        register={register}
        errors={errors.kelurahan?.message}
      />
      <InputField
        id="kecamatan"
        label="Subdistrict"
        type="text"
        placeholder="Subdistrict"
        disabled={isLoading}
        register={register}
        errors={errors.kecamatan?.message}
      />

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

      <div>
        <button
          disabled={isLoading}
          type="submit"
          className="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
        >
          {isLoading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            "Sign up"
          )}
        </button>
      </div>
      <hr />
      <GoogleLoginButton disabled={isLoading} />
    </form>
  );
}
