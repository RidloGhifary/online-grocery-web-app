"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ButtonWithAction from "../ui/ButtonWithAction";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/queryKeys";
import Select from "react-select";
import CommonResultInterface from "@/interfaces/CommonResultInterface";
import { UploadDropzone } from "@/utils/uploadthing";
import { FaCheck, FaRegSave, FaTrash } from "react-icons/fa";
import Image from "next/image";
import { Bounce, toast } from "react-toastify";
import { useSearchParams } from "next/navigation";
import { useAtom } from "jotai";
import { getAllRoleList } from "@/actions/role";
import { currentAdminOperationAtom, currentDetailAdminAtom } from "@/stores/adminStores";
import { createAdmin, updateAdmin } from "@/actions/admin";
import { UserInputInterface, UserInterface, UserUpdateInputInterface } from "@/interfaces/user";
import Button from "../ui/ButtonWithAction";

// Define the Zod schema for validation
const adminSchema = z.object({
  id:z.number().positive('ID should be in valid format'),
  username: z.string().min(1, { message: "Username is required" }).optional(),
  email: z.string().email({ message: "Invalid email address" }),
  phone_number: z.string().nullable().optional().optional(),
  first_name: z.string().min(1, { message: "First name is required" }).optional(),
  last_name: z.string().min(1, { message: "Last name is required" }).optional(),
  gender: z.enum(["male", "female"]).optional(),
  password: z.string().min(1, { message: "Password is required" }).optional().nullable(),
  middle_name: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  role_id: z.number().int().min(1, { message: "Role is required" }).optional(), // Add the image field
});

// TypeScript type for the form values
type AdminFormValues = z.infer<typeof adminSchema>;

