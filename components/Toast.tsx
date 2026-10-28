"use client";
import { useEffect, useRef, useState } from "react";

export const toast = (msg: string) => window.dispatchEvent(new CustomEvent("toast", { detail: msg }));

export const copy = (text: string, msg: string) =>
  (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(
    () => toast(msg),
    () => toast("Copy not available here"),
  );

export function Toast() {
  const [msg, setMsg] = useState("");
  const [show, setShow] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => {
    const on = (e: Event) => {
      setMsg((e as CustomEvent<string>).detail);
      setShow(true);
      clearTimeout(t.current);
      t.current = setTimeout(() => setShow(false), 1800);
    };
    addEventListener("toast", on);
    return () => removeEventListener("toast", on);
  }, []);
  return <div className={`toast${show ? " show" : ""}`} role="status" aria-live="polite">{msg}</div>;
}
