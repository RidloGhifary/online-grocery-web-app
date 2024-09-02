"use client";

import Image from "next/image";
import { UploadButton } from "@/utils/uploadthing";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { getCookies } from "@/actions/cookies";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function UserPhotoBox({
  userImage,
}: {
  userImage: string | undefined | null;
}) {
  const router = useRouter();

  const { mutate, isPending: mutationIsLoading } = useMutation({
    mutationFn: async (data: { image: string | null }) => {
      const cookie = await getCookies("token");
      const field = data.image ? "image" : "remove_image";
      const response = await axios.patch(
        `http://localhost:8000/api/users/biodata?field=${field}`,
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
        toast.success(res.message || "Photo updated!");
        router.refresh();
        return;
      } else {
        toast.error(res.message || "Something went wrong!");
        return;
      }
    },
    onError: (res) => {
      toast.error(res.message || "Something went wrong!");
    },
  });

  return (
    <div className="grid w-full grid-cols-2 gap-3 rounded-md p-2 shadow md:w-[180px] md:grid-cols-1 lg:w-[280px]">
      <div className="aspect-square w-full overflow-hidden rounded-md">
        <Image
          src={userImage || "/400.svg"}
          alt="user-photo"
          priority
          width={500}
          height={500}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-col-reverse justify-between gap-2 overflow-hidden">
        <UploadButton
          endpoint="imageUploader"
          className="btn btn-primary btn-sm flex max-w-full text-white"
          content={{
            button({ ready }) {
              if (ready) return <div>Upload stuff</div>;

              return "Getting ready...";
            },
            allowedContent({ ready, fileTypes, isUploading }) {
              if (!ready) return "Checking what you allow";
              if (isUploading) return "Uploading...";
              return `Change image`;
            },
          }}
          appearance={{
            button: {
              color: "white",
              width: "100%",
              fontSize: "6px",
            },
          }}
          onClientUploadComplete={(res) => {
            mutate({ image: res[0].url });
            toast.success("Image uploaded");
          }}
          onUploadError={(error: Error) => {
            toast.error(error.message || "Something went wrong!");
          }}
          onUploadProgress={() => {
            toast.info(`Uploading...`);
          }}
        />
        <button
          className="btn btn-error btn-sm text-white"
          disabled={mutationIsLoading || !userImage}
          onClick={() => {
            mutate({ image: null });
          }}
        >
          {mutationIsLoading ? "Wait..." : "Remove"}
        </button>
        <div className="text-xs text-slate-700 md:text-sm">
          <p>
            Maximum file size is 1MB and only allowed jpg, jpeg, png formats
          </p>
        </div>
      </div>
    </div>
  );
}
