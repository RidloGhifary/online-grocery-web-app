import Image from "next/image";

export default function LeftSideProfile() {
  return (
    <div className="mt-4 hidden w-[300px] space-y-4 md:block">
      <Image
        src="/400.svg"
        alt="user-photo"
        width={500}
        height={500}
        priority
        className="aspect-square rounded-full object-cover"
      />
      <div className="space-y-1 text-sm">
        <p>
          Ridlo achmad ghifary{" "}
          <span className="badge badge-primary text-white">male</span>
        </p>
        <p>29 February 2006</p>
        <p>ridloachm@gmail.com</p>
      </div>
    </div>
  );
}