export default function AdminUpdateForm() {
  const queryClient = useQueryClient();
  const queryParams = useSearchParams();
  const [currentData, setCurrentData] = useAtom(currentDetailAdminAtom)

  const [, setCurrentOperation] = useAtom(currentAdminOperationAtom);
  const { data: rolesData, isLoading: roleLoading } = useQuery({
    queryKey: [queryKeys.roles],
    queryFn: async () => await getAllRoleList({}),
  });

  // Check if rolesData is valid and contains data
  const roles = Array.isArray(rolesData?.data?.data) ? rolesData.data.data : [];

  const [uploadedImages, setUploadedImages] = useState<string>();
  

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<AdminFormValues>({
    resolver: zodResolver(adminSchema),
    defaultValues: currentData,
  });
  useEffect(() => {
    reset(currentData);
  }, [currentData, reset]);
  const mutation = useMutation({
    mutationFn: updateAdmin,
    onSuccess: () => {
      toast.success("Success add data", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
        // containerId:10912
      });
      const params = {
        search: queryParams.get("search") || "",
        orderField: queryParams.get("orderField") || "name",
        order: (queryParams.get("order") as "asc" | "desc") || "asc",
        page: Number(queryParams.get("page")) || 1,
        limit: Number(queryParams.get("limit")) || 20,
      };
      setTimeout(() => {
        mutation.reset();
      }, 500);
      return queryClient.invalidateQueries({
        queryKey: [queryKeys.adminList, { ...params }],
      });
      // setTimeout(()=>{router.refresh();},2000)
      // router.refresh();
    },
    onError: (e) => {
      let error: any = "";
      if (typeof JSON.parse(e.message) === "string") {
        error = JSON.parse(
          JSON.parse(e.message),
        ) as unknown as CommonResultInterface<UserInterface>;
        error = (error as unknown as CommonResultInterface<UserInterface>)
          .error;
      } else {
        error = JSON.parse(
          e.message,
        ) as unknown as CommonResultInterface<UserInterface>;
        error = (error as unknown as CommonResultInterface<UserInterface>)
          .error;
      }

      if (typeof error === "object") {
        if (Array.isArray(error)) {
          // console.log(error);
          (error as Array<{ message: string }>).forEach((e, i) => {
            toast.error(e.message, {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
              theme: "colored",
              transition: Bounce,
              containerId: 10912,
              // toastId:i
            });
          });
        }
      } else {
        toast.error(error.error, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
          containerId: 10912,
        });
      }
    },
  });
  
  const onSubmit = (data: AdminFormValues) => {
    // Create a copy of the submitted data
    const modifiedData = { ...data };

    // Iterate over the keys of the submitted data
    Object.keys(data).forEach((key) => {
      // Skip the 'id' field
      if (key === "id") return;

      // Compare the submitted value with the initial value
      type CommonKeys = keyof AdminFormValues &
        keyof UserInterface;

      if (data[key as CommonKeys] === currentData?.[key as CommonKeys]) {
        // If the value is the same as the initial data, delete the field
        delete modifiedData[key as keyof AdminFormValues];
      }
    });

    // Check if there are any changes (i.e., modifiedData contains more than just the 'id')
    if (Object.keys(modifiedData).length > 1) {
      // Submit the modified data
      mutation.mutate(modifiedData as UserUpdateInputInterface);
    } else {
      // No changes, notify the user or handle accordingly
      toast.info("No changes to update", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
        toastId: 3,
        containerId: 10912,
      });
    }
  };

  // Transform roles data for React Select
  const roleOptions = roles?.map((role) => ({
    value: role.id,
    label: role.display_name || role.name,
  }));

  const genderOption: { value: string; label: string }[] = [
    {
      value: "male",
      label: "Male",
    },
    {
      value: "female",
      label: "Female",
    },
  ];

  // Handle successful upload and set image URLs
  const handleUploadComplete = (url: string) => {
    setUploadedImages(url);
    // console.log(url);
    setValue("image", url);
  };

  // Handle image removal
  const removeImage = () => {
    setUploadedImages(undefined);
    setValue("image", uploadedImages);
  };
  useEffect(() => {
    if (mutation.isSuccess) {
      console.log("success");
      queryClient.invalidateQueries({
        queryKey: [queryKeys.adminList],
      });
      setCurrentOperation("idle");
    }
  }, [mutation.isSuccess]);

  if (!currentData) {
    return <></>
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h1 className="text-center text-xl font-extrabold">Add Admin</h1>

      {/* Username */}
      <label className="form-control w-full">
        <div className="label font-bold">
          <span className="label-text">Username</span>
        </div>
        <input
          type="text"
          placeholder="Type here"
          className={`input input-bordered w-full ${errors.username ? "input-error" : ""}`}
          disabled={mutation.isSuccess}
          {...register("username")}
        />
        {errors.username && (
          <p className="text-red-500">{errors.username.message}</p>
        )}
      </label>

      {/* Email */}
      <label className="form-control w-full">
        <div className="label font-bold">
          <span className="label-text">Email</span>
        </div>
        <input
          type="text"
          placeholder="Type here"
          className={`input input-bordered w-full ${errors.email ? "input-error" : ""}`}
          disabled={mutation.isSuccess}
          {...register("email")}
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </label>

      {/* Password */}
      <label className="form-control w-full">
        <div className="label font-bold">
          <span className="label-text">Password</span>
        </div>
        <input
          type="password"
          placeholder="Type here"
          className={`input input-bordered w-full ${errors.password ? "input-error" : ""}`}
          disabled={mutation.isSuccess}
          {...register("password")}
        />
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}
      </label>

      {/* Role */}
      <label className="form-control w-full">
        <div className="label font-bold">
          <span className="label-text">Role</span>
        </div>

        <Select
          instanceId={"adminAdminFormInModal"}
          options={roleOptions}
          onChange={(option) => setValue("role_id", option?.value || 2)}
          placeholder="Select a role"
          value={roleOptions?.find(
            (option) => option.value === watch("role_id"),
          )}
          isDisabled={mutation.isSuccess}
          isLoading={roleLoading}
          loadingMessage={() => (
            <span className="loading loading-spinner loading-xs"></span>
          )}
        />
        {errors.role_id && (
          <p className="text-red-500">{errors.role_id.message}</p>
        )}
      </label>

      {/* First Name */}
      <label className="form-control w-full">
        <div className="label font-bold">
          <span className="label-text">First Name</span>
        </div>
        <input
          type="text"
          placeholder="Type here"
          className={`input input-bordered w-full ${errors.first_name ? "input-error" : ""}`}
          disabled={mutation.isSuccess}
          {...register("first_name")}
        />
        {errors.first_name && (
          <p className="text-red-500">{errors.first_name.message}</p>
        )}
      </label>

      {/* Last Name */}
      <label className="form-control w-full">
        <div className="label font-bold">
          <span className="label-text">Last Name</span>
        </div>
        <input
          type="text"
          placeholder="Type here"
          className={`input input-bordered w-full ${errors.last_name ? "input-error" : ""}`}
          disabled={mutation.isSuccess}
          {...register("last_name")}
        />
        {errors.last_name && (
          <p className="text-red-500">{errors.last_name.message}</p>
        )}
      </label>

      {/* Middle Name */}
      <label className="form-control w-full">
        <div className="label font-bold">
          <span className="label-text">Middle Name</span>
        </div>
        <input
          type="text"
          placeholder="Type here"
          className={`input input-bordered w-full ${errors.middle_name ? "input-error" : ""}`}
          disabled={mutation.isSuccess}
          {...register("middle_name")}
        />
        {errors.middle_name && (
          <p className="text-red-500">{errors.middle_name.message}</p>
        )}
      </label>

      {/* Gender */}
      <label className="form-control w-full">
        <div className="label font-bold">
          <span className="label-text">Gender</span>
        </div>
        <Select
          instanceId={"adminGenderSelect"}
          options={genderOption} // Gender options (male/female)
          onChange={(option) =>
            setValue("gender", (option?.value as "male" | "female") || "male")
          }
          placeholder="Select gender"
          value={genderOption.find(
            (option) => option.value === watch("gender"),
          )}
          isDisabled={mutation.isSuccess}
        />
        {errors.gender && (
          <p className="text-red-500">{errors.gender.message}</p>
        )}
      </label>
      {/* Phone Number */}
      <label className="form-control w-full">
        <div className="label font-bold">
          <span className="label-text">Phone Number</span>
        </div>
        <input
          type="text"
          placeholder="Type here"
          className={`input input-bordered w-full ${errors.phone_number ? "input-error" : ""}`}
          disabled={mutation.isSuccess}
          {...register("phone_number")}
        />
        {errors.phone_number && (
          <p className="text-red-500">{errors.phone_number.message}</p>
        )}
      </label>

      {/* Image upload section */}
      <div className="form-control">
        <div className="label font-bold">
          <span className="label-text">Images</span>
        </div>
        <div className="flex w-full items-center justify-center">
          {uploadedImages && (
            <Image
              className="my-2 max-w-96"
              src={uploadedImages}
              alt="Uploaded"
              width={400}
              height={400}
              quality={90}
            />
          )}
        </div>
        {uploadedImages && (
          <Button
            replaceTWClass="btn btn-error btn-sm"
            action={removeImage}
            eventType="onClick"
            type="button"
          >
            Delete Image
            <FaTrash />
          </Button>
        )}
        <div className="flex max-w-full flex-col items-center justify-center">
          <UploadDropzone
            className="w-full cursor-pointer"
            endpoint="adminImage"
            config={{ mode: "auto" }}
            disabled={mutation.isSuccess}
            onClientUploadComplete={(res) => {
              handleUploadComplete(res[0].url);
            }}
          />
        </div>
      </div>

      <div className="flex max-w-full justify-end py-5">
        <ButtonWithAction type="submit" replaceTWClass="btn btn-primary btn-sm">
          Save <FaRegSave />
          {mutation.isPending ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : mutation.isSuccess ? (
            <>
              <FaCheck />
            </>
          ) : (
            ""
          )}
        </ButtonWithAction>
      </div>
    </form>
  );
}
