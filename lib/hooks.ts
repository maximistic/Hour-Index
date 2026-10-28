"use client";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { hourStore, type FrameListener } from "./hour-store";

/** The hour, quantised to quarter-hours (returned as hour * 4). Re-renders ~96× a day, not 60× a second. */
export const useQuarter = () =>
  useSyncExternalStore(hourStore.subscribeQuarter, hourStore.getQuarter, hourStore.getServerQuarter);

/** Hour as a float, updated only on quarter boundaries. */
export const useHour = () => useQuarter() / 4;

export const useManual = () =>
  useSyncExternalStore(hourStore.subscribeMode, hourStore.isManual, () => false);

/** Run `cb` on every animation frame the hour changes. Use for imperative DOM writes. */
export function useHourFrame(cb: FrameListener) {
  const ref = useRef(cb);
  ref.current = cb;
  useEffect(() => hourStore.onFrame((h, p) => ref.current(h, p)), []);
}
