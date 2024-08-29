import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-[50vh] flex-col items-center justify-center gap-3">
      <h1 className="text-4xl font-bold text-primary md:text-6xl lg:text-8xl">
        404
      </h1>
      <p className="text-sm md:text-base">Ups, Page Not Found!</p>
      <Link href="/" className="btn btn-primary btn-sm text-white">
        Back to Home
      </Link>
    </div>
  );
}
