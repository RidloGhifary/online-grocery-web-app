"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";

const schema = z.object({
  gender: z.enum(["male", "female"]),
});

interface ChangeGenderProps {
  gender: "male" | "female" | undefined;
}

export default function ChangeGender({ gender }: ChangeGenderProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      gender: gender || "male",
    },
  });

  const onSubmit: (data: z.infer<typeof schema>) => void = (data) => {
    console.log(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full space-y-6 md:max-w-md"
    >
      <div>
        <label
          htmlFor="gender"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Gender
        </label>
        <div className="mt-2">
          <select
            {...register("gender")}
            required
            disabled={isLoading}
            id="gender"
            className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 sm:text-sm sm:leading-6"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <p className="mt-2 text-sm text-red-600">{errors.gender?.message}</p>
      </div>

      <div className="space-x-2">
        <button
          disabled={isLoading}
          type="button"
          className="btn btn-error btn-sm text-white"
          onClick={() => router.back()}
        >
          Cancel
        </button>
        <button
          disabled={isLoading}
          type="submit"
          className="btn btn-primary btn-sm text-white"
        >
          {isLoading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            "Submit"
          )}
        </button>
      </div>
    </form>
  );
}
