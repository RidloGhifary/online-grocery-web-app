import Image from "next/image";

export default function UserPhotoBox() {
  return (
    <div className="grid w-full grid-cols-2 gap-3 rounded-md p-2 shadow md:w-[200px] md:grid-cols-1 lg:w-[300px]">
      <div className="aspect-square w-full overflow-hidden rounded-md">
        <Image
          src="/400.svg"
          alt="user-photo"
          priority
          width={500}
          height={500}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-col-reverse justify-between gap-2">
        <form>
          <input type="file" id="file" className="hidden" />
          <label
            htmlFor="file"
            className="btn btn-primary btn-xs w-full text-white md:btn-sm"
          >
            Change image
          </label>
        </form>
        <div className="text-xs text-slate-700 md:text-sm">
          <p>
            Maximum file size is 1MB and only allowed jpg, jpeg, png formats
          </p>
        </div>
      </div>
    </div>
  );
}
