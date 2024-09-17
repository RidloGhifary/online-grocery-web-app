interface Props {
  className?: string;
}

export default function CardProductSkeleton({ className }: Props) {
  return (
    <div className={`card flex h-[350px] w-56 flex-col gap-2 ${className}`}>
      <div className="skeleton h-[300px] w-full"></div>
      <div className="skeleton h-4 w-full"></div>
      <div className="skeleton h-4 w-full"></div>
    </div>
  );
}
