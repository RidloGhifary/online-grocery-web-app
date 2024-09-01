interface Props {
  className?: string;
  error?: string;
}

export default function ErrorInfo({ className, error }: Props) {
  return (
    <div className={`w-full rounded-md bg-red-500/20 p-6 text-center text-red-500, ${className}`}>
      {error||"Ups, something went wrong!"}
    </div>
  );
}
