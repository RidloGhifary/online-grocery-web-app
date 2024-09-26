'use client'

import { geoAtom, geoPermissionAtom, geoReadyAtom } from "@/stores/geoStores";
import { useAtom } from "jotai";
import { ReactNode, useEffect } from "react";
import { toast } from "react-toastify";

export default function GeoProvider({children}:{children?:ReactNode}) {
  const [, setGeoLocation] = useAtom(geoAtom)
  const [, setGeoPermission] = useAtom(geoPermissionAtom)
  const [, setGeoReady] = useAtom(geoReadyAtom)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGeoLocation(position);
          setGeoReady(true)
          setGeoPermission(true)
        },
        () => {
          setGeoLocation(null); // Even if denied, we proceed without location
          setGeoReady(true)
        },
        { enableHighAccuracy: true, timeout: 10000 },
      );
    } else {
      toast.error("Your browser does not support geolocation");
      setGeoLocation(null); // Even if denied, we proceed without location
      setGeoReady(true)
    }
  }, []);
  return <>{children}</>
}