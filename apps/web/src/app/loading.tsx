import { PulseLoader } from "react-spinners";

export default function Loading() {
  return (
    <div className="flex h-[50vh] items-center justify-center">
      <PulseLoader color="#36d7b7" size={50} />
    </div>
  );
}
