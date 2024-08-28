import Image from "next/image";
import { MdEmail } from "react-icons/md";
import { BsGenderFemale, BsGenderMale } from "react-icons/bs";
import { FaUser } from "react-icons/fa";

export default function LeftSideProfile() {
  const gender = "male";

  return (
    <div className="mt-4 hidden w-[300px] space-y-4 rounded-md p-4 shadow md:block">
      <Image
        src="/400.svg"
        alt="user-photo"
        width={500}
        height={500}
        priority
        className="aspect-square rounded-full object-cover"
      />
      <div className="space-y-1 text-sm">
        <div className="line-clamp-1 flex items-center gap-1 truncate">
          <span className="badge badge-primary text-white">{gender}</span>
        </div>
        <div className="line-clamp-1 flex items-center gap-1 truncate">
          <FaUser className="text-primary" size={20} />
          <span>Ridlo achmad ghifary</span>
        </div>
        <div className="line-clamp-1 flex items-center gap-1 truncate">
          <MdEmail className="text-primary" size={20} />
          <span>ridloach@gmail.com</span>
        </div>
      </div>
    </div>
  );
}
