"use client";

import { Provinces } from "@/constants";

export default function Form({
  handleSubmit,
  register,
  errors,
  onSubmit,
  filteredCities,
}: any) {
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Store Name</span>
        </div>
        <input
          type="text"
          placeholder="Type here"
          className="input input-sm input-bordered w-full md:input-md"
          {...register("name")}
        />
        <div className="label">
          <span className="label-text-alt">{errors.name?.message}</span>
        </div>
      </label>
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Store Type</span>
        </div>
        <select
          className="select select-bordered select-sm w-full md:select-md"
          {...register("store_type")}
        >
          <option value="" disabled selected>
            Pick one
          </option>
          <option value="central">Central</option>
          <option value="branch">Branch</option>
        </select>
        <div className="label">
          <span className="label-text-alt">{errors.store_type?.message}</span>
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
          />
          <div className="label">
            <span className="label-text-alt">{errors.kelurahan?.message}</span>
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
          />
          <div className="label">
            <span className="label-text-alt">{errors.kecamatan?.message}</span>
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
          >
            <option value="" disabled selected>
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
            <span className="label-text-alt">{errors.store_type?.message}</span>
          </div>
        </label>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">City</span>
          </div>
          <select
            className="select select-bordered select-sm w-full md:select-md"
            {...register("city")}
          >
            <option value="" disabled selected>
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
            <span className="label-text-alt">{errors.store_type?.message}</span>
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
        ></textarea>
        <div className="label">
          <span className="label-text-alt">{errors.address?.message}</span>
        </div>
      </label>
      <button
        type="submit"
        className="btn btn-primary btn-sm w-full text-white md:btn-md"
      >
        Create
      </button>
    </form>
  );
}
