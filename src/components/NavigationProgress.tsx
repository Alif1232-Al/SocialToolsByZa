"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export default function NavigationProgress() {
  const pathname = usePathname();
  const prevPath = useRef(pathname);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (prevPath.current !== pathname) {
      prevPath.current = pathname;
      setShow(true);
      const timer = setTimeout(() => setShow(false), 500);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-1 pointer-events-none">
      <div
        className={`h-full bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-500 transition-all duration-500 ease-out ${
          show ? "w-full opacity-100" : "w-0 opacity-0"
        }`}
      />
    </div>
  );
}
