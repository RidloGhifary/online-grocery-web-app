import Link from "next/link";

interface SectionBannerProps {
  title: string;
  href: string;
  color?: string;
}

export default function SectionBanner({
  title,
  href,
  color,
}: SectionBannerProps) {
  return (
    <div
      className={`hidden h-[420px] w-[310px] items-start justify-center rounded-md ${!!color ? "bg-[#cfabfe]" : "bg-primary/70"} p-5 text-white md:flex md:flex-col`}
    >
      <h2 className="w-1/2 text-5xl font-bold">{title}</h2>
      <Link href={href}>
        <button className="btn btn-sm mt-3 bg-white transition">
          Shop Now
        </button>
      </Link>
    </div>
  );
}
