import Image from "next/image";
import { MdEmail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";
import { UserProps } from "@/interfaces/user";

interface LeftSideProfileProps {
  user: UserProps | null;
}

export default function LeftSideProfile({ user }: LeftSideProfileProps) {
  return (
    <div className="mt-4 hidden w-[300px] space-y-4 rounded-md p-4 shadow md:block">
      <Image
        src={user?.image || "/400.svg"}
        alt="user-photo"
        width={500}
        height={500}
        priority
        className="aspect-square rounded-full object-cover"
      />
      <div className="space-y-2 text-sm">
        <div className="line-clamp-1 flex items-center gap-1 truncate">
          <span className="badge badge-primary text-white">
            {user?.gender || "-"}
          </span>
        </div>
        <div className="line-clamp-1 flex items-center gap-1 truncate">
          <FaUser className="text-primary" size={20} />
          <span>{user?.username}</span>
        </div>
        <div className="line-clamp-1 flex items-center gap-1 truncate">
          <MdEmail className="text-primary" size={20} />
          <span>{user?.email}</span>
        </div>
        <div className="line-clamp-1 flex items-center gap-1 truncate">
          <FaPhone className="text-primary" size={17} />
          <span>{user?.phone_number || "-"}</span>
        </div>
      </div>
    </div>
  );
}
