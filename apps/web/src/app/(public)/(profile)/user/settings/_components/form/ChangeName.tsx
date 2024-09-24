"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { updateProfile } from "@/actions/user";

const schema = z.object({
  username: z.string().min(1, "Name is required").max(50, "Name is too long"),
});

interface ChangeNameProps {
  username: string | undefined;
}

export default function ChangeName({ username }: ChangeNameProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      username,
    },
  });

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: async (data: { username: string }) =>
      updateProfile({ username: data.username }),
    onSuccess: (res) => {
      if (res.ok) {
        toast.success(res.message || "Username updated!");
        router.push("/user/settings");
        router.refresh();
      } else {
        toast.error(res.message || "Something went wrong!");
      }
    },
    onError: (res) => {
      const errorMessage =
        res instanceof Error ? res.message : "Something went wrong!";
      toast.error(errorMessage);
    },
  });

  const onSubmit: (data: z.infer<typeof schema>) => void = (data) => {
    mutate(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full space-y-6 md:max-w-md"
    >
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Username
        </label>
        <div className="mt-2">
          <input
            id="username"
            type="username"
            placeholder="Enter your new username"
            required
            disabled={isLoading}
            className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 sm:text-sm sm:leading-6"
            {...register("username")}
          />
        </div>
        <p className="mt-2 text-sm text-red-600">{errors.username?.message}</p>
      </div>

      <div className="space-x-2">
        <button
          disabled={isLoading}
          type="button"
          className="btn btn-error btn-sm text-white"
          onClick={() => router.back()}
        >
          {isLoading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            "Cancel"
          )}
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
