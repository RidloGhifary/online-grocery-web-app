interface RightSideProfileProps {
  children?: React.ReactNode;
}

export default function RightSideProfile({ children }: RightSideProfileProps) {
  return (
    <div className="mt-5 w-full rounded-md bg-white p-4 shadow">{children}</div>
  );
}
