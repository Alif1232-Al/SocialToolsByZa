"use client";
import { useRef, useState, useEffect, ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  once?: boolean;
  placeholder?: ReactNode;
}

export default function LazyLoadWrapper({ children, className = "", once = true, placeholder }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  return (
    <div ref={ref} className={className}>
      {inView ? children : (placeholder ?? <div className="min-h-[200px]" />)}
    </div>
  );
}
