"use client";

import { PulseLoader } from "react-spinners";

export default function Loading() {
  return (
    <div className="flex h-[50vh] items-center justify-center">
      <PulseLoader color="#16a34a" size={30} />
    </div>
  );
}
