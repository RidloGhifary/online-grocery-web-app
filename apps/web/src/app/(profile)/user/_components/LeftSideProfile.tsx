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
        <p className="line-clamp-1 truncate">Ridlo achmad ghifary</p>
        <p className="line-clamp-1 truncate">ridloach@gmail.com</p>
        <span className="badge badge-primary text-white">male</span>
      </div>
    </div>
  );
}
