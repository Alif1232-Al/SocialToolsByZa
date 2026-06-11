"use client";
import { useRef, useState, useEffect, ReactNode } from "react";
import SkeletonShimmer from "./SkeletonShimmer";

interface Props {
  children: ReactNode;
  className?: string;
  once?: boolean;
}

export default function LazyLoadWrapper({ children, className = "", once = true }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoaded(true);
          if (once) observer.unobserve(el);
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  return (
    <div ref={ref} className={className}>
      {loaded ? children : <SkeletonShimmer />}
    </div>
  );
}
