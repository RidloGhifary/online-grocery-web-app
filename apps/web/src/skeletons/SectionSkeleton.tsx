import CardProductSkeleton from "./CardProductSkeleton";
import SectionBannerSkeleton from "./SectionBannerSkeleton";

export default function SectionSkeleton() {
  return (
    <div className="mt-4 w-full">
      <SectionBannerSkeleton />
      <div className="flex w-full items-center gap-2 overflow-x-auto rounded-box">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardProductSkeleton key={i} className="mt-4" />
        ))}
      </div>
    </div>
  );
}
