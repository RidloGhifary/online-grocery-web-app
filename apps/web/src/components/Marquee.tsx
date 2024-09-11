"use client";

import { useEffect, useState } from "react";
import FastMarquee from "react-fast-marquee";

export default function Marquee() {
  const [isAccessGranted, setIsAccessGranted] = useState<boolean>(false);

  useEffect(() => {
    if (localStorage.getItem("locationAccess") === "denied") {
      setIsAccessGranted(false);
    } else {
      setIsAccessGranted(true);
    }
  }, []);

  return (
    <div className={`${isAccessGranted ? "hidden" : "block"}`}>
      <FastMarquee gradient={true} pauseOnHover={true}>
        Please enable your location to get suggestion of the nearest product you
        can get.
      </FastMarquee>
    </div>
  );
}
