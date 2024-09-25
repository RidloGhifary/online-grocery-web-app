import { atom } from "jotai";

export const geoAtom = atom<GeolocationPosition|null>(null)
export const geoPermissionAtom  = atom<boolean>(false)
export const geoReadyAtom = atom<boolean>(false)