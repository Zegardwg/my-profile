"use client";

import { useEffect, useRef } from "react";

/** Progressive enhancement: content stays visible without JS or IntersectionObserver. */
export function useReveal() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (
      !element ||
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            element.dataset.reveal = "visible";
            observer.unobserve(element);
          }
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px 24px 0px" },
    );
    element.dataset.reveal = "waiting";
    observer.observe(element);
    return () => {
      observer.disconnect();
      delete element.dataset.reveal;
    };
  }, []);
  return ref;
}
