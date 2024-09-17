interface Props {
  className?: string;
}

export default function SectionBannerSkeleton({ className }: Props) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="skeleton h-14 w-40 md:w-52 lg:w-60"></div>
      <div className="skeleton h-10 w-14 md:w-24 lg:w-32"></div>
    </div>
  );
}
