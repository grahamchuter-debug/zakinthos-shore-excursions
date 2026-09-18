"use client";

import { useEffect, useRef, useState } from "react";

import type { BookingHeroSlide } from "@/lib/booking/booking-config";

type BookingHeroMediaProps = {
  slides: readonly BookingHeroSlide[];
  className?: string;
  /** Stop rotation (e.g. hero exit / left opening screen). */
  paused?: boolean;
};

const FIRST_HOLD_MS = 3500;
const ROTATION_MS = 6000;

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Full-bleed opening gallery — AVIF/WebP with responsive srcset.
 * JS-driven rotation so we can pause on hidden tabs / off-screen heroes.
 * Static export: formats are pre-generated; no runtime image CDN.
 */
export function BookingHeroMedia({
  slides,
  className = "",
  paused = false,
}: BookingHeroMediaProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const firstAdvancePending = useRef(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    setReducedMotion(prefersReducedMotion());
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducedMotion(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const onVisibility = () => {
      setTabVisible(document.visibilityState === "visible");
    };
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    const node = stageRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting && entry.intersectionRatio >= 0.2);
      },
      { threshold: [0, 0.2, 0.5, 1] },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const canRotate =
    !paused &&
    !reducedMotion &&
    tabVisible &&
    inView &&
    slides.length > 1;

  useEffect(() => {
    if (!canRotate) return;

    const delay = firstAdvancePending.current ? FIRST_HOLD_MS : ROTATION_MS;
    const timer = window.setTimeout(() => {
      firstAdvancePending.current = false;
      setActiveIndex((current) => (current + 1) % slides.length);
    }, delay);

    return () => window.clearTimeout(timer);
  }, [canRotate, activeIndex, slides.length]);

  const nextIndex =
    slides.length > 1 ? (activeIndex + 1) % slides.length : activeIndex;

  return (
    <div
      ref={stageRef}
      className={`book-hero-stage ${className}`.trim()}
      aria-hidden="true"
    >
      {slides.map((slide, index) => {
        const isActive = reducedMotion ? index === 0 : index === activeIndex;
        const shouldLoad =
          index === 0 ||
          index === activeIndex ||
          (!reducedMotion && index === nextIndex);

        return (
          <div
            key={slide.id}
            className={[
              "book-hero-layer",
              isActive ? "is-active" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {shouldLoad ? (
              <picture>
                <source
                  type="image/avif"
                  srcSet={slide.avifSrcSet}
                  sizes="100vw"
                />
                <source
                  type="image/webp"
                  srcSet={slide.webpSrcSet}
                  sizes="100vw"
                />
                <img
                  src={slide.fallbackSrc}
                  alt="Zakynthos shore excursion photography"
                  width={slide.width}
                  height={slide.height}
                  decoding="async"
                  fetchPriority={slide.priority ? "high" : "low"}
                  loading={slide.priority ? "eager" : "lazy"}
                />
              </picture>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
