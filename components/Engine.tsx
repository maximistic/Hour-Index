"use client";
import { useEffect } from "react";
import { hourStore } from "@/lib/hour-store";

/** Mounts the hour engine and the scroll-reveal observer. Renders nothing. */
export function Engine() {
  useEffect(() => {
    const stop = hourStore.start();

    // Reveal-on-scroll. Elements are only hidden once JS is running (see globals.css),
    // so the page is fully readable without it.
    document.documentElement.dataset.js = "";
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));

    return () => { stop(); io.disconnect(); };
  }, []);
  return null;
}
