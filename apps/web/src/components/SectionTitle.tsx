import Link from "next/link";

interface SectionTitleProps {
  title: string;
  href: string;
}

export default function SectionTitle({ title, href }: SectionTitleProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
      <h2 className="text-2xl font-bold md:text-3xl">{title}</h2>
      <Link href={href} className="text-sm text-blue-500 hover:underline">
        See All
      </Link>
    </div>
  );
}
